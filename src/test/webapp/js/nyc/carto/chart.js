QUnit.module('nyc.nyc.carto.Chart', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('chart (isSame = false)', function(assert){
	assert.expect(10);
	
	var precinctChartSql = 
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
	var filters = {
		type: "type = '${type}'",
		mo: "mo BETWEEN ${start} AND ${end}"
	};
	
	this.MOCK_CARTO_SQL.returnDatas = [{rows: 'dataset0'}, {rows: 'dataset1'}];
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		sqlTemplate: precinctChartSql,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: filters,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});
	
	chart.render = function(canvas, datasets){
		assert.equal(canvas, 'MockCanvas');
		assert.equal(datasets.length, 2);
		assert.equal(datasets[0], 'dataset0');
		assert.equal(datasets[1], 'dataset1');
	};
	
	chart.title = function(titleNode, descriptionValues){
		assert.equal(titleNode, 'MockTitleNode');
		assert.equal(descriptionValues, 'descriptions');
	};
	
	chart.isSame = function(canvas, sqls){
		assert.equal(canvas, 'MockCanvas');
		assert.equal(sqls.length, 2);
		assert.equal(sqls[0],
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
			"ORDER BY p.pct"				
		);
		assert.equal(sqls[1],
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
		);
		return false;
	};
	
	chart.chart(
		'MockCanvas',
		[{
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
		}],
		'MockTitleNode',
		'descriptions'
	);
});

QUnit.test('chart (isSame = true)', function(assert){
	assert.expect(8);
	
	var precinctChartSql = 
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
	var filters = {
		type: "type = '${type}'",
		mo: "mo BETWEEN ${start} AND ${end}"
	};
	
	this.MOCK_CARTO_SQL.returnDatas = [{rows: 'dataset0'}, {rows: 'dataset1'}];
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		sqlTemplate: precinctChartSql,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: filters,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});

	var same = false;
	chart.isSame = function(canvas, sqls){
		assert.equal(canvas, 'MockCanvas');
		assert.equal(sqls.length, 2);
		assert.equal(sqls[0],
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
			"ORDER BY p.pct"				
		);
		assert.equal(sqls[1],
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
		);
		return same;
	};
	same = true;
	
	chart.chart(
		'MockCanvas',
		[{
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
		}],
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
		'MockCanvas',
		[{
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
		}],
		'MockTitleNode',
		'descriptions'
	);
});