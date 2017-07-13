(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rebound"));
	else if(typeof define === 'function' && define.amd)
		define(["rebound"], factory);
	else if(typeof exports === 'object')
		exports["relatify"] = factory(require("rebound"));
	else
		root["relatify"] = factory(root["rebound"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rebound__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rebound___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rebound__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mouseMovements__ = __webpack_require__(1);



const getBox = element => element.getBoundingClientRect();
const getDocumentBox = () => ({
  // eslint-disable-next-line
  height: document.documentElement.getBoundingClientRect().height - window.innerHeight
});

const defaultOptions = {
  origin: [0.5, 0.5],
  throttle: 200,
  tension: 30,
  friction: 7,
  input: 'mouseMove'
};

// User interaction.
const inputs = {
  click: __WEBPACK_IMPORTED_MODULE_1__mouseMovements__["a" /* default */].watchMouseClick,
  mouseMove: __WEBPACK_IMPORTED_MODULE_1__mouseMovements__["a" /* default */].watchMouseMove,
  scroll: __WEBPACK_IMPORTED_MODULE_1__mouseMovements__["a" /* default */].watchScroll,
  bodyScroll: __WEBPACK_IMPORTED_MODULE_1__mouseMovements__["a" /* default */].watchScroll
};

// Spring System.
const springSystem = new __WEBPACK_IMPORTED_MODULE_0_rebound___default.a.SpringSystem();

// eslint-disable-next-line
const init = (options = {}) => (element = document) => callback => {
  const opts = Object.assign({}, defaultOptions, options);

  const watchInput = typeof opts.input === 'string' ? inputs[opts.input](element) : opts.input(element);

  const springX = springSystem.createSpring(opts.tension, opts.friction);
  const springY = springSystem.createSpring(opts.tension, opts.friction);

  let x = 0;
  let y = 0;
  let box;

  if (opts.input === 'bodyScroll' && !opts.getBox) {
    box = getDocumentBox();
  } else {
    box = opts.getBox ? opts.getBox(element) : getBox(element);
  }

  springX.addListener({
    onSpringUpdate(spring) {
      x = spring.getCurrentValue();

      callback({ x, y });
    }
  });

  springY.addListener({
    onSpringUpdate(spring) {
      y = spring.getCurrentValue();

      callback({ x, y });
    }
  });

  const [oriX, oriY] = opts.origin;
  const onWatch = position => {
    // Set values to the spring.
    springX.setEndValue((position.x / box.width - oriX) / (oriX || 1));
    springY.setEndValue((position.y / box.height - oriY) / (oriY || 1));
  };

  watchInput(onWatch);

  return box;
};

/* harmony default export */ __webpack_exports__["default"] = Object.assign({}, {
  init,
  getBox
}, inputs);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Watch MouseClick.
 */
const watchMouseClick = element => callback => {
  const lastMousePosition = { x: 0, y: 0 };

  const onClick = event => {
    lastMousePosition.x = event.offsetX;
    lastMousePosition.y = event.offsetY;

    callback(lastMousePosition);
  };

  element.addEventListener('click', onClick, false);
};

/**
 * Watch MouseMove.
 */
const watchMouseMove = element => callback => {
  const lastMousePosition = { x: 0, y: 0 };
  let ticking = false;

  const update = () => {
    // Reset the tick so we can capture the next onMouseMove.
    ticking = false;

    // Safe to perform heavy calculations.
    callback(lastMousePosition);
  };

  const requestTick = () => {
    if (!ticking) {
      // eslint-disable-next-line
      requestAnimationFrame(update);
    }

    ticking = true;
  };

  const onMouseMove = event => {
    lastMousePosition.x = event.offsetX;
    lastMousePosition.y = event.offsetY;

    requestTick();
  };

  element.addEventListener('mousemove', onMouseMove, false);
};

/**
 * Watch Scroll.
 */
const watchScroll = element => callback => {
  let latestKnownScrollY = 0;
  let ticking = false;

  const update = () => {
    // Reset the tick so we can capture the next onScroll.
    ticking = false;

    // Safe to perform heavy calculations.
    callback({ y: latestKnownScrollY });
  };

  const requestTick = () => {
    if (!ticking) {
      // eslint-disable-next-line
      requestAnimationFrame(update);
    }

    ticking = true;
  };

  const onScroll = () => {
    // eslint-disable-next-line
    latestKnownScrollY = window.scrollY;
    requestTick();
  };

  element.addEventListener('scroll', onScroll, false);
};

/* harmony default export */ __webpack_exports__["a"] = {
  watchMouseClick,
  watchMouseMove,
  watchScroll
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("rebound");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map