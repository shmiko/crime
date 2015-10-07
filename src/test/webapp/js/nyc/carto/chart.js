QUnit.module('nyc.nyc.carto.Chart', {
	beforeEach: function(assert){
		setup(assert, this);
		this.SQL_TEMPLATE = 
			"SELECT\n" +
			"  p.boro,\n" +
			"  p.pop,\n" +
			"  p.pct,\n" +
			"  '${displayType}' AS type,\n" +
			"  ROUND((1000*c.crime_count/p.pop)::numeric, 4) AS per1000\n" +
			"FROM\n" +
			"  stg_crime_precinct p,\n" +
			"  (\n" +
			"    SELECT COUNT(*) as crime_count, pct\n" + 
			"      FROM stg_crime_location\n" +
			"      WHERE ${where}\n" +
			"      GROUP BY pct\n" +
			"  ) c\n" +
			"WHERE p.pct = c.pct\n" +
			"	AND p.pct NOT IN (22, -99)\n" +
			"ORDER BY p.pct";
		this.FILTERS = {
			type: "type = '${type}'",
			mo: "mo BETWEEN ${start} AND ${end}"
		};
		this.SERIES_SQL = [
			"SELECT\n" +
			"  p.boro,\n" +
			"  p.pop,\n" +
			"  p.pct,\n" +
			"  'Crimes' AS type,\n" +
			"  ROUND((1000*c.crime_count/p.pop)::numeric, 4) AS per1000\n" +
			"FROM\n" +
			"  stg_crime_precinct p,\n" +
			"  (\n" +
			"    SELECT COUNT(*) as crime_count, pct\n" + 
			"      FROM stg_crime_location\n" +
			"      WHERE mo BETWEEN 201507 AND 201507\n" +
			"      GROUP BY pct\n" +
			"  ) c\n" +
			"WHERE p.pct = c.pct\n" +
			"	AND p.pct NOT IN (22, -99)\n" +
			"ORDER BY p.pct",	
			"SELECT\n" +
			"  p.boro,\n" +
			"  p.pop,\n" +
			"  p.pct,\n" +
			"  'Crimes' AS type,\n" +
			"  ROUND((1000*c.crime_count/p.pop)::numeric, 4) AS per1000\n" +
			"FROM\n" +
			"  stg_crime_precinct p,\n" +
			"  (\n" +
			"    SELECT COUNT(*) as crime_count, pct\n" + 
			"      FROM stg_crime_location\n" +
			"      WHERE mo BETWEEN 201407 AND 201407\n" +
			"      GROUP BY pct\n" +
			"  ) c\n" +
			"WHERE p.pct = c.pct\n" +
			"	AND p.pct NOT IN (22, -99)\n" +
			"ORDER BY p.pct"
        ];
		this.FILTER_VALUES = [{
				mo: {start: 201507, end: 201507},
				displayType: {displayType: 'Crimes'},
				pct: {pct: 7},
				boro: {boro: 1},
				boroName: {boroName: 'Manhattan'}
			},
			{
				mo: {start: 201407, end: 201407},
				displayType: {displayType: 'Crimes'},
				pct: {pct: 7},
				boro: {boro: 1},
				boroName: {boroName: 'Manhattan'}
		}];
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('chart (isSame = false)', function(assert){
	assert.expect(8);
	
	var me = this;
	
	this.MOCK_CARTO_SQL.returnDatas = [{rows: 'dataset0'}, {rows: 'dataset1'}];
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		canvas: null,
		sqlTemplate: this.SQL_TEMPLATE,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: this.FILTERS,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});
	
	chart.render = function(datasets){
		assert.equal(datasets.length, 2);
		assert.equal(datasets[0], 'dataset0');
		assert.equal(datasets[1], 'dataset1');
	};
	
	chart.title = function(titleNode, descriptionValues){
		assert.equal(titleNode, 'MockTitleNode');
		assert.equal(descriptionValues, 'descriptions');
	};
	
	chart.isSame = function(sqls){
		assert.equal(sqls.length, 2);
		assert.equal(sqls[0], me.SERIES_SQL[0]);
		assert.equal(sqls[1], me.SERIES_SQL[1]);
		return false;
	};
	
	chart.chart(
		this.FILTER_VALUES,
		'MockTitleNode',
		'descriptions'
	);
});

QUnit.test('chart (isSame = true)', function(assert){
	assert.expect(6);
	
	var me = this;
	
	this.MOCK_CARTO_SQL.returnDatas = [{rows: 'dataset0'}, {rows: 'dataset1'}];
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		canvas: null,
		sqlTemplate: this.SQL_TEMPLATE,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: this.FILTERS,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});

	var same = false;
	chart.isSame = function(sqls){
		assert.equal(sqls.length, 2);
		assert.equal(sqls[0], me.SERIES_SQL[0]);
		assert.equal(sqls[1], me.SERIES_SQL[1]);
		return same;
	};
	same = true;
	
	chart.chart(
		this.FILTER_VALUES,
		'MockTitleNode',
		'descriptions'
	);
	
	chart.render = function(canvas, datasets){
		assert.notOk(true);
	};
	
	chart.title = function(titleNode, descriptionValues){
		assert.notOk(true);
	};
	
	chart.chart(
		this.FILTER_VALUES,
		'MockTitleNode',
		'descriptions'
	);
});

QUnit.test('chart (only one series)', function(assert){
	assert.expect(6);
	
	var me = this;
	
	this.MOCK_CARTO_SQL.returnDatas = [{rows: 'dataset0'}];
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		canvas: null,
		sqlTemplate: this.SQL_TEMPLATE,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: this.FILTERS,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});
	
	chart.render = function(datasets){
		assert.equal(datasets.length, 1);
		assert.equal(datasets[0], 'dataset0');
	};
	
	chart.title = function(titleNode, descriptionValues){
		assert.equal(titleNode, 'MockTitleNode');
		assert.equal(descriptionValues, 'descriptions');
	};
	
	chart.isSame = function(sqls){
		assert.equal(sqls.length, 1);
		assert.equal(sqls[0], me.SERIES_SQL[0]);
		return false;
	};
	
	chart.chart(
		[this.FILTER_VALUES[0]],
		'MockTitleNode',
		'descriptions'
	);
});

