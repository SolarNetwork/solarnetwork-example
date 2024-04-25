import {
	Aggregation,
	AuthorizationV2Builder,
	Configuration,
	DatumFilter,
	Environment,
	NodeDatumUrlHelper,
	urlQuery,
} from "solarnetwork-api-core";
import { DatumLoader, DatumRangeFinder, DatumSourceFinder } from "solarnetwork-datum-loader";
import { event as d3event, select, selectAll } from "d3-selection";
import dialogPolyfill from "dialog-polyfill";
import { html as dataTableHtml } from "@redsift/d3-rs-table";

const snEnv = new Environment({
	protocol: "http",
	host: "solarproxy",
	port: 8899,
});

var app;

/**
 * Control Toggler app.
 *
 * @class
 * @param {Configuration} options the options to use; should provide the `nodeId` and `controlId` to use
 */
const datumLoaderApp = function (options) {
	const self = { version: "0.1.0" };
	var config = options || {};
	var credentialsDialog;

	/** @type {HTMLInputElement} */
	var initialInputElement;

	const auth = new AuthorizationV2Builder();
	const urlHelper = new NodeDatumUrlHelper(snEnv);
	const filter = new DatumFilter();

	const tableGenerator = dataTableHtml().headerRow0(true);

	var dialogCancelled = false;
	var readingMode = false;
	var concurrency = 0;
	var pageSize = 3;

	/**
	 * Get/set the credentials HTML <dialog> element to use.
	 *
	 * The <dialog> must include a <form method="dialog"> that includes a `token` text input field
	 * and a `secret` input field. If the form is submitted with a "login" value.
	 *
	 * @param {Element} [value] if provided, set the SSH credential dialog element to this value
	 * @return if invoked as a getter, the current credential dialog element value; otherwise this object
	 */
	function credentialsDialog(value) {
		if (!arguments.length) return credentialsDialog;
		credentialsDialog = value;
		if (value) {
			value.addEventListener("close", handleCredentials);
			value.addEventListener("cancel", handleCredentialsCancel);
		}
		return self;
	}

	function initialInput(value) {
		if (!arguments.length) return initialInputElement;
		initialInputElement = value;
		return self;
	}

	function readings(value) {
		if (!arguments.length) return readingMode;
		readingMode = !!value;
		return self;
	}

	function nodeIds(value) {
		if (!arguments.length) return filter.nodeIds;
		if (Array.isArray(value)) {
			filter.nodeIds = value;
		} else {
			filter.nodeIds = [];
		}
		urlHelper.nodeIds = filter.nodeIds;
		return self;
	}

	function sourceIds(value) {
		if (!arguments.length) return filter.sourceIds;
		if (Array.isArray(value)) {
			filter.sourceIds = value;
		} else {
			filter.sourceIds = [];
		}
		return self;
	}

	function aggregation(value) {
		if (!arguments.length) return filter.aggregation;
		filter.aggregation = value;
		return self;
	}

	function startDate(value) {
		if (!arguments.length) return filter.startDate;
		if (value instanceof Date) {
			filter.startDate = value;
		} else {
			filter.startDate = null;
		}
		return self;
	}

	function endDate(value) {
		if (!arguments.length) return filter.endDate;
		if (value instanceof Date) {
			filter.endDate = value;
		} else {
			filter.endDate = null;
		}
		return self;
	}

	function parallelism(value) {
		if (!arguments.length) return concurrency;
		if (value instanceof Number && value >= 0) {
			concurrency = value;
		} else {
			concurrency = 0;
		}
		return self;
	}

	function requestCredentials() {
		dialogCancelled = false;
		credentialsDialog.showModal();
	}

	function handleCredentialsCancel(event) {
		dialogCancelled = true;
	}

	function handleCredentials(event) {
		var dialog = select(credentialsDialog);
		var tokenInput = dialog.select("input[type=text]");
		if (credentialsDialog.returnValue === "login" && !dialogCancelled) {
			var token = tokenInput.property("value");
			var secret = dialog.select("input[type=password]").property("value");
			auth.tokenId = token;
			if (secret) {
				auth.saveSigningKey(secret);
			}
		}

		if (auth.signingKeyValid) {
			// TODO
		}
		urlHelper.publicQuery = !auth.signingKeyValid;
		if (initialInputElement && !initialInputElement.value) {
			initialInputElement.focus();
		}
	}

	/**
	 * Find the available sources.
	 *
	 * @return this object
	 */
	async function findSources() {
		if (!urlHelper) {
			throw new Error("No node IDs configured.");
		}
		return new DatumSourceFinder(urlHelper).filter(filter).fetch();
	}

	/**
	 * Find the available date range.
	 *
	 * @return this object
	 */
	async function findDateRange() {
		if (!urlHelper) {
			throw new Error("No node IDs configured.");
		}
		const finder = new DatumRangeFinder(urlHelper);
		return finder.fetch();
	}

	/**
	 * Initialize the app.
	 *
	 * @return this object
	 */
	function start() {
		if (!auth.signingKeyValid) {
			// request credentials now
			requestCredentials();
		} else {
			// TODO
		}
		return self;
	}

	/**
	 * Stop the app.
	 *
	 * @return this object
	 */
	function stop() {
		return self;
	}

	async function loadDataTable(container) {
		try {
			const results = await new DatumLoader(urlHelper, filter, auth)
				.readings(readingMode)
				.paginationSize(pageSize)
				.concurrency(concurrency)
				.fetch();

			// convert results to array form; preserving column order and generating a header row
			const ordering = new Map([
				["created", 0],
				["nodeId", 1],
				["sourceId", 2],
			]);
			const data = results.map((datum) => {
				const keys = Object.keys(datum);
				const row = [];
				for (const key of keys) {
					if (!ordering.has(key)) {
						ordering.set(key, ordering.size);
					}
					row[ordering.get(key)] = datum[key];
				}
				return row;
			});
			const header = [];
			ordering.forEach((v, k) => (header[v] = k));
			data.splice(0, 0, header);

			// turn array data into HTML table
			select(container).datum(data).call(tableGenerator);
		} catch (e) {
			console.log("Error fetching results: %s", e);
		}
	}

	function init() {
		return Object.defineProperties(self, {
			// property getter/setter functions
			aggregation: { value: aggregation },
			credentialsDialog: { value: credentialsDialog },
			endDate: { value: endDate },
			initialInput: { value: initialInput },
			readings: { value: readings },
			nodeIds: { value: nodeIds },
			sourceIds: { value: sourceIds },
			startDate: { value: startDate },
			parallelism: { value: parallelism },

			// action methods
			findSources: { value: findSources },
			findDateRange: { value: findDateRange },
			loadDataTable: { value: loadDataTable },
			start: { value: start },
			stop: { value: stop },
		});
	}

	return init();
};

function setupUI(config, app) {
	const nodeIdInputDeps = [];

	function enableDepInputs(enable) {
		nodeIdInputDeps.forEach((e) => e.property("disabled", !enable));
	}

	// hook node IDs
	const nodeIdsInput = select('#criteria-form input[name="nodeIds"]').on("change", function () {
		/** @type {string} */
		const str = this.value;
		if (str) {
			const nodeIds = str.split(/\s*,\s*/);
			app.nodeIds(nodeIds);
		}
		enableDepInputs(!!str);
	});
	app.initialInput(nodeIdsInput.node());

	// hook start/end dates
	const startDateInput = select('input[name="startDate"]').on("change", function () {
		app.startDate(this.valueAsDate);
	});
	nodeIdInputDeps.push(startDateInput);
	const endDateInput = select('input[name="endDate"]').on("change", function () {
		app.endDate(this.valueAsDate);
	});
	nodeIdInputDeps.push(endDateInput);

	// hook Find range button
	const findDateRangeButton = select("#find-date-range").on("click", function () {
		app.findDateRange().then((data) => {
			startDateInput.node().valueAsDate = data.sDate;
			app.startDate(data.sDate);
			endDateInput.node().valueAsDate = data.eDate;
			app.endDate(data.eDate);
		});
	});
	nodeIdInputDeps.push(findDateRangeButton);

	// hook source IDs
	const sourceIdsTextarea = select('#criteria-form textarea[name="sourceIds"]').on(
		"change",
		function () {
			/** @type {string} */
			const str = this.value;
			if (str) {
				const sourceIds = str.split(/\s*,\s*/);
				app.sourceIds(sourceIds);
			}
		}
	);
	nodeIdInputDeps.push(sourceIdsTextarea);

	// hook in Find sources button
	const findSourcesButton = select("#find-sources").on("click", function () {
		app.findSources().then((data) => {
			const sourceIds = Object.entries(data).reduce((a, kv) => a.concat(kv[1]), []);
			sourceIdsTextarea.property("value", sourceIds.join(",\n"));
			app.sourceIds(sourceIds);
		});
	});
	nodeIdInputDeps.push(findSourcesButton);

	// populate the avaialble aggregation levels from the Aggregation enum (plus None)
	const aggregationSelect = select("select[name=aggregation]");
	aggregationSelect
		.selectAll("option")
		.data(
			[{ name: "None" }].concat(
				Aggregation.enumValues().filter((e) => !/(Of|Total|Minute|Week)/.test(e.name))
			),
			(d) => d.name
		)
		.enter()
		.append("option")
		.attr("value", (d) => (d.name === "None" ? "" : d.name))
		.text((d) => d.name);
	aggregationSelect.on("change", function () {
		const selVal = this.selectedOptions[0].value;
		app.aggregation(selVal ? Aggregation.valueOf(selVal) : null);
	});
	nodeIdInputDeps.push(aggregationSelect);

	const dataModeRadios = selectAll("input[name=dataMode]");
	dataModeRadios.on("change", function () {
		const value = this.value;
		const checked = this.checked;
		app.readings(value == "reading" && checked);
	});

	// hook parallelism
	const parallelismInput = select('#criteria-form input[name="parallelism"]').on(
		"change",
		function () {
			const num = Number(this.value);
			if (num !== NaN && num >= 0) {
				app.parallelism(num);
			}
		}
	);

	// form submit button
	const submitButton = select('#criteria-form button[type="submit"]');
	nodeIdInputDeps.push(submitButton);

	const tableContainer = select("#data-table").node();

	// form
	select("#criteria-form").on("submit", function () {
		d3event.preventDefault();
		app.loadDataTable(tableContainer);
	});
}

export default function startApp() {
	var config = new Configuration(
		Object.assign({ nodeId: 251 }, urlQuery.urlQueryParse(window.location.search))
	);

	var credDialog = document.getElementById("token-credentials-dialog");
	dialogPolyfill.registerDialog(credDialog);

	app = datumLoaderApp(config).credentialsDialog(credDialog).start();

	setupUI(config, app);

	window.onbeforeunload = function () {
		app.stop();
	};

	return app;
}
