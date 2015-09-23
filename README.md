# NYC Crime Map
NYC monthly crime data mapping

See [http://www.nyc.gov/html/nypd/html/crime_mapping/nyc_crime_map_introduction.shtml](http://www.nyc.gov/html/nypd/html/crime_mapping/nyc_crime_map_introduction.shtml) for details on NYPD crime data.

This app is a stand-alone HTML5 app that can be dropped into the doc root of any web server.

###Geocoding:###
* To use ```nyc.Geoclient``` as the implementation of ```nyc.Geocoder``` you must first get your Geoclient App ID and App Key from the NYC Developer Portal [https://developer.cityofnewyork.us/api/geoclient-api](https://developer.cityofnewyork.us/api/geoclient-api)
  * Register if you don't have an NYC Developer Portal account
  * Developer Management > View or Create a New Project...
  * Set ```crime.local.geoclient.url='//maps.nyc.gov/geoclient/v1/search.json?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID'``` in ```$GRADLE_USER_HOME/gradle.properties```

###Running Locally:###
* Use ```gradle jettyRun``` to run from project root on local Jetty web server
	* Substitutes ```gradle.properties``` configured Geoclient URL into ``init.js``
	* Allows for viewing live edits [http://localhost:8088/src/main/webapp/](http://localhost:8088/src/main/webapp/)
	* Allows for viewing a build [http://localhost:8088/build/webapp/](http://localhost:8088/build/webapp/)
	* Allows for running QUnit tests [http://localhost:8088/src/test/webapp/](http://localhost:8088/src/test/webapp/)
* Use ```gradle jettyStop``` to stop the server and reset the Geoclient URL
	
###Building and Deploying to NYC DoITT GIS environments:###
* The following proerties should be set in ```$GRADLE_USER_HOME/gradle.properties```
	* __File location properties:__
		* ```archive.dir``` - the location on the remote server to store the zipped application
		* ```mobile.dir``` - the deployment directory for mobile friendly HTML5 apps 
	* __Development environment properties:__
		* ```dev.host``` - the name of the dev server you wish to deploy to 
		* ```dev.user``` - the user on the dev server you wish to use to execute deployment commands
		* ```crime.dev.geoclient.url``` - the Geoclient URL for a dev deployment
	* __Staging environment properties:__
		* ```stg.host``` - the name of the stg server you wish to deploy to 
		* ```stg.user``` - the user on the stg server you wish to use to execute deployment commands
		* ```crime.stg.geoclient.url``` - the Geoclient URL for a stg deployment
	* __Production environment properties:__
		* ```prd.host``` - the name of the prd server you wish to deploy to 
		* ```prd.user``` - the user on the prd server you wish to use to execute deployment commands
		* ```crime.prd.geoclient.url``` - the Geoclient URL for a prd deployment
* __Building the application:__
	* Use ```gradle -Penv=dev buildApp``` to build for gis dev environment
	* Use ```gradle -Penv=stg buildApp``` to build for gis stg environment
	* Use ```gradle -Penv=prd buildApp``` to build for gis prd environment
* __Deploying the application:__
	* Use ```gradle -Penv=dev deploy``` to build and deploy to gis dev environment
	* Use ```gradle -Penv=stg deploy``` to build and deploy to gis stg environment
	* Use ```gradle -Penv=prd deploy``` to build and deploy to gis prd environment
