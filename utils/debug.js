import { getConfig } from '../init.js';

export function debugLog(message) {
	const { DEBUG } = getConfig();
	if (DEBUG) {
		console.log(message);
	}
}

