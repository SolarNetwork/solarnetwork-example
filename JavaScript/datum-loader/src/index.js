import 'dialog-polyfill/dialog-polyfill.css';
import 'date-input-polyfill';
import './datum-loader.css';

import startApp from './datum-loader.js';

if ( !window.isLoaded ) {
	window.addEventListener("load", function() {
		startApp();
	}, false);
} else {
	startApp();
}
