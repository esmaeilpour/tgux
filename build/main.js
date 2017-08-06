require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("immutable");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Immutable = __webpack_require__(0);

module.exports = Immutable.fromJS({
    activity: 'start',
    action: 'home',
    message: undefined,
    params: {},
    reason: 'normal',
    referer: {}
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const co = __webpack_require__(5);
const Redux = __webpack_require__(6);
const Immutable = __webpack_require__(0);
const Tg = __webpack_require__(7);
const debug = __webpack_require__(1)('tgux:subscribe');

const Reducer = __webpack_require__(8);
const Activity = __webpack_require__(9);
const History = __webpack_require__(10);
const CacheHandler = __webpack_require__(11);
const defaultState = __webpack_require__(2);

module.exports = class Tgux extends Tg {

    constructor(token, options = {}) {
        super(token, options);

        this.cache = new CacheHandler();

        this.stores = {};
        this.activities = {};

        this.on('message', co.wrap(function* (message) {

            let chatId = message.chat.id;
            let store = this.stores[chatId];

            if (!store) {
                let initState = yield this.cache.get('State' + chatId);

                if (!initState) {
                    initState = defaultState.set('message', message);
                }

                store = Redux.createStore(Reducer, initState);

                store.subscribe(function () {
                    let state = store.getState().toJS();
                    let { activity, action, message, params, reason } = state;

                    debug({ activity, action, message: message && message.text, params, reason });

                    if (message) {
                        this.cache.set('State' + message.chat.id, state);
                    }

                    this.activities[activity].dispatch(action, [message, new History(store, reason, params)]);
                }.bind(this));

                this.stores[chatId] = store;
            }

            if (message.text == '/start') {
                return store.dispatch({ type: 'REST', payload: { message } });
            }

            let { activity, action, params } = store.getState().toJS();

            if (action == 'home') {
                let refer = this.activities[activity].checkRedirect(message.text);
                if (refer) {
                    return store.dispatch({ type: 'FW', payload: { message, refer, params } });
                }
            }

            store.dispatch({ type: 'RECV', payload: { message } });
        }));
    }

    setCacheHandler(handler) {
        this.cache = new handler();
    }

    createActivity(name, callback) {
        this.activities[name] = new Activity(name);
        callback(this.activities[name]);
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("co");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("node-telegram-bot-api");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const debug = __webpack_require__(1)('tgux:reducer');
const Immutable = __webpack_require__(0);
const defaultState = __webpack_require__(2);

module.exports = function (state, { type, payload = {} }) {
    debug(type, payload, state);

    switch (type) {
        case 'RECV':
            {
                let { message } = payload;
                return state.merge({ message, reason: 'normal' });
            }
        case 'BACK':
            {
                let referer = state.get('referer');
                return state.merge(referer).merge({ reason: 'back', referer: {} });
            }
        case 'FW':
            {
                let { message, refer, params } = payload;
                let [activity, action] = refer;
                let newState = state.merge({ message, params, reason: 'forward' }).update('referer', () => {
                    if (activity == 'start' && action == 'home') {
                        return {};
                    }
                    return {
                        activity: state.get('activity'),
                        action: state.get('action')
                    };
                });

                if (!action) {
                    return newState.merge({ action: activity });
                } else {
                    return newState.merge({ activity, action });
                }
            }

        case 'REST':
            {
                let { message } = payload;
                return defaultState.merge({ message });
            }
        default:
            {
                return Immutable.Map(state);
            }
    }
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const Immutable = __webpack_require__(0);

module.exports = class Activity {
    constructor(name) {
        this.name = name;
        this.actions = {};
    }

    on(action, callback) {
        this.actions[action] = callback;
    }

    checkRedirect(text) {
        let action = this.actions[text];
        return action && Array.isArray(action) && action;
    }

    dispatch(action, args) {
        this.actions[action].apply(this, args);
    }

    get keyboards() {
        let actions = Immutable.Map(this.actions);
        let keyboards = [];
        actions.forEach((value, key) => {
            if (Array.isArray(value)) {
                keyboards.push(key);
            }
        });
        if (!keyboards.length) {
            return false;
        }
        return [keyboards];
    }
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const Immutable = __webpack_require__(0);
const debug = __webpack_require__(1)('tgux:history');

module.exports = class History {
    constructor(store, reason = 'normal', params = {}) {
        this.store = store;
        this.reason = reason;
        this.params = params;
    }

    forward(refer, params) {
        debug('Forward', refer);
        let { message } = this.store.getState().toJS();
        this.store.dispatch({ type: 'FW', payload: { message, refer, params } });
    }

    back() {
        debug('Back');
        this.store.dispatch({ type: 'BACK' });
    }
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const debugSet = __webpack_require__(1)('tgux:cacheWrite');
const debugGet = __webpack_require__(1)('tgux:cacheRead');

module.exports = class CacheHandler {
    constructor() {
        this.data = {};
    }

    set(key, value) {
        debugSet(key, value);
        return new Promise(function (resolve) {
            this.data[key] = value;
            resolve();
        }.bind(this));
    }

    get(key) {
        debugGet(key);
        return new Promise(function (resolve) {
            if (key in this.data) {
                return resolve(this.data[key]);
            } else {
                return resolve(false);
            }
        }.bind(this));
    }
};

/***/ })
/******/ ]);
//# sourceMappingURL=main.map