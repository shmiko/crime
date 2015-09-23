/** 
 * @export 
 * @namespace
 */
window.nyc = window.nyc || {};

/**
 * @export
 * @class
 * @classdesc Collapsible radio buttons
 * @constructor
 * @extends {nyc.Collapsible}
 * @param {Object} options
 */
nyc.Radio = function(options){
	var me = this, fieldset = $('<fieldset data-role="controlgroup"></fieldset>'), radio0;
	
	me.choices = options.choices;

	nyc.Radio.uniqueId++;
	
	$.each(me.choices, function(i, choice){
		var input = $('<input type="radio">').uniqueId(),
			label = $('<label></label>');
		input.attr('name', 'nyc-radio-name' + '-' + nyc.Radio.uniqueId)
			.attr('value', i);
		if (i == 0){
			radio0 = input;
			radio0.attr('checked', true);
		}
		input.click($.proxy(me.changed, me));
		label.attr('for', input.attr('id'))
			.html(choice.label);
		fieldset.append(input)
			.append(label);
	});
	
	$(options.target).append(fieldset).trigger('create');

	nyc.Collapsible.apply(this, [options]);
		
	setTimeout(function(){
		me.changed({target: radio0[0]});
	}, 1);
};

nyc.Radio.prototype = {
	/** 
	 * @private
	 * @method
	 * @param {Object} e
	 */
	changed: function(e){
		var choice = this.choices[e.target.value * 1];
		this.value = choice.value;
		this.currentVal.html(choice.label);
		this.trigger('change', choice);
	},
	/** 
	 * Returns the date range value
	 * @export
	 * @method
	 * @return {string}
	 */
	val: function(){
		return this.value;
	}
};

nyc.inherits(nyc.Radio, nyc.Collapsible);

/** 
 * @export
 * @static {number}
 */
nyc.Radio.uniqueId = 0;