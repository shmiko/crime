QUnit.config.requireExpects = true;

function setup(assert, hooks){
	hooks.GEOCLIENT_URL = '//maps.nyc.gov/geoclient/v1/search.json?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID';
	
	hooks.MOCK_LAYER = {
		css: null,
		sql: null,
		showHide: null,
		getSQL: function(){
			return 'LAYER_SQL';
		},
		setSQL: function(sql){
			this.sql = sql;
		},
		setCartoCSS: function(css){
			this.css = css;
		},
		hide: function(){
			this.showHide = 'hide';
		},
		show: function(){
			this.showHide = 'show';
		}
	};
	
	var MockCartoSql = function(){this.sqls = [];};
	MockCartoSql.prototype = {
		callNum: 0,
		returnDatas: null,
		sqls: null,
		execute: function(sql){
			this.sqls.push(sql);
			return this;
		},
		done: function(callback){
			callback.apply(this, [this.returnDatas[this.callNum]]);
			this.callNum++;
		}		
	}
	hooks.MOCK_CARTO_SQL = new MockCartoSql();
};

function teardown(assert, hooks){
	delete hooks.GEOCLIENT_URL;
	delete hooks.MOCK_LAYER;	
	delete hooks.MOCK_CARTO_SQL;	
};