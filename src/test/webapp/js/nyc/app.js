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
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.MOCK_VIEW_SWITCHER;
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
		map: {},
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
	assert.expect(4);
	
	var done = assert.async();

	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	
	var infowin = $('<div class="cartodb-popup v2"><div class="cartodb-popup-content"><a class="crime-count"></a><ul class="crime-count-type" style="display:none"></ul></div></div>');
	$('body').append(infowin);
	
	var btn = $('div.cartodb-popup.v2 .cartodb-popup-content .crime-count');
	
	var app = new nyc.App({
		map: {},
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
	
	setTimeout(function(){
		assert.equal($('ul.crime-count-type').css('display'), 'none');
		nyc.App.prototype.updateView = updateView;
		infowin.remove();
		done();
	}, 1000);
	
});

QUnit.test('drillDownLink (click again)', function(assert){
	assert.expect(4);
	
	var done = assert.async();
	
	var updateView = nyc.App.prototype.updateView;
	nyc.App.prototype.updateView = function(){
		assert.ok(true);
	};
	
	var infowin = $('<div class="cartodb-popup v2"><div class="cartodb-popup-content"><a class="crime-count"></a><ul class="crime-count-type" style="display:none"><li></li></ul></div></div>');
	$('body').append(infowin);
	
	var btn = $('div.cartodb-popup.v2 .cartodb-popup-content .crime-count');
	
	var app = new nyc.App({
		map: {},
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
	
	setTimeout(function(){
		assert.equal($('ul.crime-count-type').css('display'), 'block');
		nyc.App.prototype.updateView = updateView;
		infowin.remove();
		done();
	}, 1000);

});