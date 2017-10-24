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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_immutable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_immutable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_immutable__);


const defaultState = __WEBPACK_IMPORTED_MODULE_0_immutable___default.a.fromJS({
  activity: 'start',
  action: 'home',
  message: undefined,
  params: {},
  reason: 'normal',
  referer: {}
});
/* harmony export (immutable) */ __webpack_exports__["a"] = defaultState;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_immutable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_immutable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_immutable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_node_telegram_bot_api__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_node_telegram_bot_api___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_node_telegram_bot_api__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_debug__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_debug___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_debug__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Reducer__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Activity__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__History__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__CacheHandler__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__DefaultState__ = __webpack_require__(2);











const debug = __WEBPACK_IMPORTED_MODULE_3_debug___default()('tgux:subscriber');

/* harmony default export */ __webpack_exports__["default"] = (class extends __WEBPACK_IMPORTED_MODULE_2_node_telegram_bot_api___default.a {

  constructor(token, options = {}) {
    super(token, options);

    this.cache = new __WEBPACK_IMPORTED_MODULE_7__CacheHandler__["a" /* default */]();

    this.stores = {};
    this.activities = {};

    this.on('message', async message => {

      let chatId = message.chat.id;
      let store = this.stores[chatId];

      if (!store) {
        let initState = await this.cache.get('State' + chatId);

        if (!initState) {
          initState = __WEBPACK_IMPORTED_MODULE_8__DefaultState__["a" /* defaultState */].set('message', message);
        }

        store = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["createStore"])(__WEBPACK_IMPORTED_MODULE_4__Reducer__["a" /* default */], initState);

        store.subscribe(function () {
          let state = store.getState().toJS();
          let {
            activity,
            action,
            message,
            params,
            reason
          } = state;

          debug({
            activity,
            action,
            message: message && message.text,
            params,
            reason
          });

          if (message) {
            this.cache.set('State' + message.chat.id, state);
          }

          this.activities[activity].dispatch(action, [message, new __WEBPACK_IMPORTED_MODULE_6__History__["a" /* default */](store, reason, params)]);
        }.bind(this));

        this.stores[chatId] = store;
      }

      if (message.text == '/start') {
        return store.dispatch({
          type: 'REST',
          payload: {
            message
          }
        });
      }

      let {
        activity,
        action,
        params
      } = store.getState().toJS();

      if (action == 'home') {
        let refer = this.activities[activity].checkRedirect(message.text);
        if (refer) {
          return store.dispatch({
            type: 'FW',
            payload: {
              message,
              refer,
              params
            }
          });
        }
      }

      store.dispatch({
        type: 'RECV',
        payload: {
          message
        }
      });
    });
  }

  setCacheHandler(handler) {
    if (typeof handler == 'function') {
      handler = new handler();
    }
    this.cache = handler;
  }

  createActivity(name, callback) {
    this.activities[name] = new __WEBPACK_IMPORTED_MODULE_5__Activity__["a" /* default */](name);
    callback(this.activities[name]);
  }

  forwardChatId(chatId, refer, params = {}) {
    let store = this.stores[chatId];
    if (!store) {
      return false;
    }
    let {
      message
    } = store.getState().toJS();
    return store.dispatch({
      type: 'FW',
      payload: {
        message,
        refer,
        params
      }
    });
  }
});

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("node-telegram-bot-api");

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_immutable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_immutable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_immutable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__DefaultState__ = __webpack_require__(2);



const debug = __webpack_require__(1)('tgux:reducer');

/* harmony default export */ __webpack_exports__["a"] = (function (state, {
  type,
  payload = {}
}) {
  debug(type, payload, state);

  switch (type) {
    case 'RECV':
      {
        let {
          message
        } = payload;
        return state.merge({
          message,
          reason: 'normal'
        });
      }
    case 'BACK':
      {
        let referer = state.get('referer');
        return state.merge(referer).merge({
          reason: 'back',
          referer: {}
        });
      }
    case 'FW':
      {
        let {
          message,
          refer,
          params
        } = payload;
        let [activity, action] = refer;
        let newState = state.merge({
          message,
          params,
          reason: 'forward'
        }).update('referer', () => {
          if (activity == 'start' && action == 'home') {
            return {};
          }
          return {
            activity: state.get('activity'),
            action: state.get('action')
          };
        });

        if (!action) {
          return newState.merge({
            action: activity
          });
        } else {
          return newState.merge({
            activity,
            action
          });
        }
      }
    case 'REST':
      {
        let {
          message
        } = payload;
        return __WEBPACK_IMPORTED_MODULE_1__DefaultState__["a" /* defaultState */].merge({
          message
        });
      }
    default:
      {
        return __WEBPACK_IMPORTED_MODULE_0_immutable___default.a.Map(state);
      }
  }
});

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_immutable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_immutable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_immutable__);


/* harmony default export */ __webpack_exports__["a"] = (class {
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
    let actions = __WEBPACK_IMPORTED_MODULE_0_immutable___default.a.Map(this.actions);
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
});

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_immutable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_immutable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_immutable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_debug__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_debug___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_debug__);



const debug = __WEBPACK_IMPORTED_MODULE_1_debug___default()('tgux:history');

/* harmony default export */ __webpack_exports__["a"] = (class {
  constructor(store, reason = 'normal', params = {}) {
    this.store = store;
    this.reason = reason;
    this.params = params;
  }

  forward(refer, params) {
    debug('Forward', refer);
    let {
      message
    } = this.store.getState().toJS();
    this.store.dispatch({
      type: 'FW',
      payload: {
        message,
        refer,
        params
      }
    });
  }

  back() {
    debug('Back');
    this.store.dispatch({
      type: 'BACK'
    });
  }
});

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_debug__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_debug___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_debug__);


const debug = __WEBPACK_IMPORTED_MODULE_0_debug___default()('tgux:cache');

/* harmony default export */ __webpack_exports__["a"] = (class {
  constructor() {
    this.data = {};
  }

  set(key, value) {
    debug('Write', key, value);
    return new Promise(function (resolve) {
      this.data[key] = value;
      resolve();
    }.bind(this));
  }

  get(key) {
    debug('Read', key);
    return new Promise(function (resolve) {
      if (key in this.data) {
        return resolve(this.data[key]);
      } else {
        return resolve(false);
      }
    }.bind(this));
  }
});

/***/ })
/******/ ]);
//# sourceMappingURL=main.map