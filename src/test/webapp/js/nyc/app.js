QUnit.module('nyc.App', {
	beforeEach: function(assert){
		setup(assert, this);
		var hooks = this;
		
		this.MOCK_MAP = {
			removedLayer: null,
			bounds: null,
			coordinates: null,
			zoom: null,
			options: null,
			panBy: function(args){
				assert.equal(args[0], 0);
				assert.equal(args[1], -20);
			},
			removeLayer: function(layer){
				this.removedLayer = layer;
			},
			fitBounds: function(bnds){
				this.bounds = bnds;
			},
			setView: function(coords, zoom, opts){
				this.coordinates = coords;
				this.zoom = zoom;
				this.options = opts;
			}
		};

		MockViewSwitcher = function(){};
		MockViewSwitcher.prototype = {
			views: {
				precinct: {
					layer: hooks.MOCK_LAYER
				},
				location: {
					layer: hooks.MOCK_LAYER
				}
			}
		};
		nyc.inherits(MockViewSwitcher, nyc.EventHandling);
		this.MOCK_VIEW_SWITCHER = new MockViewSwitcher();
		
		var MockControls = function(){};
		MockControls.prototype = {
			searching: function(bool){
				assert.notOk(bool);
			}
		};
		nyc.inherits(MockControls, nyc.EventHandling);
		this.MOCK_CONTROLS = new MockControls();

		var MockLocate = function(){};
		MockLocate.prototype = {};
		nyc.inherits(MockLocate, nyc.EventHandling);
		this.MOCK_LOCATE = new MockLocate();

		this.MOCK_DAO = {
			resultData: null,
			filters: null,
			data: function(filters, callback){
				this.filters = filters;
				callback(this.resultData);
			}
		} 
		
		var MockRadio = function(){};
		MockRadio.prototype = {
			returnVal: null,
			val: function(){
				return this.returnVal;
			}
		};
		nyc.inherits(MockRadio, nyc.EventHandling);
		
		this.MOCK_MAP_TYPE = new MockRadio();
		this.MOCK_CRIME_TYPE = new MockRadio();
		this.MOCK_DATE_RANGE = new MockRadio();
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.MOCK_MAP;
		delete this.MOCK_VIEW_SWITCHER;
		delete this.MOCK_CONTROLS;
		delete this.MOCK_LOCATE;
		delete this.MOCK_DAO;
		delete this.MOCK_MAP_TYPE;
		delete this.MOCK_CRIME_TYPE;
		delete this.MOCK_DATE_RANGE;
	}	
});

QUnit.test('drillDownLink', function(assert){
	assert.expect(4);
	
	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	
	var infowin = $('<div class="cartodb-popup v2"><div class="cartodb-popup-content"><a class="crime-count"></a><ul class="crime-count-type" style="display:none"></ul></div></div>');
	$('body').append(infowin);
	
	var btn = $('div.cartodb-popup.v2 .cartodb-popup-content .crime-count');
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE
	});	
	
	app.drillDownLink({});
	assert.equal(btn.attr('class'), 'crime-count');
	
	app.drillDownLink({type: 'other', crime_count: 5});
	assert.equal(btn.attr('class'), 'crime-count');
	
	app.drillDownLink({type: 'Crimes', crime_count: 5});
	assert.equal(btn.attr('class'), 'crime-count ui-btn-icon-left ui-icon-carat-d crime-more');

	
	nyc.App.prototype.updateView = updateView;
	infowin.remove();
});

QUnit.test('drillDownLink (click first time)', function(assert){
	assert.expect(6);
	
	var done = assert.async();

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	
	var infowin = $('<div class="cartodb-popup v2"><div class="cartodb-popup-content"><a class="crime-count"></a><ul class="crime-count-type" style="display:none"></ul></div></div>');
	$('body').append(infowin);
	
	var btn = $('div.cartodb-popup.v2 .cartodb-popup-content .crime-count');
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE
	});	
	app.drillDown = function(args){
		assert.deepEqual(args, {type: 'Crimes', crime_count: 5});
	};
	
	app.drillDownLink({type: 'Crimes', crime_count: 5});
	assert.equal(btn.attr('class'), 'crime-count ui-btn-icon-left ui-icon-carat-d crime-more');

	btn.trigger('click');
	assert.notOk(btn.hasClass('ui-icon-carat-d'));
	assert.ok(btn.hasClass('ui-icon-carat-u'));
	
	setTimeout(function(){
		assert.equal($('ul.crime-count-type').css('display'), 'none');
		infowin.remove();
		nyc.App.prototype.updateView = updateView;
		done();
	}, 1000);
});

QUnit.test('drillDownLink (click again)', function(assert){
	assert.expect(6);
	
	var done = assert.async();
	
	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	
	var infowin = $('<div class="cartodb-popup v2"><div class="cartodb-popup-content"><a class="crime-count"></a><ul class="crime-count-type" style="display:none"><li></li></ul></div></div>');
	$('body').append(infowin);
	
	var btn = $('div.cartodb-popup.v2 .cartodb-popup-content .crime-count');
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE
	});	
	app.panPopup = function(args){
		assert.ok(true);
	};
	app.drillDown = function(args){
		assert.notOk(true);
	};
	
	app.drillDownLink({type: 'Crimes', crime_count: 5});
	assert.equal(btn.attr('class'), 'crime-count ui-btn-icon-left ui-icon-carat-d crime-more');

	btn.trigger('click');
	assert.notOk(btn.hasClass('ui-icon-carat-d'));
	assert.ok(btn.hasClass('ui-icon-carat-u'));
	
	setTimeout(function(){
		assert.equal($('ul.crime-count-type').css('display'), 'block');
		infowin.remove();
		nyc.App.prototype.updateView = updateView;
		done();
	}, 1000);
});

QUnit.test('drillDown (precint view)', function(assert){
	assert.expect(7);
			
	var done = assert.async();

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	var infowin = $('<div class="cartodb-popup v2"><div class="cartodb-popup-content"><a class="crime-count"></a><ul class="crime-count-type" style="display:none"></ul></div></div>');
	$('body').append(infowin);
	
	var btn = $('div.cartodb-popup.v2 .cartodb-popup-content .crime-count');

	var rows = [{type: 'a',  crime_count: 5}, {type: 'b',  crime_count: 2}, {type: 'c',  crime_count: 1}];
	this.MOCK_DAO.resultData = {rows: rows};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE,
		crimeDrillDown: this.MOCK_DAO
	});	
	app.panPopup = function(args){
		assert.ok(true);
	};
	app.filters = function(){
		return {filterValues: {filterName: {field: 'value'}}};
	};
	
	app.drillDown({pct: '1'});
	
	assert.deepEqual(this.MOCK_DAO.filters, {filterName: {field: 'value'}, pct: {pct: '1'}});
	
	$('ul.crime-count-type li').each(function(i, li){
		assert.equal($(li).html(), rows[i].crime_count + ' ' + app.crimeTypePlurals[rows[i].type]);
	});
	
	setTimeout(function(){
		assert.equal($('ul.crime-count-type').css('display'), 'block');
		infowin.remove();
		nyc.App.prototype.updateView = updateView;
		done();
	}, 1000);
});

QUnit.test('drillDown (location view)', function(assert){
	assert.expect(7);
			
	var done = assert.async();

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	var infowin = $('<div class="cartodb-popup v2"><div class="cartodb-popup-content"><a class="crime-count"></a><ul class="crime-count-type" style="display:none"></ul></div></div>');
	$('body').append(infowin);
	
	var btn = $('div.cartodb-popup.v2 .cartodb-popup-content .crime-count');

	var rows = [{type: 'a',  crime_count: 5}, {type: 'b',  crime_count: 2}, {type: 'c',  crime_count: 1}];
	this.MOCK_DAO.resultData = {rows: rows};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE,
		crimeDrillDown: this.MOCK_DAO
	});	
	app.panPopup = function(args){
		assert.ok(true);
	};
	app.filters = function(){
		return {filterValues: {filterName: {field: 'value'}}};
	};
	
	app.drillDown({x: '1', y: '2'});
	
	assert.deepEqual(this.MOCK_DAO.filters, {filterName: {field: 'value'}, location: {x: '1', y: '2'}});
	
	$('ul.crime-count-type li').each(function(i, li){
		assert.equal($(li).html(), rows[i].crime_count + ' ' + app.crimeTypePlurals[rows[i].type]);
	});
	
	setTimeout(function(){
		assert.equal($('ul.crime-count-type').css('display'), 'block');
		infowin.remove();
		nyc.App.prototype.updateView = updateView;
		done();
	}, 1000);

});

QUnit.test('hideAllChart', function(assert){
	assert.expect(2);
			
	var done = assert.async();

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	var div = $('<div id="chart-all" style="position:fixed;width:200px;left:0;bottom:0"></div>');
	$('body').append(div);

	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE
	});	

	app.hideAllChart();
	setTimeout(function(){
		assert.equal(div.css('left'), $(window).width() + 50 + 'px');
		nyc.App.prototype.updateView = updateView;
		done();
		div.remove();
	}, 1000);
});

QUnit.test('toggle', function(assert){
	assert.expect(7);
			
	var done = assert.async();

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	var btn = $('<div id="btn-toggle" class="btn-map"></div>');
	var panel = $('<div id="panel"></div>');
	$('body').append(btn);
	$('body').append(panel);

	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE
	});	

	btn.trigger('click');
	assert.ok(btn.hasClass('btn-panel'));
	assert.notOk(btn.hasClass('btn-map'));

	setTimeout(function(){
		assert.equal(panel.css('display'), 'none');
		
		btn.trigger('click');
		assert.notOk(btn.hasClass('btn-panel'));
		assert.ok(btn.hasClass('btn-map'));

		setTimeout(function(){
			assert.equal(panel.css('display'), 'block');
			nyc.App.prototype.updateView = updateView;
			done();
			btn.remove();
			panel.remove();
		}, 1000);

	}, 1000);
});

QUnit.test('panPopup', function(assert){
	assert.expect(3);
			
	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	var infowin = $('<div class="cartodb-infowindow" style="position:fixed;top:-10px;"><div class="cartodb-popup v2"><div class="cartodb-popup-content"><a class="crime-count"></a><ul class="crime-count-type"></ul></div></div></div>');
	$('body').append(infowin);

	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE
	});	

	app.panPopup(); //pan map because popup is above top
	
	this.MOCK_MAP.panBy = function(args){
		assert.notOk(true);
	};
	infowin.css('top', '20px');
	
	app.panPopup(); //do not pan map because popup is below top
	
	infowin.hide();
	
	app.panPopup(); //do not pan map because popup is below top

	nyc.App.prototype.updateView = updateView;
	infowin.remove();
});

QUnit.test('ambiguous (possible)', function(assert){
	assert.expect(2);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE
	});	

	var possible = [{
		type: nyc.Locate.LocateResultType.GEOCODE,
		coordinates: [980691, 195953],
		accuracy: nyc.Geocoder.Accuracy.HIGH,
		name: '2 Broadway, Manhattan, NY 10004'			
	},
	{
		type: nyc.Locate.LocateResultType.GEOCODE,
		coordinates: [1031280, 179178],
		accuracy: nyc.Geocoder.Accuracy.HIGH,
		name: '2 Broadway, Queens, NY 11414'			
	}];
	
	app.alert = function(msg){
		assert.ok(false, 'no alert should be presented');
	};
	app.controls.disambiguate = function(pos){
		assert.equal(pos, possible);
	};

	app.locate.trigger(nyc.Locate.LocateEventType.AMBIGUOUS, {possible: possible});
	
	nyc.App.prototype.updateView = updateView;

});

QUnit.test('ambiguous (bad input)', function(assert){
	assert.expect(3);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE
	});	

	app.alert = function(msg){
		assert.equal(msg, app.content.message('bad_input'));
	};
	app.controls.disambiguate = function(pos){
		assert.ok(false, 'controls.disambiguate should not get called');
	};
	
	app.locate.trigger(nyc.Locate.LocateEventType.AMBIGUOUS, {possible: []});

	nyc.App.prototype.updateView = updateView;
});

QUnit.test('currentPrecinct (precinct != null, boro != null)', function(assert){
	assert.expect(10);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE
	});	
	app.updateSummaryChart = function(){
		assert.ok(true);
	};
	app.location = {coordinates: [1, 2]};
	
	app.currentPrecinct({pct: 2, boro: 1});
	
	assert.equal(app.precinct, 2);
	assert.equal(app.boro, 1);
	
	app.currentPrecinct({policePrecinct: 2, boroughCode1In: 1});
	
	assert.equal(app.precinct, 2);
	assert.equal(app.boro, 1);
	
	app.currentPrecinct({leftSegmentPolicePrecinct: 2, boroughCode1In: 1});
	
	assert.equal(app.precinct, 2);
	assert.equal(app.boro, 1);
	
	nyc.App.prototype.updateView = updateView;
});

QUnit.test('currentPrecinct (precinct = null, boro != null)', function(assert){
	assert.expect(5);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	this.MOCK_DAO.resultData = {rows: [{pct: 2, boro: 1}]};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});	
	app.updateSummaryChart = function(){
		assert.ok(true);
	};
	app.location = {coordinates: [1, 2]};
	
	app.currentPrecinct({boro: 1});
	
	assert.equal(app.precinct, 2);
	assert.equal(app.boro, 1);
	assert.deepEqual(this.MOCK_DAO.filters, {location: {lng: 1, lat: 2}});

	nyc.App.prototype.updateView = updateView;
});

QUnit.test('currentPrecinct (precinct != null, boro = null)', function(assert){
	assert.expect(5);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	this.MOCK_DAO.resultData = {rows: [{pct: 2, boro: 1}]};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});	
	app.updateSummaryChart = function(){
		assert.ok(true);
	};
	app.location = {coordinates: [1, 2]};
	
	app.currentPrecinct({pct: 2});
	
	assert.equal(app.precinct, 2);
	assert.equal(app.boro, 1);
	assert.deepEqual(this.MOCK_DAO.filters, {location: {lng: 1, lat: 2}});

	nyc.App.prototype.updateView = updateView;
});

QUnit.test('currentPrecinct (no chart)', function(assert){
	assert.expect(5);

	var div = $('<div id="chart-sum"></div>');
	$('body').append(div);
	
	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	this.MOCK_DAO.resultData = {rows: []};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});	
	app.updateSummaryChart = function(){
		assert.notOk(true);
	};
	app.location = {coordinates: [1, 2]};
	
	app.currentPrecinct({pct: 2});
	
	assert.equal(app.precinct, 2);
	assert.notOk(app.boro);
	assert.ok(div.hasClass('chart-none'));
	assert.deepEqual(this.MOCK_DAO.filters, {location: {lng: 1, lat: 2}});

	nyc.App.prototype.updateView = updateView;
	div.remove();
});

QUnit.test('located (nyc.Locate.LocateEventType.GEOLOCATION, coordiantes != null, locationLayer = null)', function(assert){
	assert.expect(5);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	var locationData = {coordinates: [1, 2], data: 'mockData'};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});	
	app.locatedCoords = function(data){
		assert.deepEqual(data, locationData);
	};
	app.locatedGeoJson = function(data){
		assert.notOk(true);
	};
	app.currentPrecinct = function(data){
		assert.equal(data, locationData.data);
	};

	this.MOCK_LOCATE.trigger(nyc.Locate.LocateEventType.GEOLOCATION, locationData);
	
	assert.notOk(this.MOCK_MAP.removedLayer);
	
	nyc.App.prototype.updateView = updateView;
});

QUnit.test('located (nyc.Locate.LocateEventType.GEOCODE, coordiantes = null, locationLayer != null)', function(assert){
	assert.expect(5);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	var locationData = {data: 'mockData'};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});
	app.locationLayer = 'mockLayer';
	app.locatedCoords = function(data){
		assert.notOk(true);
	};
	app.locatedGeoJson = function(data){
		assert.deepEqual(data, locationData);
	};
	app.currentPrecinct = function(data){
		assert.equal(data, locationData.data);
	};

	this.MOCK_LOCATE.trigger(nyc.Locate.LocateEventType.GEOLOCATION, locationData);
	
	assert.equal(this.MOCK_MAP.removedLayer, 'mockLayer');

	nyc.App.prototype.updateView = updateView;
});

QUnit.test('locatedGeoJson', function(assert){
	assert.expect(5);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	var locationData = {data: 'mockData'};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});

	var geoJson = L.geoJson;
	L.geoJson = function(geoJson, opts){
		return {
			geoJson: geoJson,
			options: opts,
			addTo: function(map){
				assert.deepEqual(app.map, map);
				return this;
			},
			getBounds: function(){
				return 'mockBounds';
			}
		}
	};
	
	var geoJsonData = {geoJsonGeometry: 'mockGeoJsonGeometry'};
	
	app.locatedGeoJson(geoJsonData);
	
	assert.deepEqual(app.locationLayer.geoJson, {type: 'Feature', geometry: geoJsonData.geoJsonGeometry});
	assert.deepEqual(app.locationLayer.options.style(), {weight: 10, color: 'black', fill: false});
	assert.equal(app.map.bounds, 'mockBounds');
	
	L.geoJson = geoJson;
	nyc.App.prototype.updateView = updateView;
});

QUnit.test('locatedCoords', function(assert){
	assert.expect(7);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	var locationData = {data: 'mockData'};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});

	var marker = L.marker;
	L.marker = function(coords, opts){
		return {
			coords: coords,
			options: opts,
			addTo: function(map){
				assert.deepEqual(app.map, map);
				return this;
			},
			getBounds: function(){
				return 'mockBounds';
			}
		}
	};
	
	var coordsData = {coordinates: [1, 2], name: 'fred'};
	
	app.locatedCoords(coordsData);
	
	assert.deepEqual(app.locationLayer.coords, [2, 1]);
	assert.deepEqual(app.locationLayer.options, {icon: app.icon, title: coordsData.name});
	
	assert.deepEqual(app.map.coordinates, [2, 1]);
	assert.equal(app.map.zoom, nyc.leaf.Locate.ZOOM_LEVEL);
	assert.deepEqual(app.map.options, {pan: {animate: true}, zoom: {animate: true}});
	
	L.marker = marker;
	nyc.App.prototype.updateView = updateView;
});

QUnit.test('winWidth', function(assert){
	assert.expect(2);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});

	assert.equal(app.winWidth(), $(window).width());
});

QUnit.test('resize (large display)', function(assert){
	assert.expect(3);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	var winWidth = nyc.App.prototype.winWidth;
	nyc.App.prototype.winWidth = function(){
		return 500;
	};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});
	
	var panel = $('<div id="panel" style="display:none;"></div>');
	var div = $('<div id="chart-all" style="position:fixed;width:200px;left:0;bottom:0"></div>');
	$('body').append(panel);
	$('body').append(div);	
	
	$(window).trigger('resize');
	assert.equal(div.position().left, 0);
	assert.equal(panel.css('display'), 'block'); 
	
	div.remove();
	panel.remove();
	nyc.App.prototype.updateView = updateView;
	nyc.App.prototype.winWidth = winWidth;
});

QUnit.test('resize (small display)', function(assert){
	assert.expect(3);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	var winWidth = nyc.App.prototype.winWidth;
	nyc.App.prototype.winWidth = function(){
		return 400;
	};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: new nyc.EventHandling(), 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});
	
	var panel = $('<div id="panel" style="display:none;"></div>');
	var div = $('<div id="chart-all" style="position:fixed;width:200px;left:100px;bottom:0"></div>');
	$('body').append(panel);
	$('body').append(div);	
	
	$(window).trigger('resize');
	assert.equal(div.css('left'), 450 + 'px');
	assert.equal(panel.css('display'), 'none'); 
	
	div.remove();
	panel.remove();
	nyc.App.prototype.updateView = updateView;
	nyc.App.prototype.winWidth = winWidth;
});

QUnit.test('filters (type = "*", no location)', function(assert){
	assert.expect(2);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: this.MOCK_CRIME_TYPE, 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});
	
	this.MOCK_CRIME_TYPE.returnVal = '*';
	this.MOCK_DATE_RANGE.returnVal = {start: new Date('2014-01-01T05:00:00.000Z'), end: new Date('2014-10-31T05:00:00.000Z')};
	
	assert.deepEqual(
		app.filters(),
		{
			filterValues: {
				mo: {start: 201401, end: 201410},
				displayType: {displayType: 'Crimes'}
			},
			descriptionValues: {
				displayType: 'Crimes',
				displayDates: '1/1/2014 - 10/31/2014'
			}
		}
	);
	
	nyc.App.prototype.updateView = updateView;
});

QUnit.test('filters (type = "ROBBERY", has location)', function(assert){
	assert.expect(2);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: this.MOCK_CRIME_TYPE, 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});
	app.location = {};
	app.precinct = 2;
	app.boro = 1;
	
	this.MOCK_CRIME_TYPE.returnVal = 'ROBBERY';
	this.MOCK_DATE_RANGE.returnVal = {start: new Date('2014-01-01T05:00:00.000Z'), end: new Date('2014-10-31T05:00:00.000Z')};
	
	assert.deepEqual(
		app.filters(),
		{
			filterValues: {
				mo: {start: 201401, end: 201410},
				type: {type: 'ROBBERY'},
				displayType: {displayType: 'Robberies'},
				pct: {pct: 2},
				boro: {boro: 1},
				boroName: {boroName: 'Manhattan'}
			},
			descriptionValues: {
				displayType: 'Robberies',
				displayDates: '1/1/2014 - 10/31/2014'
			}
		}
	);
	
	nyc.App.prototype.updateView = updateView;
});

QUnit.test('chartFilters (one series)', function(assert){
	assert.expect(4);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: this.MOCK_CRIME_TYPE, 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});
	app.location = {};
	app.precinct = 2;
	app.boro = 1;
	
	var dates = {start: new Date('2014-01-01T05:00:00.000Z'), end: new Date('2014-10-31T05:00:00.000Z')};
	this.MOCK_CRIME_TYPE.returnVal = 'ROBBERY';
	this.MOCK_DATE_RANGE.returnVal = dates;

	app.secondSeries = function(start, end){
		assert.deepEqual(start, dates.start);
		assert.deepEqual(end, dates.end);
		return false;
	};

	assert.deepEqual(
		app.chartFilters(),
		{
			filterValues: [{
				mo: {start: 201401, end: 201410},
				type: {type: 'ROBBERY'},
				displayType: {displayType: 'Robberies'},
				pct: {pct: 2},
				boro: {boro: 1},
				boroName: {boroName: 'Manhattan'}
			}],
			descriptionValues: {
				displayType: 'Robberies',
				seriesTitles: ['1/1/2014 - 10/31/2014']
			}
		}
	);
	
	nyc.App.prototype.updateView = updateView;
});

QUnit.test('chartFilters (two series)', function(assert){
	assert.expect(4);

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	
	var app = new nyc.App({
		map: this.MOCK_MAP,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: this.MOCK_LOCATE,
		controls: this.MOCK_CONTROLS,
		mapType: this.MOCK_MAP_TYPE,
		crimeType: this.MOCK_CRIME_TYPE, 
		dateRange: this.MOCK_DATE_RANGE,
		locationInfo: this.MOCK_DAO
	});
	app.location = {};
	app.precinct = 2;
	app.boro = 1;
	
	var dates = {start: new Date('2014-01-01T05:00:00.000Z'), end: new Date('2014-10-31T05:00:00.000Z')};
	this.MOCK_CRIME_TYPE.returnVal = 'ROBBERY';
	this.MOCK_DATE_RANGE.returnVal = dates;

	app.secondSeries = function(start, end){
		assert.deepEqual(start, dates.start);
		assert.deepEqual(end, dates.end);
		return true;
	};

	assert.deepEqual(
		app.chartFilters(),
		{
			filterValues: [
				{
					mo: {start: 201401, end: 201410},
					type: {type: 'ROBBERY'},
					displayType: {displayType: 'Robberies'},
					pct: {pct: 2},
					boro: {boro: 1},
					boroName: {boroName: 'Manhattan'}
				},
				{
					mo: {start: 201501, end: 201510},
					type: {type: 'ROBBERY'},
					displayType: {displayType: 'Robberies'},
					pct: {pct: 2},
					boro: {boro: 1},
					boroName: {boroName: 'Manhattan'}
				}
            ],
			descriptionValues: {
				displayType: 'Robberies',
				seriesTitles: ['1/1/2014 - 10/31/2014', '1/1/2015 - 10/31/2015']
			}
		}
	);
	
	nyc.App.prototype.updateView = updateView;
});

