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
		nyc.App.prototype.updateView = updateView;
		infowin.remove();
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
		nyc.App.prototype.updateView = updateView;
		infowin.remove();
		done();
	}, 1000);

});

/*
QUnit.test('drillDown (precint view)', function(assert){
	assert.expect(6);
			
	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};

	var infowin = $('<div class="cartodb-popup v2"><div class="cartodb-popup-content"><a class="crime-count"></a><ul class="crime-count-type" style="display:none"><li></li></ul></div></div>');
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
	app.filters = function(){
		return {filterValues: 'mockFilterValues'};
	};
	
	app.drillDown({pct: '1'});
	
	assert.equal(this.MOCK_DAO.filters, 'mockFilterValues');
	assert.equal(this.MOCK_DAO.filters.pct, '1');
	
	$('ul.crime-count-type li').each(function(i, li){
		assert.equal($(li).html(), rows[i].crime_count + ' ' + app.crimeTypePlurals[rows[i].type]);
	});
	
	infowin.remove();
});
*/