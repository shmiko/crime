$(document).ready(function(){
	
	new nyc.Share('#main');
	
	var mapType = new nyc.Radio({
		target:'#map-type-input',
		title: 'Map Type',
		choices: [
			{value: 'precinct', label: 'Precinct Map'},
			{value: 'location', label: 'Crime Location Map'},
			{value: 'heat', label: 'Heat Map'}
		]
	});	

	var crimeType = new nyc.Radio({
		target:'#crime-type-input',
		title: 'Crime Type',
		choices: [
			{value: '*', label: 'All'},
			{value: 'BURGLARY', label: 'Burglary'},
			{value: 'FELONY ASSAULT', label: 'Felony Assault'},
			{value: 'GRAND LARCENY', label: 'Grand Larceny'},
			{value: 'GRAND LARCENY OF MOTOR VEHICLE', label: 'Grand Larceny of Motor Vehicle'},
			{value: 'MURDER', label: 'Murder'},
			{value: 'RAPE', label: 'Rape'},		
			{value: 'ROBBERY', label: 'Robbery'}		
		]
	});	

	cartodb.createVis(
		'map', 
		'https://nycdoitt.cartodb.com/u/timkeane/api/v2/viz/034f45ea-4ce5-11e5-a11d-0e018d66dc29/viz.json'
	).done(function(vis, layers){
		
		var cartoSql = new cartodb.SQL({user: 'timkeane'});

		var locationSql = 
			"SELECT\n" +
			"  ROW_NUMBER() OVER() AS cartodb_id,\n" +
			"  a.the_geom_webmercator,\n" +
			"  a.crime_count,\n" +
			" '${displayType}' AS type,\n" +
			"  ST_X(a.the_geom_webmercator) AS x,\n" +
			"  ST_Y(a.the_geom_webmercator) AS y\n" +
			"FROM\n" +
			"  (\n" +
			"    SELECT\n" +
			"    COUNT(*) AS crime_count, the_geom_webmercator\n" +
			"    FROM stg_crime_location\n" +
			"    WHERE ${where}\n" +
			"    	AND ST_CONTAINS(ST_MAKEENVELOPE(-74.257, 40.496, -73.699, 40.916, 4326), the_geom)\n" +
			"    GROUP BY the_geom_webmercator\n" +
			"  ) a";
			  					
		var precinctSql = 
			"SELECT\n" +
			"  p.cartodb_id,\n" +
			"  p.the_geom_webmercator,\n" +
			"  p.boro,\n" +
			"  p.pop,\n" +
			"  p.name,\n" +
			"  p.pct,\n" +
			"  '${displayType}' AS type,\n" +
			"  COALESCE(c.crime_count, 0) AS crime_count,\n" +
			"  COALESCE(\n" +
			"    ROUND((1000*c.crime_count/p.pop)::NUMERIC, 4),\n" +
			"  0) AS per1000\n" +
			"FROM\n" +
			"  (\n" +
			"    SELECT COUNT(*) as crime_count, pct\n" +
			"      FROM stg_crime_location\n" +
			"      WHERE ${where}\n" +
			"      GROUP BY pct\n" +
			"  ) c\n" +
			"FULL JOIN stg_crime_precinct p\n" +
			"ON p.pct = c.pct";
					
		var precinctChartSql = 
			"SELECT\n" +
			"  p.boro,\n" +
			"  p.pop,\n" +
			"  p.name,\n" +
			"  p.pct,\n" +
			"  '${displayType}' AS type,\n" +
			"  COALESCE(\n" +
			"    ROUND((1000*c.crime_count/p.pop)::NUMERIC, 4),\n" +
			"  0) AS per1000\n" +
			"FROM\n" +
			"  (\n" +
			"    SELECT COUNT(*) as crime_count, pct\n" +
			"    FROM timkeane.stg_crime_location\n" +
			"    WHERE ${where}\n" +
			"      GROUP BY pct\n" +
			"  ) c\n" +
			"FULL JOIN timkeane.stg_crime_precinct p \n" +
			"ON p.pct = c.pct\n" +
			"WHERE p.pct NOT IN (22, -99)\n" +
			"ORDER BY p.pct";

		var summaryChartSql = 
			"SELECT sort_order, label, type, per1000\n" +
			"FROM (\n" + 
			"(\n" + 
			"  SELECT\n" + 
			"    2 AS sort_order,\n" +
			"    'NYC' AS label,\n" + 
			"    '${displayType}' AS type,\n" + 
			"    ROUND((1000*c.crime_count/p.nyc_pop)::numeric, 4) AS per1000\n" + 
			"  FROM\n" + 
			"    (    \n" + 
			"      SELECT SUM(pop) AS nyc_pop, 0 AS p_join\n" + 
			"      FROM stg_crime_precinct\n" + 
			"    ) p,\n" + 
			"    (\n" + 
			"      SELECT COUNT(*) as crime_count, 0 AS c_join\n" + 
			"        FROM stg_crime_location\n" + 
			"        WHERE ${where}\n" + 
			"    ) c\n" + 
			"  WHERE p.p_join = c.c_join\n" + 
			")\n" + 
			"UNION\n" + 
			"(\n" + 
			"  SELECT\n" +
			"    1 AS sort_order,\n" +
			"    '${boroName}' AS label,\n" +
			"    '${displayType}' AS type,\n" +
			"    ROUND((1000*(\n" +
			"          SELECT COUNT(*)\n" +
			"          FROM stg_crime_location\n" +
			"          WHERE boro = ${boro}\n" +
			"          AND ${where}\n" +
			"        )/(\n" +
			"          SELECT SUM(pop)\n" +
			"          FROM stg_crime_precinct\n" +
			"          WHERE boro = ${boro}\n" +
			"        ))::NUMERIC, 4) AS per1000\n" +
			")\n" + 
			"UNION\n" + 
			"(\n" + 
			"  SELECT\n" +
			"    0 AS sort_order,\n" +
			"    name AS label,\n" +
			"    '${displayType}' AS type,\n" +
			"    COALESCE(\n" +
			"      ROUND((1000*(\n" +
			"        SELECT COUNT(*)\n" +
			"        FROM stg_crime_location\n" +
			"        WHERE pct = ${pct}\n" +
			"        AND ${where}\n" +			
			"      )/pop)::NUMERIC, 4),\n" +
			"      0) AS per1000\n" +
			"  FROM stg_crime_precinct\n" +
			"  WHERE pct = ${pct}\n" +
			")\n" +
			") a\n" +
			"ORDER BY sort_order";

		var filters = {
			type: "type = '${type}'",
			mo: "mo BETWEEN ${start} AND ${end}"
		};
		
		var map = vis.getNativeMap();
		map.fitBounds(nyc.leaf.EXTENT);

		var cartoLayer = vis.getLayers()[1];
		var locationLayer = cartoLayer.getSubLayer(1);
		var heatLayer = vis.getLayers()[2];
		
		var precinctSym = new nyc.carto.JenksSymbolizer({
			cartoSql: cartoSql,
			jenksColumn: 'per1000',
			outlierFilter: 'pct NOT IN (22, -99)',
			baseCss: '#stg_crime_precinct{polygon-opacity:0.6;line-color:#000;line-width:1.5;line-opacity:0.5;}#stg_crime_precinct[pct=22]{polygon-fill:black;polygon-opacity:0.2;}#stg_crime_precinct[pct=-99]{polygon-fill:black;polygon-opacity:0.2;}',
			cssRules: ['#stg_crime_precinct[per1000<=${value}][pct!=22][pct!=-99]{polygon-fill:rgb(254,240,217);}', 
				'#stg_crime_precinct[per1000<=${value}][pct!=22][pct!=-99]{polygon-fill:rgb(252,141,89);}',
				'#stg_crime_precinct[per1000<=${value}][pct!=22][pct!=-99]{polygon-fill:rgb(252,141,89);}',
				'#stg_crime_precinct[per1000<=${value}][pct!=22][pct!=-99]{polygon-fill:rgb(227,74,51);}',
				'#stg_crime_precinct[per1000<=${value}][pct!=22][pct!=-99]{polygon-fill:rgb(179,0,0);}']
		});

		
		var locationSym = new nyc.carto.JenksSymbolizer({
			cartoSql: cartoSql,
			jenksColumn: 'crime_count',
			baseCss: '#stg_crime_location{marker-fill-opacity:0.7;marker-line-color:#000;marker-line-width:2;marker-line-opacity:0.5;marker-placement:point;marker-type:ellipse;marker-fill:#5faee7;marker-allow-overlap:true;}',
			cssRules: ['#stg_crime_location[crime_count<=${value}]{marker-width:10;}', 
				'#stg_crime_location[crime_count<=${value}]{marker-width:20;}',
				'#stg_crime_location[crime_count<=${value}]{marker-width:30;}',
				'#stg_crime_location[crime_count<=${value}]{marker-width:40;}',
				'#stg_crime_location[crime_count<=${value}]{marker-width:50;}']
		});
		
		var heatSym = new nyc.carto.HeatSymbolizer({
			map: map,
			layer: heatLayer,
			css: 'Map{\n\t-torque-frame-count:1;\n\t-torque-animation-duration:10;\n\t-torque-time-attribute:"cartodb_id";\n\t-torque-aggregation-function:"count(cartodb_id)";\n\t-torque-resolution:1;\n\t-torque-data-aggregation:linear;\n}\n#stg_crime_loaction{\n\timage-filters:colorize-alpha(\n\t\trgba(0,0,255,0.7),\n\t\trgba(0,255,255,0.7),\n\t\trgba(144,238,144,0.7),\n\t\trgba(255,255,0,0.7),\n\t\trgba(255,165,0,0.7),\n\t\trgba(255,0,0,0.7)\n\t);\n\tmarker-file:url(https://s3.amazonaws.com/com.cartodb.assets.static/alphamarker.png);\n\tmarker-width:${size};\n}'
		});
		var viewSwitcher = new nyc.carto.ViewSwitcher([
			new nyc.carto.View({
				name: 'precinct',
				layer: cartoLayer.getSubLayer(0),
				sqlTemplate: precinctSql,
				descriptionTemplate: '<b>${displayType} per 1000 Residents by Precinct<br>${displayDates}</b>',
				filters: filters,
				symbolizer: precinctSym,
				legend: new nyc.BinLegend(
					'precinct',
					nyc.BinLegend.SymbolType.POLYGON,
					nyc.BinLegend.BinType.RANGE_FLOAT
				)
			}),
			new nyc.carto.View({
				name: 'location',
				layer: locationLayer,
				sqlTemplate: locationSql,
				descriptionTemplate: '<b>${displayType} per Location<br>${displayDates}</b>',
				filters: filters,
				symbolizer: locationSym,
				legend: new nyc.BinLegend(
					'location',
					nyc.BinLegend.SymbolType.POLYGON,
					nyc.BinLegend.BinType.RANGE_INT
				)
			}),
			new nyc.carto.View({
				name: 'heat',
				layer: heatLayer,
				sqlTemplate: 'SELECT * FROM stg_crime_location WHERE ${where}',
				descriptionTemplate: '<b>Concentration of ${displayType}<br>${displayDates}</b>',
				filters: filters,
				symbolizer: heatSym,
				legend: new nyc.Legend('<table class="legend heat"><caption>${caption}</caption><tbody><tr><td class="leg-bin leg-bin-0"></td><td class="leg-bin-desc">Lowest Concentration</td></tr><tr><td class="leg-bin leg-bin-1"></td><td class="leg-bin-desc"></td></tr><tr><td class="leg-bin leg-bin-2"></td><td class="leg-bin-desc"></td></tr><tr><td class="leg-bin leg-bin-3"></td><td class="leg-bin-desc"></td></tr><tr><td class="leg-bin leg-bin-4"></td><td class="leg-bin-desc"></td></tr><tr><td class="leg-bin leg-bin-5"></td><td class="leg-bin-desc">Highest Concentration</td></tr></tbody></table>')	
			})
		]);

		function labelLookup(lbl){
			var label = {
				'14': 'MTS',
				'18': 'MTN',
				'22': 'CPP',
				'-99': 'DOC',
				'Manhattan South Precinct': 'MTS',
				'Manhattan North Precinct': 'MTN',
				'Central Park Precinct': 'CPP',
				'Department of Corections': 'DOC'
			}[lbl] || lbl;
			if (label.length > 13 && label.indexOf('Precinct') > -1) {
				label = label.replace(/Precinct/, 'Pct.');
			}
			return label;
		};
						
		var chartDescription = '<div>${displayType} per 1000 Residents</div>';
			
		var precinctChart = new nyc.carto.Chart({
			cartoSql: cartoSql,
			canvas: '#chart-all canvas',
			sqlTemplate: precinctChartSql,
			descriptionTemplate: chartDescription,
			dataColumn: 'per1000',
			labelColumn: 'pct',
			filters: filters, 
			labelLookupFunction: labelLookup
		});

		var summaryChart = new nyc.carto.Chart({
			cartoSql: cartoSql,
			canvas: '#chart-sum canvas',
			sqlTemplate: summaryChartSql,
			descriptionTemplate: chartDescription,
			dataColumn: 'per1000',
			labelColumn: 'label', 
			filters: filters, 
			labelLookupFunction: labelLookup
		});

		var controls = new nyc.leaf.ZoomSearch(vis.getNativeMap(), true);
		new cartodb.SQL({user: 'timkeane', format: "geoJSON"}).execute('SELECT the_geom, name, pct, boro FROM stg_crime_precinct WHERE pct != -99 ORDER BY pct').done(
			function(data){
				controls.setFeatures('precinct', 'Precinct', 'Search for a precinct...', data.features);
				new cartodb.SQL({user: 'timkeane', format: "geoJSON"}).execute('SELECT the_geom, name, pct, boro FROM stg_crime_precinct WHERE pct = -99').done(
					function(data){
						controls.setFeatures('correction', 'Department of Correction', 'Department of Correction', data.features);
						$('#mnu-srch-typ li.srch-type-correction').click(function(){
							$('#fld-srch li.srch-type-correction').trigger('click');
						});
					}
				);
			}
		);

		cartoSql.execute('SELECT MIN(mo) AS min, MAX(mo) AS max FROM stg_crime_location').done(function(data){
			
			var min = data.rows[0].min + '', max = data.rows[0].max + '';
			
			var dateRange = new nyc.MonthRangePicker({
				target: '#date-range-input',
				title: 'Date Range',
				minMonth: min.substr(4, 2) - 1,
				minYear: min.substr(0, 4) * 1,
				maxMonth: max.substr(4, 2) - 1,
				maxYear: max.substr(0, 4) * 1
			});
			 
			nyc.app = new nyc.App({
				map: map,
				viewSwitcher: viewSwitcher,
				locate: new nyc.leaf.Locate(
					vis.getNativeMap(),
					new nyc.Geoclient('//maps.nyc.gov/geoclient/v1/search.json?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID', 'EPSG:4326'),
					nyc.leaf.EXTENT
				),
				controls: controls,
				mapType: mapType,
				crimeType: crimeType, 
				dateRange: dateRange,
				precinctChart: precinctChart,
				summaryChart: summaryChart,
				locationInfo: new nyc.carto.Dao(
					cartoSql,
					"SELECT pct, boro FROM stg_crime_precinct WHERE ${where}",
					{location: "ST_CONTAINS(the_geom, ST_SETSRID(ST_MAKEPOINT(${lng}, ${lat}), 4326))"}
				),
				crimeDrillDown: new nyc.carto.Dao(
					cartoSql,
					"SELECT count(type) AS crime_count, type FROM stg_crime_location WHERE ${where} GROUP BY type ORDER BY type",
					{
						type: "type = '${type}'",
						mo: "mo BETWEEN ${start} AND ${end}",
						location: "the_geom_webmercator = ST_SETSRID(ST_MAKEPOINT(${x}, ${y}), 3857)",
						pct: "pct = ${pct}"
					}
				)
			});	
			$('div.cartodb-logo').hide();
		});

	});

	$('#copyright').html('&copy; ' + new Date().getFullYear() + ' City of New York');

});
