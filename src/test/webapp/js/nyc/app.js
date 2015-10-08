QUnit.module('nyc.App', {
	beforeEach: function(assert){
		setup(assert, this);
		var hooks = this;
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
		
		this.MOCK_DAO = {
			resultData: null,
			filters: null,
			data: function(filters, callback){
				this.filters = filters;
				callback(this.resultData);
			}
		} 
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.MOCK_VIEW_SWITCHER;
		delete this.MOCK_DAO;
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
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: new nyc.EventHandling(),
		controls: new nyc.EventHandling(),
		mapType: new nyc.EventHandling(),
		crimeType: new nyc.EventHandling(), 
		dateRange: new nyc.EventHandling()
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
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: new nyc.EventHandling(),
		controls: new nyc.EventHandling(),
		mapType: new nyc.EventHandling(),
		crimeType: new nyc.EventHandling(), 
		dateRange: new nyc.EventHandling()
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
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: new nyc.EventHandling(),
		controls: new nyc.EventHandling(),
		mapType: new nyc.EventHandling(),
		crimeType: new nyc.EventHandling(), 
		dateRange: new nyc.EventHandling()
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
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: new nyc.EventHandling(),
		controls: new nyc.EventHandling(),
		mapType: new nyc.EventHandling(),
		crimeType: new nyc.EventHandling(), 
		dateRange: new nyc.EventHandling(),
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
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: new nyc.EventHandling(),
		controls: new nyc.EventHandling(),
		mapType: new nyc.EventHandling(),
		crimeType: new nyc.EventHandling(), 
		dateRange: new nyc.EventHandling(),
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
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: new nyc.EventHandling(),
		controls: new nyc.EventHandling(),
		mapType: new nyc.EventHandling(),
		crimeType: new nyc.EventHandling(), 
		dateRange: new nyc.EventHandling()
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
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: new nyc.EventHandling(),
		controls: new nyc.EventHandling(),
		mapType: new nyc.EventHandling(),
		crimeType: new nyc.EventHandling(), 
		dateRange: new nyc.EventHandling()
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

	var mockMap = {
		panBy: function(args){
			assert.equal(args[0], 0);
			assert.equal(args[1], -20);
		}
	};

	var infowin = $('<div class="cartodb-infowindow" style="position:fixed;top:-10px;"><div class="cartodb-popup v2"><div class="cartodb-popup-content"><a class="crime-count"></a><ul class="crime-count-type"></ul></div></div></div>');
	$('body').append(infowin);

	var app = new nyc.App({
		map: mockMap,
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: new nyc.EventHandling(),
		controls: new nyc.EventHandling(),
		mapType: new nyc.EventHandling(),
		crimeType: new nyc.EventHandling(), 
		dateRange: new nyc.EventHandling()
	});	

	app.panPopup(); //pan map because popup is above top
	
	mockMap.panBy = function(args){
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
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: new nyc.EventHandling(),
		controls: new nyc.EventHandling(),
		mapType: new nyc.EventHandling(),
		crimeType: new nyc.EventHandling(), 
		dateRange: new nyc.EventHandling()
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

	var MockControls = function(){};
	MockControls.prototype = {
		searching: function(bool){
			assert.notOk(bool);
		}
	};
	nyc.inherits(MockControls, nyc.EventHandling);
	
	var app = new nyc.App({
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: new nyc.EventHandling(),
		controls: new MockControls(),
		mapType: new nyc.EventHandling(),
		crimeType: new nyc.EventHandling(), 
		dateRange: new nyc.EventHandling()
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
		viewSwitcher: this.MOCK_VIEW_SWITCHER,
		locate: new nyc.EventHandling(),
		controls: new nyc.EventHandling(),
		mapType: new nyc.EventHandling(),
		crimeType: new nyc.EventHandling(), 
		dateRange: new nyc.EventHandling()
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
