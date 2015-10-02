QUnit.module('nyc.Radio', {});

QUnit.test('changed', function(assert){
	assert.expect(9);
	
	var done = assert.async();
	
	var div = $('<div id="test-div"><div>stuff</div></div>');
	$('body').append(div);
	
	var choices = [
		{value: '*', label: 'All'},
		{value: 'BURGLARY', label: 'Burglary'},
		{value: 'FELONY ASSAULT', label: 'Felony Assault'},
		{value: 'GRAND LARCENY', label: 'Grand Larceny'},
		{value: 'GRAND LARCENY OF MOTOR VEHICLE', label: 'Grand Larceny of Motor Vehicle'},
		{value: 'MURDER', label: 'Murder'},
		{value: 'RAPE', label: 'Rape'},		
		{value: 'ROBBERY', label: 'Robbery'}		
	];
	
	var radio = new nyc.Radio({
		target: div,
		title: 'Crime Type',
		choices: choices
	});	
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
		div.remove();
		done();
	}, 500);
});