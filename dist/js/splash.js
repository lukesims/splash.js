(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Splash = factory());
}(this, (function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  /**
   * Determines if the given element has the given class
   *
   * @author https://stackoverflow.com/users/3773265/emil
   * @link https://stackoverflow.com/a/28344281
   *
   * @param {HTMLElement} element - The DOM element to test
   * @param {String} cls - The class name to check for
   * @returns {Boolean} True if `element` has class `cls`, false if not
   */
  function hasClass(element, cls) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    return !!element.className.match(reg);
  }

  /**
   * Adds a class to an element's class list if it does not already exist
   *
   * @author https://stackoverflow.com/users/3773265/emil
   * @link https://stackoverflow.com/a/28344281
   *
   * @param {HTMLElement} element - The DOM element to update
   * @param {String} cls - The class name to add
   * @returns {undefined}
   */
  function addClass(element, cls) {
    if (!hasClass(element, cls)) {
      element.className += ' ' + cls;
    }
  }

  /**
   * Removes a class from an element's class list if it exists
   *
   * @author https://stackoverflow.com/users/3773265/emil
   * @link https://stackoverflow.com/a/28344281
   *
   * @param {HTMLElement} element - The DOM element to update
   * @param {String} cls - The class name to remove
   * @returns {undefined}
   */
  function removeClass(element, cls) {
    if (hasClass(element, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      element.className = element.className.replace(reg, ' ');
    }
  }

  /**
   * Finds the first immediate child with the class `className` of the `element`.
   *
   * @param {HTMLElement} element - The DOM element to search
   * @param {String} className - The class name to search for
   * @returns {undefined|HTMLElement}
   */
  function first(element, className) {
    var found = void 0;
    for (var i = 0; i < element.children.length; i += 1) {
      if (hasClass(element.children[i], className)) {
        found = element.children[i];
        break;
      }
    }
    return found;
  }

  /**
   * Determines the x (left) and y (top) offsets of the given element, relative
   * to the document body.
   *
   * @param {HTMLElement} element - The DOM element to test
   * @returns {Object} offset - An object containing both offset values
   * @returns {Number} offset.x - The x (left) offset value
   * @returns {Number} offset.y - The x (left) offset value
   */
  function getOffset(element) {
    var bodyRect = document.body.getBoundingClientRect();
    var elemRect = element.getBoundingClientRect();
    return {
      x: elemRect.left - bodyRect.left,
      y: elemRect.top - bodyRect.top
    };
  }

  /**
   *
   */
  function newElem(selector) {
    var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var element = document.createElement('div');
    element.className = classes;
    return element;
  }

  /**
   * Determines if the given value is a DOM element
   *
   * @author https://stackoverflow.com/users/36866/some
   * @link https://stackoverflow.com/a/384380
   *
   * @param {*} o - The variable being tested
   * @returns {Boolean} True if `o` is a DOM element object, false if not
   */
  function isElem(o) {
    return (typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object' ? o instanceof HTMLElement : o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string';
  }

  /**
   * Determines if the given value is a 'list' of elements (Array, HTMLCollection,
   * NodeList or Object).
   *
   * @param {*} o - The variable being tested
   * @returns {Boolean} Whether `o` is one of: Array|HTMLCollection|NodeList|Object
   */
  function isList(o) {
    var str = Object.prototype.toString.call(o);
    return !!o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && /^\[object (Array|HTMLCollection|NodeList|Object)\]$/.test(str) && o.length;
  }

  /**
   * This class represents an individual .splash element.
   * Allows each instantiation to have unique configurations.
   */

  var SplashElement = function () {
    createClass(SplashElement, [{
      key: 'addEventListeners',


      /**
       * Attachs our event listeners to this Splash element
       *
       * @returns {undefined}
       */
      value: function addEventListeners() {
        var _this = this;

        this.elem.addEventListener('mouseenter', function (e) {
          return _this.startHover(e);
        }, false);
        this.elem.addEventListener('mouseleave', function (e) {
          return _this.endHover(e);
        }, false);
      }

      /**
       * Creates a new element for a wave effect within the waves container inside
       * this Splash element.
       *
       * @return {HTMLElement} The generated element for the wave effect
       */

    }, {
      key: 'createWave',
      value: function createWave() {
        // Create a new element for our wave
        var wave = newElem('div', this.cfg.class.wave);
        // Insert the wave into the waves container
        this.waves.appendChild(wave);
        // Save a reference to the wave
        this.save(wave);
        // Return the wave for further manipulation
        return wave;
      }

      /**
       * Sets up the class
       *
       * @param {HTMLElement} element - An element to attach the functionality to
       * @param {Object|undefined} config - The configuration settings
       * @returns {SplashElement}
       */

    }]);

    function SplashElement(element) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      classCallCheck(this, SplashElement);

      // Save references to the element and the config
      this.elem = element;
      this.cfg = config;
      // Acts as a state for the currently active waves. When a hover wave is
      // created, a reference is saved to this object and the triggering element,
      // so that when the `mouseleave` event is triggered, we can find the correct
      // wave element to operate on. Without this, nesting .splash elements and
      // combining click/hover causes problems.
      this.active = {};
      // Wrap this element's content with our required elements
      this.wrap();
      // Add event listeners to this element
      this.addEventListeners();
      // Return the instance
      return this;
    }

    /**
     * Callback for the `mouseleave` event
     *
     * @param {Event} e
     * @returns {undefined}
     */


    createClass(SplashElement, [{
      key: 'endHover',
      value: function endHover(e) {
        var _this2 = this;

        e.stopPropagation();
        // Determine the offset of the element relative to the viewport
        var offset = getOffset(this.elem);
        // Find the wave element
        var wave = this.getWave();
        // Position the wave where the cursor left the splash element
        // In order to get left/top values relative to the position of the element,
        // we must subtract the element's offset from the co-ordinates of the event.
        wave.style.left = e.pageX - offset.x + 'px';
        wave.style.top = e.pageY - offset.y + 'px';
        // Bring the wave back in
        removeClass(wave, this.cfg.class.waveOut);
        // Determine how long the animations are set to take
        var waveDur = SplashElement.getDuration(wave);
        // Wait for the animation to finish and remove the wave
        setTimeout(function () {
          _this2.waves.removeChild(wave);
        }, waveDur);
      }

      /**
       * Takes an element, reads the computed 'transition-duration' value,
       * and then returns the duration in milliseconds as an integer.
       *
       * @param {HTMLElement} element - The element to test
       * @returns {Number} The duration in ms
       */

    }, {
      key: 'getSize',


      /**
       * Determines how big a wave should be such that it completely covers this
       * Splash element which it is being displayed on.
       *
       * @param {Number} posX - Horizontal position of the event (circle center)
       * @param {Number} posY - Vertical position of the event (circle center)
       * @returns {Number} The calculated radius for the wave's circle
       */
      value: function getSize(posX, posY) {
        // Determine which point of the element the event took place furthest from
        var fx = posX < this.elem.offsetWidth / 2 ? this.elem.offsetWidth : 0;
        var fy = posY < this.elem.offsetHeight / 2 ? this.elem.offsetHeight : 0;
        // Calculate the distances from the event to the furthest point
        var dx = Math.abs(posX - fx);
        var dy = Math.abs(posY - fy);
        // Now we can calculate the required radius of the circle by using
        // pythagoras theorem - a^2 + b^2 = c^2 - in this context, a and b are
        // `dx` and `dy` and `c` is the radius value we need.
        return Math.sqrt(dx * dx + dy * dy);
      }

      /**
       *
       */

    }, {
      key: 'getWave',
      value: function getWave() {
        var ts = this.elem.getAttribute(this.cfg.attr);
        var wave = this.active[ts];
        delete this.active[ts];
        this.elem.removeAttribute(this.cfg.attr);
        return wave;
      }

      /**
       * Determines if this element is disabled
       */

    }, {
      key: 'save',


      /**
       *
       */
      value: function save(wave) {
        var ts = Date.now();
        this.active[ts] = wave;
        this.elem.setAttribute(this.cfg.attr, ts);
      }

      /**
       * Callback for the `mouseenter` event on this Splash element
       *
       * @param {Event} e
       * @returns {undefined}
       */

    }, {
      key: 'startHover',
      value: function startHover(e) {
        e.stopPropagation();
        // Do not proceed if hover or the element itself is disabled
        if (this.isDisabled) return;
        if (!this.cfg.hover) return;
        // Determine the offset of the element relative to the viewport
        var offset = getOffset(this.elem);
        // Create a new wave element inside our container
        var wave = this.createWave();
        // Determine the position of the event (the center of the wave's circle)
        // relative to this Splash element. In order to get left/top values relative
        // to the position of the element, we must subtract the element's offset
        // from the co-ordinates of the event.
        var posX = e.pageX - offset.x;
        var posY = e.pageY - offset.y;
        // Position the wave where the cursor entered the Splash element
        wave.style.left = posX + 'px';
        wave.style.top = posY + 'px';
        // Determine what the size for our wave should be
        var size = this.getSize(posX, posY);
        // Apply the size to the wave
        wave.style.width = 2 * size + 'px';
        wave.style.height = 2 * size + 'px';
        // Make the wave spread out
        addClass(wave, this.cfg.class.waveOut);
      }

      /**
       * Wraps this element's contents so we can add wave effects
       *
       * @returns {undefined}
       */

    }, {
      key: 'wrap',
      value: function wrap() {
        // We should only proceed if the element is not already wrapped
        if (this.isWrapped) return;
        // Create our wrapper
        var wrapper = newElem('div', this.cfg.class.wrap);
        // Wrap the element's content
        this.elem.appendChild(wrapper);
        while (this.elem.firstChild !== wrapper) {
          wrapper.appendChild(this.elem.firstChild);
        }
        // Create the waves container
        var waves = newElem('div', this.cfg.class.waves);
        // Insert the waves before the content wrapper
        this.elem.insertBefore(waves, wrapper);
        // Saves references to the waves container and the wrapper
        this.waves = waves;
        this.wrapper = wrapper;
      }
    }, {
      key: 'isDisabled',
      get: function get$$1() {
        return hasClass(this.elem, this.cfg.class.disabled);
      }

      /**
       * Determines if this element's contents has already been wrapped
       *
       * @returns {Boolean}
       */

    }, {
      key: 'isWrapped',
      get: function get$$1() {
        return !!first(this.elem, this.cfg.class.waves);
      }
    }], [{
      key: 'getDuration',
      value: function getDuration(element) {
        // Get the duration specified in the styles
        var styles = window.getComputedStyle(element, null);
        var cssDur = styles.getPropertyValue('transition-duration');
        // Strip the unit from the string and get a number
        var numDur = parseFloat(cssDur);
        if (!numDur) return 0;
        // We want to work with `ms` so if its already in `ms`, just return it
        if (cssDur.endsWith('ms')) return numDur;
        // CSS only supports `s` and `ms` so the duration is in seconds
        // Therefore we need to multiply by 1000 to get the `ms` value
        return numDur * 1000;
      }
    }]);
    return SplashElement;
  }();

  // Default options for the library
  var defaultConfig = {
    attr: 'data-splash-waves',
    click: false,
    hover: true,
    class: {
      base: 'splash',
      disabled: 'disabled',
      wave: 'splash-wave',
      waveOut: 'splash-wave-out',
      waves: 'splash-waves',
      wrap: 'splash-wrap'
    }
  };

  var Splash = function () {

    /**
     * Sets up the class
     *
     * @param {Object|undefined} config - The user-specified configuration settings
     * @returns {undefined}
     */
    function Splash() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      classCallCheck(this, Splash);

      // Shortcuts
      this.ts = Object.prototype.toString;
      this.$ = document.querySelectorAll.bind(document);
      // Make sure `config` is an object
      var cfg = this.ts.call(config) !== '[object Object]' ? {} : config;
      this.cfg = Object.assign({}, defaultConfig, cfg);
      // Holds a reference to all active `SplashElement`s
      this.active = [];
    }

    /**
     *
     */


    createClass(Splash, [{
      key: 'init',
      value: function init() {
        this.active = [];
        // Locate the splash elements
        var elements = this.$('.' + this.cfg.class.base);
        // Instantiate splash on each element with current config
        for (var i = 0; i < elements.length; i += 1) {
          var se = new SplashElement(elements[i], this.cfg);
          this.active.push(se);
        }
      }

      /**
       *
       */

    }, {
      key: '_normalize',
      value: function _normalize(selection) {
        if (typeof selection === 'string') return this.$$(selection);
        if (isList(selection)) return selection;
        if (isElem(selection)) return [selection];
        return [];
      }
    }]);
    return Splash;
  }();

  return Splash;

})));
