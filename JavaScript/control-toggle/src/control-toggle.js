'use strict';

import {
	Configuration,
	AuthorizationV2Builder,
	NodeInstructionUrlHelper,
	urlQuery,
	} from 'solarnetwork-api-core';
import { ControlToggler } from 'solarnetwork-control-toggler';
import { select, selectAll } from 'd3-selection';
import dialogPolyfill from 'dialog-polyfill';

var app;

/**
 * Control Toggler app.
 *
 * @class
 * @param {Configuration} options the options to use; should provide the `nodeId` and `controlId` to use
 */
const controlToggleApp = function(options) {
	const self = { version : '0.1.0' };
	var config = (options || {});
	var urlHelper = new NodeInstructionUrlHelper();
	var auth = new AuthorizationV2Builder();
	var credentialsDialog;

	var toggler; // ControlToggler

	var dialogCancelled = false;

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
		if ( !arguments.length ) return credentialsDialog;
		credentialsDialog = value;
		if ( value ) {
			value.addEventListener('close', handleCredentials);
			value.addEventListener('cancel', handleCredentialsCancel);
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
		var tokenInput = dialog.select('input[type=text]')
		if ( credentialsDialog.returnValue === 'login' && !dialogCancelled ) {
			var token = tokenInput.property('value');
			var secret = dialog.select('input[type=password]').property('value');
			auth.tokenId = token;
			if ( secret ) {
				auth.saveSigningKey(secret);
			}
		}

		if ( auth.signingKeyValid ) {
			toggler.start();
		}
	}

	function handleControlStatusChange(error) {
		if ( error ) {
			// do something
			console.error(`Error updating control ${config.controlId}: ${error}`);
			return;
		}
		const val = toggler.value() ? '1' : '0';
		const changePending = toggler.hasPendingStateChange;
		console.info(`Control ${config.controlId} status change: value = ${val}; pending = ${changePending}`);

		// update the pending staus
		if ( changePending ) {
			select('#status').html('<em>state change pending...</em>');
		} else {
			// update toggle to reflect reported value
			const radio = select('input[name=value][value="'+val+'"]');
			radio.property('checked', true);
			select('#status').text('');
		}
	}

	/**
	 * Initialize the app and start updating the toggle.
	 *
	 * @return this object
	 */
	function start() {
		if ( !auth.signingKeyValid ) {
			// request credentials now
			requestCredentials();
		} else {
			toggler.start();
		}
		return self;
	}

	/**
	 * Stop the app.
	 *
	 * This will stop the toggler from updating.
	 *
	 * @return this object
	 */
	function stop() {
		if ( toggler ) {
			toggler.stop();
		}
		return self;
	}

	function init() {
		urlHelper.nodeId = config.nodeId;

		toggler = new ControlToggler(urlHelper, auth, config.controlId);
		toggler.callback = handleControlStatusChange;

		// hook in radio buttons
		selectAll('input[name=value]').on('click', function() {
			const desiredValue = this.value;
			app.toggler.value(desiredValue);
		});

		return Object.defineProperties(self, {
			// property getter/setter functions

			credentialsDialog: { value: credentialsDialog },
			toggler: { value: toggler },

			// action methods

			start: { value: start },
			stop: { value: stop },
		});
	}

	return init();
};

function setupUI(config) {
	selectAll('.node-id').text(config.nodeId);
	selectAll('.control-id').text(config.controlId);
}

export default function startApp() {
	var config = new Configuration(Object.assign({nodeId:251, controlId:'/power/switch/1'}, 
		urlQuery.urlQueryParse(window.location.search)));

	setupUI(config);

	var credDialog = document.getElementById('token-credentials-dialog');
	dialogPolyfill.registerDialog(credDialog);

	app = controlToggleApp(config)
		.credentialsDialog(credDialog)
		.start();

	window.onbeforeunload = function() {
		app.stop();
	}

	return app;
}
