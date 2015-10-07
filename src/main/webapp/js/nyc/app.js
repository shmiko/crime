/** 
 * @export 
 * @namespace
 */
window.nyc = window.nyc || {};

/**
 * Object type to hold constructor options for nyc.App
 * @export
 * @typedef {Object}
 * @property {L.Map} map
 * @property {nyc.carto.ViewSwtcher} viewSwitcher
 * @property {nyc.Locate} locate
 * @property {nyc.ZoomSearch} controls
 * @property {nyc.Radio} mapType
 * @property {nyc.Radio} crimeType
 * @property {nyc.MonthRangePicker} dateRange
 * @property {nyc.Chart} precinctChart
 * @property {nyc.Chart} summaryChart
 * @property {nyc.carto.Dao} locationInfo
 * @property {nyc.carto.Dao} crimeDrillDown
 */
nyc.AppOptions;

/**
 * @export
 * @class
 * @classdesc A class to manage user interaction with the hurricane map
 * @constructor
 * @param {nyc.AppOptions} options
 */
nyc.App = function(options){
	var me = this;
	me.map = options.map;
	me.viewSwitcher = options.viewSwitcher;
	me.locate = options.locate;
	me.controls = options.controls;
	me.mapType = options.mapType;
	me.crimeType = options.crimeType;
	me.dateRange = options.dateRange;
	me.precinctChart = options.precinctChart;
	me.summaryChart = options.summaryChart;
	me.locationInfo = options.locationInfo;
	me.crimeDrillDown = options.crimeDrillDown;
	
	me.viewSwitcher.views.location.layer.infowindow.set({maxHeight: "none", sanitizeTemplate: false});
	me.viewSwitcher.views.precinct.layer.infowindow.set({maxHeight: "none", sanitizeTemplate: false});
	
	me.viewSwitcher.on('updated', me.updateLegend);
	me.mapType.on('change', function(){$('#legend').empty();});
	me.mapType.on('change', $.proxy(me.updateView, me));
	me.crimeType.on('change', $.proxy(me.updateView, me));
	me.dateRange.on('change', $.proxy(me.updateView, me));
	
	me.locate.on(nyc.Locate.LocateEventType.GEOCODE, $.proxy(me.located, me));
	me.locate.on(nyc.Locate.LocateEventType.GEOLOCATION, $.proxy(me.located, me));
	me.locate.on(nyc.Locate.LocateEventType.ERROR, $.proxy(me.error, me));
	me.locate.on(nyc.Locate.LocateEventType.AMBIGUOUS, $.proxy(me.ambiguous, me));

	me.controls.on(nyc.ZoomSearch.EventType.SEARCH, $.proxy(me.locate.search, me.locate));
	me.controls.on(nyc.ZoomSearch.EventType.GEOLOCATE, $.proxy(me.locate.locate, me.locate));
	me.controls.on(nyc.ZoomSearch.EventType.DISAMBIGUATED, $.proxy(me.located, me));

	$('#btn-toggle').click(me.toggle);
	$('#chart-pane').collapsible({
		expand: function(){
			me.updateSummaryChart();
		}
	});
	$(window).resize(me.resize);
	$('#chart-all').css('left', $(window).width() + 50 + 'px');

	$('*').mousemove(me.hideTip);
	
	me.updateView();
};

nyc.App.prototype = {
	/**
	 * @private
	 * @member {nyc.Locate.LocateResult}
	 */
	location: null,
	/**
	 * @private
	 * @member {L.Marker|L.GeoJSON}
	 */
	locationLayer: null,
	/**
	 * @private
	 * @member {L.icon}
	 */
	icon: L.icon({
	    iconUrl: 'img/me0.svg',
	    iconSize: [38, 95],
	    iconAnchor: [22, 94]
	}),
	/**
	 * @private
	 * @member {Object.<string, string>}
	 */
	crimeTypePlurals: {
		'*': 'Crimes',
		BURGLARY: 'Burglaries',
		'FELONY ASSAULT': 'Felony Assaults',
		'GRAND LARCENY': 'Grand Larcenies',
		'GRAND LARCENY OF MOTOR VEHICLE': 'Grand Larcenies of Motor Vehicles',
		MURDER: 'Murders',
		RAPE: 'Rapes',
		ROBBERY: 'Robberies'
	},
	/** 
	 * @export
	 * @method
	 * @param {Object} args
	 */
	drillDownLink: function(args){
		if (args.type == 'Crimes' && args.crime_count){
			var me = this, btn = $('div.cartodb-popup.v2 .cartodb-popup-content .crime-count');
			btn.addClass('ui-btn-icon-left')
				.addClass('ui-icon-carat-d')
				.addClass('crime-more')
				.click(function(e){
					var list = $('div.cartodb-popup.v2 div.cartodb-popup-content ul.crime-count-type');
					btn.toggleClass('ui-icon-carat-d')
						.toggleClass('ui-icon-carat-u');
					if (list.children().length == 0){
						me.drillDown(args);
					}else{
						list.slideToggle($.proxy(me.panPopup, me));
					}
				});
		}
	},
	/** 
	 * @private
	 * @method
	 * @param {Object} args
	 */
	drillDown: function(args){
		var me = this, filters = me.filters().filterValues;
		if (args.pct){
			filters.pct = {pct: args.pct};
		}else{
			filters.location = {x: args.x, y: args.y};
		}
		this.crimeDrillDown.data(filters, function(data){
			var list = $('div.cartodb-popup.v2 div.cartodb-popup-content ul.crime-count-type');			
			$.each(data.rows, function(_, row){
				list.append(
					'<li class="crime-type-count">' + row.crime_count + ' ' + me.crimeTypePlurals[row.type] + '</li>'
				);
			});
			list.slideToggle($.proxy(me.panPopup, me));
		});
	},
	/**
	 * @export
	 * @method
	 */
	hideAllChart: function(){
		$('#chart-all').animate({left: $(window).width() + 50});		
	},
	/** 
	 * @export 
	 * @method
	 * @param {Object} e
	 */
	toggle: function(e){
		var btn = $(e.target), showMap = btn.hasClass('btn-map');
		btn[showMap ? 'removeClass' : 'addClass']('btn-map')
		   [showMap ? 'addClass' : 'removeClass']('btn-panel');
		$('#panel').slideToggle();
	},
	/** 
	 * @private
	 * @method
	 */
	panPopup: function(){
		var list = $('div.cartodb-popup.v2 .cartodb-popup-content .crime-count-type');
		if (list.css('display') == 'block'){
			var infoTop = $(".cartodb-infowindow").position().top;
			if (infoTop < 0){
				this.map.panBy([0, infoTop - 10]);
			}
		}
	},
	/** 
	 * @private 
	 * @method
	 * @param {nyc.Locate.LocateAmbiguous} data
	 */
	ambiguous: function(data){
		if (data.possible.length){
			this.controls.disambiguate(data.possible);
		}else{
			this.controls.searching(false);
			this.error('The location you entered was not understood');
		}
	},
	/** 
	 * @private 
	 * @method
	 * @param {nyc.Locate.LocateResult} data
	 */
	currentPrecinct: function(data){
		var me = this, lngLat = me.location.coordinates;
		data = data || {};
		me.precinct = data.pct || data.policePrecinct || data.leftSegmentPolicePrecinct;
		me.boro = data.boro || data.boroughCode1In;
		if (!me.precinct || !me.boro){
			me.locationInfo.data(
				{location: {lng: lngLat[0], lat: lngLat[1]}}, 
				function(data){
					if (data.rows.length){
						me.precinct = data.rows[0].pct;
						me.boro = data.rows[0].boro;
						me.updateSummaryChart();
					}else{
						$('#chart-sum').addClass('chart-none');
					}
				}
			);
		}else{
			me.updateSummaryChart();
		}
	},
	/** 
	 * @private 
	 * @method
	 * @param {nyc.Locate.LocateResult} data
	 */
	located: function(data){
		this.location = data;
		this.controls.searching(false);
		this.currentPrecinct(data.data);		
		if (this.locationLayer){
			this.map.removeLayer(this.locationLayer);			
		}
		if (data.coordinates){
			this.locatedCoords(data);
		}else{
			this.locatedGeoJson(data);
		}
	},
	/** 
	 * @private 
	 * @method
	 * @param {nyc.Locate.LocateResult} data
	 */
	locatedGeoJson: function(data){
		this.locationLayer = L.geoJson({type: 'Feature', geometry: data.geoJsonGeometry}, {
			style: function(feature){
		        return {weight: 10, color: 'black', fill: false};
		    }
		}).addTo(this.map);
		this.map.fitBounds(this.locationLayer.getBounds());
	},
	/** 
	 * @private 
	 * @method
	 * @param {nyc.Locate.LocateResult} data
	 */
	locatedCoords: function(data){
		var coords = data.coordinates;
		coords = [coords[1], coords[0]];
		this.locationLayer = L.marker(coords, {icon: this.icon, title: data.name}).addTo(this.map);
		this.map.setView(coords, nyc.leaf.Locate.ZOOM_LEVEL, {pan: {animate: true}, zoom: {animate: true}});
	},
	/**
	 * @private
	 * @method
	 */
	resize: function(){
		if ($('#chart-all').position().left > 0){
			$('#chart-all').css('left', $(window).width() + 50 + 'px');
		}
		if ($(window).width() >= 495){
			$('#panel').show();
		}
	},
	/** 
	 * @private
	 * @method
	 * @return {Object}
	 */
	chartFilters: function(){
		var series0 = this.filters(),
			start = this.dateRange.val().start,
			end = this.dateRange.val().end,
			result = {
				filterValues: [series0.filterValues],
				descriptionValues: {
					displayType: series0.descriptionValues.displayType,
					seriesTitles: [series0.descriptionValues.displayDates]
				}
			};
		
		if (this.secondSeries(start, end)){
			var series1 = this.filters(end.getFullYear() == new Date().getFullYear() ? -1 : 1);
			result.filterValues.push(series1.filterValues);
			result.descriptionValues.seriesTitles.push(series1.descriptionValues.displayDates);
		}
		return result;
	},
	/** 
	 * @private 
	 * @method
	 * @param {Object} start
	 * @param {Object} end
	 * @return {boolean}
	 */
	secondSeries: function(start, end){
		if (start.getFullYear() == end.getFullYear()){
			if (start.getFullYear() == new Date().getFullYear()) return true; 
			if (this.dateRange.maxMonth >= end.getMonth()) return true;
		}
		return false;
	},
	/** 
	 * @private 
	 * @method
	 * @param {Object} date
	 * @param {number=} yearOffset
	 * @return {Object}
	 */
	date: function(date, yearOffset){
		yearOffset = yearOffset || 0;
		date = new Date(date);
		date.setFullYear(date.getFullYear() + yearOffset);
		return date;
	},
	/** 
	 * @private 
	 * @method
	 * @param {number=} yearOffset
	 * @return {Object}
	 */
	filters: function(yearOffset){
		var crimeType = this.crimeType.val(),
			start = this.date(this.dateRange.val().start, yearOffset),
			end = this.date(this.dateRange.val().end, yearOffset),
			descriptionValues = {
				displayType: this.crimeTypePlurals[crimeType],
				displayDates: start.toLocaleDateString() + ' - ' + end.toLocaleDateString()
			},
			filterValues = {
				mo: {
					start: (start.getFullYear() * 100) + start.getMonth() + 1,
					end: (end.getFullYear() * 100) + end.getMonth() + 1
				},
				displayType: {displayType: this.crimeTypePlurals[crimeType]}
			};
		if (crimeType != '*'){
			filterValues.type = {type: crimeType};
		}
		this.appendLocationFilters(filterValues);
		return {filterValues: filterValues, descriptionValues: descriptionValues};
	},
	/** 
	 * @private 
	 * @method
	 * @param {Array<Object>} yearOffset
	 */
	appendLocationFilters: function(filterValues){
		if (this.location){
			filterValues.pct = {pct: this.precinct};
			filterValues.boro = {boro: this.boro};
			filterValues.boroName = {
				boroName: {'1': 'Manhattan', '2': 'Bronx', '3': 'Brooklyn', '4': 'Queens', '5': 'Staten Isl.'}[this.boro]
			};
		}		
	},
	/**
	 * @private
	 * @method
	 */
	updateView: function(){
		var filters = this.filters();
		$('#spinner').show();
		$('#ui-id-10').prop('disabled', this.mapType.val() != 'precinct').checkboxradio('refresh');
		$('#ui-id-2, #ui-id-3').prop('disabled', this.crimeType.val() == 'RAPE').checkboxradio('refresh');
		this.viewSwitcher.switchView(this.mapType.val(), filters.filterValues, filters.descriptionValues);
		this.updatePrecinctChart();		
		this.updateSummaryChart();
	},
	/** 
	 * @private 
	 * @method
	 * @param {JQuery|Element|string} yearOffset
	 */
	updateLegend: function(legendHtml){
		$('#spinner').hide();
		$('#legend').html(legendHtml);
		$('#first-load').fadeOut();
	},
	/**
	 * @private
	 * @method
	 */
	updateSummaryChart: function(){
		if (this.location && $('#chart-sum:visible').length){
			var filters = this.chartFilters();
			this.summaryChart.chart(filters.filterValues, $('#chart-sum .chart-title'), filters.descriptionValues);
			$('#chart-sum').removeClass('chart-none');
		}
	},
	/**
	 * @private
	 * @method
	 */
	showPrecinctChart: function(){
		this.updatePrecinctChart();		
		$('#chart-all').animate({left: 0}, $.proxy(this.updatePrecinctChart, this));
	},
	/**
	 * @private
	 * @method
	 */
	updatePrecinctChart: function(){
		if ($('#chart-all').position().left < $(window).width()){
			var filters = this.chartFilters();
			this.precinctChart.chart(filters.filterValues, $('#chart-all .chart-title'), filters.descriptionValues);		
		}
	},
	/**
	 * @private 
	 * @method
	 * @param {string} msg
	 */
	error: function(msg){
		$('#alert .alert-msg').html(msg);
		$('#alert').fadeIn();
		$('#alert button').focus();
		this.controls.searching(false);
	},
	/**
	 * @private 
	 * @method
	 * @param {Object} e
	 */
	hideTip: function(e){
		var map = $('#map').get(0), pop = $('.cartodb-popup').get(0);
		if ((map && !$.contains(map, e.target)) || (pop && $.contains(pop, e.target))){
			$('.cartodb-tooltip').hide();
		}
	}
}