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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
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

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = __webpack_require__(4);

var _immutable = __webpack_require__(0);

var _immutable2 = _interopRequireDefault(_immutable);

var _nodeTelegramBotApi = __webpack_require__(5);

var _nodeTelegramBotApi2 = _interopRequireDefault(_nodeTelegramBotApi);

var _debug = __webpack_require__(1);

var _debug2 = _interopRequireDefault(_debug);

var _Reducer = __webpack_require__(6);

var _Reducer2 = _interopRequireDefault(_Reducer);

var _Activity = __webpack_require__(7);

var _Activity2 = _interopRequireDefault(_Activity);

var _History = __webpack_require__(8);

var _History2 = _interopRequireDefault(_History);

var _CacheHandler = __webpack_require__(9);

var _CacheHandler2 = _interopRequireDefault(_CacheHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug2.default)('tgux:subscriber');

exports.default = class extends _nodeTelegramBotApi2.default {

  constructor(token, options = {}) {
    super(token, options);

    this.cache = new _CacheHandler2.default();

    this.stores = {};
    this.activities = {};

    this.on('message', async message => {

      let chatId = message.chat.id;
      let store = this.stores[chatId];

      if (!store) {
        let initState = await this.cache.get('State' + chatId);

        if (!initState) {
          initState = _Reducer.defaultState.set('message', message);
        }

        store = (0, _redux.createStore)(_Reducer2.default, initState);

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

          this.activities[activity].dispatch(action, [message, new _History2.default(store, reason, params)]);
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
    this.activities[name] = new _Activity2.default(name);
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
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("node-telegram-bot-api");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultState = undefined;

exports.default = function (state, {
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
        return defaultState.merge({
          message
        });
      }
    default:
      {
        return _immutable2.default.Map(state);
      }
  }
};

var _immutable = __webpack_require__(0);

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = __webpack_require__(1)('tgux:reducer');

const defaultState = exports.defaultState = _immutable2.default.fromJS({
  activity: 'start',
  action: 'home',
  message: undefined,
  params: {},
  reason: 'normal',
  referer: {}
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = __webpack_require__(0);

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class {
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
    let actions = _immutable2.default.Map(this.actions);
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = __webpack_require__(0);

var _immutable2 = _interopRequireDefault(_immutable);

var _debug = __webpack_require__(1);

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug2.default)('tgux:history');

exports.default = class {
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
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = __webpack_require__(1);

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug2.default)('tgux:cache');

exports.default = class {
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
};

/***/ })
/******/ ]);
//# sourceMappingURL=main.map