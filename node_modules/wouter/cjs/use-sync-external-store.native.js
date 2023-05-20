'use strict';

var index_native_js = require('use-sync-external-store/shim/index.native.js');



Object.defineProperty(exports, 'useSyncExternalStore', {
	enumerable: true,
	get: function () { return index_native_js.useSyncExternalStore; }
});
