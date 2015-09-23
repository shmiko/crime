/** 
 * @export 
 * @namespace
 */
window.nyc = window.nyc || {};
/** 
 * @export 
 * @namespace
 */
nyc.carto = nyc.carto || {};

/**
 * @export
 * @class
 * @classdesc Class for replacing values in SQL strings
 * @constructor
 * @extends {nyc.ReplaceTokens}
 */
nyc.carto.SqlTemplate = function(){};
nyc.carto.SqlTemplate.prototype = {
	/**
	 * @private
	 * @method 
	 * @param {string} template
	 * @param {Object} values
	 * @param {Object=} filters
	 * @return {string}
	 */
	sql: function(template, values, filters){
		var result = new String(template), where = '';
		for (var column in values){
			var filter = filters ? new String(filters[column] || '') : '', vals = values[column];
			if (values){
				result = this.replace(result, vals);
				filter = this.replace(filter, vals);
				if (where && filter){
					where += ' AND ';
				}
				where += filter;				
			}
		}
		result = this.replace(result, {where: where});
		return result;
	}
};
nyc.inherits(nyc.carto.SqlTemplate, nyc.ReplaceTokens);

/**
 * @export
 * @class
 * @classdesc Class for managing SQL views on layers 
 * @constructor
 * @extends {nyc.carto.SqlTemplate}
 * @mixes {nyc.EventHandling}
 * @param {cartodb.SQL} cartoSql
 * @param {string} jenksColumn
 * @param {string} outlierFilter
 * @param {string} baseCss
 * @param {Array<string>} cssRules 
 */
nyc.carto.JenksSymbolizer = function(cartoSql, jenksColumn, outlierFilter, baseCss, cssRules){
	this.cartoSql = cartoSql;
	this.baseCss = baseCss;
	this.cssRules = cssRules;
	this.jenksSql = this.replace(this.jenksSql, {column: jenksColumn, binCount: cssRules.length});
	if (outlierFilter){
		this.jenksSql += (' AND ' + outlierFilter);
	}
};

nyc.carto.JenksSymbolizer.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	jenksSql: 'SELECT CDB_JENKSBINS(ARRAY_AGG(a.${column}::numeric), ${binCount}) FROM (${sql}) a WHERE a.${column} IS NOT NULL',
	/**
	 * @private
	 * @member {cartodb.SQL}
	 */
	cartoSql: null,
	/**
	 * @private
	 * @member {string}
	 */
	baseCss: null,
	/**
	 * @private
	 * @member {Array<string>}
	 */
	cssRules: null,
	/** 
	 * @export 
	 * @method 
	 * @param {cartodb.Layer} layer
	 */
	symbolize: function(layer){
		var me = this, jenksSql = me.replace(me.jenksSql, {sql: layer.getSQL()});
		me.cartoSql.execute(jenksSql).done(function(data){
			var bins = me.bins(data.rows[0].cdb_jenksbins);
			me.applyCss(layer, bins);
			me.trigger('symbolized', bins);
		});
	},
	/**
	 * @private 
	 * @method 
	 * @param {cartodb.Layer} layer
	 * @param {Array<number>} bins
	 */
	applyCss: function(layer, bins){
		var css = this.baseCss;
		if (bins){
			for (var i = bins.length - 1; i >= 0; i--){
				css += this.replace(this.cssRules[i], {value: bins[i]});
			};
		}
		layer.setCartoCSS(css);
	},
	/**
	 * @private 
	 * @method 
	 * @param {Object} jenksbins
	 * @return {Array<number>}
	 */
	bins: function(jenksbins){
		var bins = [];
		if (jenksbins){
			bins.push(jenksbins[0]);
			for (var bin in jenksbins){
				if ($.inArray(jenksbins[bin], bins) == -1){
					bins.push(jenksbins[bin]);
				}
			}
			while (bins[0] == null){
				bins.shift();
			}
		}
		return bins;
	}
};

nyc.inherits(nyc.carto.JenksSymbolizer, nyc.EventHandling);
nyc.inherits(nyc.carto.JenksSymbolizer, nyc.carto.SqlTemplate);

/**
 * @export
 * @class
 * @classdesc Class for managing SQL views on layers 
 * @constructor
 * @extends {nyc.carto.SqlTemplate}
 * @mixes {nyc.EventHandling}
 * @param {string} name
 * @param {cartodb.Layer} layer
 * @param {string} sqlTemplate
 * @param {string} descriptionTemplate
 * @param {Object} filters
 * @param {nyc.carto.JenksSymbolizer} symbolizer
 * @param {string} legendTemplate
 */
nyc.carto.View = function(name, layer, sqlTemplate, descriptionTemplate, filters, symbolizer, legend){
	var me = this;
	me.name = name;
	me.layer = layer;
	me.sqlTemplate = sqlTemplate;
	me.filters = filters;
	me.symbolizer = symbolizer;
	me.descriptionTemplate = descriptionTemplate || '';
	me.legend = legend;
};

nyc.carto.View.prototype = {
	/**
	 * @private
	 * @member {cartodb.Layer}
	 */
	layer: null,
	/**
	 * @private
	 * @member {string}
	 */
	sqlTemplate: null,
	/**
	 * @private
	 * @member {string}
	 */
	descriptionTemplate: null,
	/**
	 * @private
	 * @member {Array<Object>}
	 */
	filters: null,
	/**
	 * @private
	 * @member {nyc.carto.JenksSymbolizer}
	 */
	symbolizer: null,
	/**
	 * @private
	 * @member {nyc.Legend}
	 */
	legend: null,
	/**
	 * @export
	 * @method
	 * @param {Object} filterValues
	 * @param {Object} descriptionValues
	 */
	update: function(filterValues, descriptionValues){
		var me = this,
			sql = me.sql(me.sqlTemplate, filterValues, me.filters),
			desc = me.replace(me.descriptionTemplate, descriptionValues);
		me.layer.setSQL(sql);
		if (me.symbolizer){
			me.symbolizer.symbolize(me.layer);
			me.symbolizer.one('symbolized', function(bins){
				me.trigger('updated', me.legend.html(desc, bins));
			});
		}else{
			me.trigger('updated', me.legend.html(desc));
		}
	},
	/**
	 * @export
	 * @method
	 * @param {boolean} visible
	 */
	visibility: function(visible){
		this.layer[visible ? 'show' : 'hide']();
	}
};

nyc.inherits(nyc.carto.View, nyc.EventHandling);
nyc.inherits(nyc.carto.View, nyc.carto.SqlTemplate);

/**
 * @export
 * @class
 * @classdesc Class for managing named instances of nyc.View 
 * @constructor
 * @extends {nyc.EventHandling}
 * @param {Array<nyc.carto.View>} views
 */
nyc.carto.ViewSwitcher = function(views){
	var me = this;
	me.views = {}; 
	$.each(views, function(_, view){
		me.views[view.name] = view;
		view.on('updated', function(legendHtml){
			me.trigger('updated', legendHtml);
		});
	});
};

nyc.carto.ViewSwitcher.prototype = {
	/**
	 * @private
	 * @member {Object.<string, nyc.carto.View>}
	 */
	views: null,
	/**
	 * @export
	 * @method
	 * @param {string} viewName
	 * @param {Object} filterValues
	 * @param {Object} descriptionValues
	 */
	switchView: function(viewName, filterValues, descriptionValues){
		$('.cartodb-infowindow').fadeOut();
		for (var name in this.views) {
			var view = this.views[name];
			if (view){
				if (viewName == name){
					var me = this;
					view.update(filterValues, descriptionValues);
					view.visibility(true);
				}else{
					view.visibility(false);
				}
			}
		}
	}
};

nyc.inherits(nyc.carto.ViewSwitcher, nyc.EventHandling);

/**
 * @export
 * @class
 * @classdesc CartoDB data access class
 * @constructor
 * @extends {nyc.carto.SqlTemplate}
 * @param {cartodb.SQL} cartoSql
 * @param {string} sqlTemplate
 * @param {Object} filters
 */
nyc.carto.Dao = function(cartoSql, sqlTemplate, filters){
	this.cartoSql = cartoSql;
	this.sqlTemplate = sqlTemplate;
	this.filters = filters;
};

nyc.carto.Dao.prototype = {
	/**
	 * @private
	 * @member {cartodb.SQL}
	 */
	cartoSql: null,
	/**
	 * @private
	 * @member {Object}
	 */
	filters: null,
	/**
	 * @private
	 * @member {string}
	 */
	sqlTemplate: null, 
	/**
	 * @export
	 * @method
	 * @param {Object} filterValues
	 * @param {function(Object)} callback
	 */
	data: function(filterValues, callback){
		var sql = this.sql(this.sqlTemplate, filterValues, this.filters);
		this.cartoSql.execute(sql).done(callback);
	}
};

nyc.inherits(nyc.carto.Dao, nyc.carto.SqlTemplate);
