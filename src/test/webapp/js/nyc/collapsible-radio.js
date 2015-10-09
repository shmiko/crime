QUnit.module('nyc.Radio', {
	beforeEach: function(assert){
		this.CONTAINER = $('<div id="test-div"><div>stuff</div></div>');
		$('body').append(this.CONTAINER);
		
		this.CHOICES = [
			{value: '*', label: 'All'},
			{value: 'BURGLARY', label: 'Burglary'},
			{value: 'FELONY ASSAULT', label: 'Felony Assault'},
			{value: 'GRAND LARCENY', label: 'Grand Larceny'},
			{value: 'GRAND LARCENY OF MOTOR VEHICLE', label: 'Grand Larceny of Motor Vehicle'},
			{value: 'MURDER', label: 'Murder'},
			{value: 'RAPE', label: 'Rape'},		
			{value: 'ROBBERY', label: 'Robbery'}		
		];
		
		this.TEST_RADIO = new nyc.Radio({
			target: this.CONTAINER,
			title: 'Crime Type',
			choices: this.CHOICES
		});			
	},
	afterEach: function(assert){
		delete this.CHOICES;
		delete this.TEST_RADIO;
		this.CONTAINER.remove();
	}
});

QUnit.test('constructor/disabled', function(assert){
	assert.expect(40);
	
	var choices = this.CHOICES;	
	var radio = this.TEST_RADIO;	

	$.each(radio.inputs, function(i, input){
		assert.equal(input.val(), i);
		assert.equal($('label[for="' + input.attr('id') +'"]').html(), choices[i].label);
		assert.notOk(input.prop('disabled'));
		radio.disabled(choices[i].value, true);
		assert.ok(input.prop('disabled'));
		radio.disabled(choices[i].value, false);
		assert.notOk(input.prop('disabled'));
	});
});

QUnit.test('changed', function(assert){
	assert.expect(9);
	
	var done = assert.async();
	
	var choices = this.CHOICES;	
	var radio = this.TEST_RADIO;	
	
	radio.one('change', function(){
		assert.equal('*', radio.val());
	});

	setTimeout(function(){
		$('#test-div input').each(function(i, input){
			radio.one('change', function(){
				assert.equal(choices[i].value, radio.val());
			});
			$(input).trigger('click');
		});
		done();
	}, 500);
});




