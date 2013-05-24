(function() {
	"use strict";

	var SENSOR_IDS = {
		META: 			1,
		COMPAS: 		2,
		ACCELEROMETER: 	3,
		GPS: 			4,
		CONNECTION: 	5
	};

	/**
	 * A little helper function to shorten document.getElementById
	 * @param  {string} id The element id
	 * @return {DOM Element}    The dom element with the given Id
	 */
	var get = function (id) {
		return document.getElementById(id);
	};

	// ###################################### COMPAS ######################################

	var compassWatchId = null;

	/**
	 * Initialize the compass watch so we get the degree
	 * @param  {int} freq The update frequency in ms
	 */
	var initCompass = function (freq) {
		freq = freq || 100;
		var options = { frequency: freq };
		if(!compassWatchId) {
			compassWatchId = navigator.compass.watchHeading(onSuccess, onError, options);
		} else {
			alert("Error!");
		}
	};

	/**
	 * Creates the closure for the success function and retruns given function
	 * @return {Function} The onSuccess function
	 */
	var onSuccess = function (heading) {
		window.fileIO.write(SENSOR_IDS.COMPAS + ',' + heading.timestamp + ',' + heading.magneticHeading + ',' + heading.trueHeading + ',\n');
	};

	/**
	 * Compass error handler
	 * @param  {compassError} compassError Passed by PhoneGap
	 */
	var onError = function (compassError) {
		console.log(compassError.code);
	};

	// ###################################### ACCELEROMETER ######################################
	
	var accWatchId = null;

	var initAcc = function (freq) {
		freq = freq || 10000;
		var options = { frequency: freq }
		if(!accWatchId) {
			accWatchId = navigator.accelerometer.watchAcceleration(onSuccessAcc, onErrorAcc, options);
		}
	};

	var onSuccessAcc = function (acceleration) {
		window.fileIO.write(SENSOR_IDS.ACCELEROMETER + ',' + acceleration.timestamp + ',' + acceleration.x + ',' + acceleration.y + ',' + acceleration.z + '\n');
	};

	var onErrorAcc = function () {
		alert("Error! ACCELEROMETER!")	
	};

	// ###################################### GEOLOCATION ######################################
	
	var geoWatchId = null;

	var initGeo = function () {
		var options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
		if(!geoWatchId) {
			geoWatchId = navigator.geolocation.watchPosition(onSuccessGeo, onErrorGeo, options);
		}
	};

	var onSuccessGeo = function (position) {
		window.fileIO.write(SENSOR_IDS.GPS + ',' + position.timestamp + ',' + position.coords.latitude + ',' + position.coords.longitude + ',' + position.coords.altitude + '\n');
	};

	var onErrorGeo = function () {
		alert("Error! GEOLOCATION!")	
	};

	// ###################################### CONNECTION ######################################

	/**
	 * Initializes the connection checker.
	 * @param  {Integer} interval The check interval in ms
	 */
	var initCheckConnection = function (interval) {
		interval = interval || 1000;
		var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
        var lastTime = Date.now();
        var checkConnection = function () {
			var networkState = navigator.connection.type;
			window.fileIO.write(SENSOR_IDS.CONNECTION + ',' + Date.now() + ',' + states[networkState] + ',,' + '\n');
			setTimeout(checkConnection, interval)
		}
		checkConnection();
	};

	// ###################################### DEVICE ######################################
	
	var initDevice = function () {
		window.fileIO.write(SENSOR_IDS.META + ',' + Date.now() + ',' + window.device.uuid + ',' + window.device.platform + ',' + window.device.version + '\n');
	};

	window.sensorData = {
		initCompass: initCompass,
		initCheckConnection: initCheckConnection,
		initAcc: initAcc,
		initDevice: initDevice,
		initGeo: initGeo
	};

})();