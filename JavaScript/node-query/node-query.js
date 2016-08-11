'use strict';

// make d3.xhr work (D3 v3)
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var	d3 = require('d3'),
	sn = require('solarnetwork-d3'),
	Getopt = require('node-getopt');

function parseDate(dateString) {
	var d = sn.format.dateTimeFormatLocal.parse(dateString);
	if ( !d ) {
		d = d3.time.format('%Y-%m-%d').parse(dateString);
	}
	return d;
}

function groupResultsBySource(data, propNames) {
	// if propNames is provided, include just those properties in the result
	// in addition to basics like node ID, source ID, and date
	if ( Array.isArray(propNames) && propNames.length > 0 ) {
		data = data.map(function(d) {
			var result = {
				nodeId : d.nodeId,
				sourceId : d.sourceId,
				date : d.localDate,
				time : d.localTime };
			propNames.forEach(function(propName) {
				if ( d[propName] ) {
					result[propName] = d[propName];
				}
			});
			return result;
		});
	}
	return d3.nest()
		.key(function(d) { return d.sourceId; })
		.sortKeys(d3.ascending)
		.map(data);
}

function query(options) {
	var nodeId = options.node,
		sourceIds = options.source,
		startDate = parseDate(options['begin-date']),
		endDate = parseDate(options['end-date']),
		agg = (options['aggregate'] || 'Day'),
		urlHelper = sn.api.node.nodeUrlHelper(nodeId);

	sn.api.datum.loader(sourceIds, urlHelper, startDate, endDate, agg).load(function(error, data) {
		// group the results by source, e.g. { Source1 : [...], Source2 : [...], ... }
		var groupedBySource = groupResultsBySource(data, options.property),
			sourceId;

		console.info(groupedBySource);

		if ( !options.property ) {
			return;
		}

		// can extract just a simple array of the first property, for example let's print out
		// the raw property data as an array for each source
		for ( sourceId in groupedBySource ) {
			var resultsForSource = groupedBySource[sourceId];

			// check in case no results for source ID
			if ( !resultsForSource ) {
				return;
			}

			// first print out dates for this source
			console.info('\n\n** Source: %s **\n\nDates: %s', sourceId, resultsForSource.map(function(d) {
				return d.date + (d.time === '00:00' ? '' : ' ' +d.time);
			}));

			options.property.forEach(function(propName) {
				var propDataForSource = resultsForSource.map(function(d) {
					return d[propName];
				});
				console.info('\n%s: %s', propName, propDataForSource);
			});
		}
	});
}

var getopt = new Getopt([
		['n', 'node=ARG', 'node ID'],
		['s', 'source=ARG+', 'source ID'],
		['b', 'begin-date=ARG', 'begin date, in YYYY-MM-DD HH:mm or YYYY-MM-DD format'],
		['e', 'end-date=ARG', 'end date, exclusive if --aggregate used'],
		['a', 'aggregate=ARG', 'aggregate, e.g. FiveMinute, Hour, Day, Month'],
		['p', 'property=ARG+', 'output property, e.g. wattHours'],
		['h', 'help', 'show this help']
	]).bindHelp(
	  "Usage: node sn-agg-query.js [OPTIONS]\n" +
	  "\n" +
	  "Execute a SolarQuery datum query and show the results.\n" +
	  "\n" +
	  "[[OPTIONS]]\n"
	);

var options = getopt.parseSystem();

if ( !(options.options.node && options.options['begin-date'] && options.options['end-date']) ) {
	getopt.showHelp();
	return;
}

query(options.options);
