"use strict";

// make d3-request work
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var datumLoader = require("solarnetwork-datum-loader"),
	sn = require("solarnetwork-api-core"),
	Getopt = require("node-getopt");

sn.Logger.level = 4;

var snEnv = new sn.Environment({
	protocol: "http",
	host: "solarproxy",
	port: 8899,
});

function query(options) {
	var nodeId = options.node,
		sourceIds = options.source,
		//startDate = parseDate(options["begin-date"]),
		//endDate = parseDate(options["end-date"]),
		agg = options["aggregate"] || "Day",
		urlHelper = new sn.NodeDatumUrlHelper(snEnv),
		filter = new sn.DatumFilter();

	var loader = new datumLoader.DatumLoader(urlHelper, filter).paginationSize(3).concurrency(3);

	loader.load(function (error, data) {
		if (error) {
			if (error.status >= 400 && error.status < 500) {
				console.error("Access denied.");
			} else {
				console.error("Error requesting data: " + error.responseText);
			}
			return;
		}
		// TODO
		console.info("TODO");
	});
}

var getopt = new Getopt([
	["n", "node=ARG", "node ID"],
	["s", "source=ARG+", "source ID"],
	["b", "begin-date=ARG", "begin date, in YYYY-MM-DD HH:mm or YYYY-MM-DD format"],
	["e", "end-date=ARG", "end date, exclusive if --aggregate used"],
	["a", "aggregate=ARG", "aggregate, e.g. FiveMinute, Hour, Day, Month"],
	["h", "help", "show this help"],
]).bindHelp(
	"Usage: node node-datum-loader.js [OPTIONS]\n" +
		"\n" +
		"Execute a SolarQuery datum query and show the results.\n" +
		"\n" +
		"[[OPTIONS]]\n"
);

var options = getopt.parseSystem();

/*
if (!options.options.node) {
	getopt.showHelp();
	return;
}
*/

query(options.options);
