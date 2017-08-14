import 'dialog-polyfill/dialog-polyfill.css';
import './control-toggle.css';

import startApp from './control-toggle.js';

if ( !window.isLoaded ) {
	window.addEventListener("load", function() {
		startApp();
	}, false);
} else {
	startApp();
}
