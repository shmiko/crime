QUnit.config.requireExpects = true;

function setup(assert, hooks){
	hooks.GEOCLIENT_URL = '//maps.nyc.gov/geoclient/v1/search.json?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID';
	hooks.GEOCLIENT_URL = '//maps.nyc.gov/geoclient/v1/search.json?app_key=A159073974562987C&app_id=hurricane-evac';
};

function teardown(assert, hooks){
};