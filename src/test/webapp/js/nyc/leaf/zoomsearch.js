QUnit.module('nyc.leaf.ZoomSearch', {
	beforeEach: function(assert){
		setup(assert, this);
		this.POSSIBLE_LOCATIONS = [{
			type: nyc.Locate.LocateResultType.GEOCODE,
			coordinates: [1, 2],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			name: '2 Broadway, Manhattan, NY 10004',
			geoJsonGeometry: null,
			data: 'data'
		},
		{
			type: nyc.Locate.LocateResultType.GEOCODE,
			coordinates: [3, 4],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			name: '2 Broadway, Queens, NY 11414',
			geoJsonGeometry: null,
			data: 'data'			
		},
		{
			type: nyc.Locate.LocateResultType.GEOCODE,
			coordinates: [5, 6],
			accuracy: nyc.Geocoder.Accuracy.MEDIUM,
			name: '2 Broadway, Staten Is, NY 10310',
			geoJsonGeometry: null,
			data: 'data'			
		}];
		$('body').append('<div><div id="test-map"></div></div>');
		this.MOCK_MAP = {
			zoom: 0,
			getZoom: function(){
				return this.zoom;
			},
			setZoom: function(z){
				return this.zoom = z;
			},
			getContainer: function(){
				return $('#test-map');
			}
		};
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.POSSIBLE_LOCATIONS;
		$('#test-map').parent().remove();
	}
});

QUnit.test('zoom', function(assert){
	assert.expect(2);

	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP);
	var zoom = this.MOCK_MAP.getZoom();
	$('#btn-z-in').trigger('click');
	assert.equal(this.MOCK_MAP.getZoom(), zoom + 1);
	$('#btn-z-out').trigger('click');
	assert.equal(this.MOCK_MAP.getZoom(), zoom);
});

QUnit.test('key (keyCode = 13)', function(assert){
	assert.expect(1);

	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP);
	control.one(nyc.ZoomSearch.EventType.SEARCH, function(data){
		assert.equal(data, 'my address');
	}); 
	$('#fld-srch-container input').val(' my address ');
	 var evt = $.Event('keyup');
	 evt.keyCode = 13;
	 $('#fld-srch-container input').trigger(evt);
});

QUnit.test('key (keyCode != 13)', function(assert){
	assert.expect(1);

	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP);
	var handled = false;
	control.one(nyc.ZoomSearch.EventType.SEARCH, function(data){
		handled = true;
	}); 
	$('#fld-srch-container input').val(' my address ');
	 var evt = $.Event('keyup');
	 evt.keyCode = 0;
	 $('#fld-srch-container input').trigger(evt);
	 assert.notOk(handled);
});

QUnit.test('triggerSearch (input = "my address")', function(assert){
	assert.expect(2);

	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP);
	control.searching = function(show){
		assert.ok(show);
	};
	control.one(nyc.ZoomSearch.EventType.SEARCH, function(data){
		assert.equal(data, 'my address');
	}); 
	$('#fld-srch-container input').val(' my address ');
	control.triggerSearch();
});

QUnit.test('triggerSearch (no input)', function(assert){
	assert.expect(2);

	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP);
	control.searching = function(show){
		assert.ok(false, 'searching should not be called');
	};
	var handled = false;
	var handler = function(){handled = true;};
	control.on(nyc.ZoomSearch.EventType.SEARCH, handler); 
	$('#fld-srch-container input').val('');
	control.triggerSearch();
	assert.notOk(handled);
	$('#fld-srch-container input').val(' ');
	control.triggerSearch();
	assert.notOk(handled);
	control.off(nyc.ZoomSearch.EventType.SEARCH, handler); 
});

QUnit.test('val', function(assert){
	assert.expect(4);

	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP);
	control.searching = function(show){
		assert.notOk(show);
	};

	$('#fld-srch-container input').val('my address');
	assert.equal(control.val(), 'my address');
	assert.equal(control.val('your address'), 'your address');
	assert.equal(control.val(), 'your address');
});

QUnit.test('disambiguate', function(assert){
	assert.expect(6);
	
	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP);
	assert.equal(control.list.height(), 0);
	control.disambiguate(this.POSSIBLE_LOCATIONS);
	assert.ok(control.list.height() > 0);
	assert.equal(control.list.children().length, 3);
	assert.equal($(control.list.children()[0]).html(), '2 Broadway, Manhattan, NY 10004');
	assert.equal($(control.list.children()[1]).html(), '2 Broadway, Queens, NY 11414');
	assert.equal($(control.list.children()[2]).html(), '2 Broadway, Staten Is, NY 10310');
});

QUnit.test('disambiguated', function(assert){
	assert.expect(6);
	var possible = this.POSSIBLE_LOCATIONS;
	
	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP);
	assert.equal(control.list.height(), 0);
	control.disambiguate(possible);
	assert.ok(control.list.height() > 0);
	assert.equal(control.list.children().length, 3);

	control.one(nyc.ZoomSearch.EventType.DISAMBIGUATED, function(data){
		assert.deepEqual(data, possible[0]);
	}); 
	$(control.list.children()[0]).trigger('click');
	
	control.one(nyc.ZoomSearch.EventType.DISAMBIGUATED, function(data){
		assert.deepEqual(data, possible[1]);
	}); 
	$(control.list.children()[1]).trigger('click');
	
	control.one(nyc.ZoomSearch.EventType.DISAMBIGUATED, function(data){
		assert.deepEqual(data, possible[2]);
	}); 
	$(control.list.children()[2]).trigger('click');
});

QUnit.test('searching', function(assert){
	assert.expect(3);

	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP);
	assert.notOk($('#fld-srch-container a.ui-input-clear').hasClass('searching'));
	
	control.searching(true);
	assert.ok($('#fld-srch-container a.ui-input-clear').hasClass('searching'));
	
	control.searching(false);
	assert.notOk($('#fld-srch-container a.ui-input-clear').hasClass('searching'));
});
