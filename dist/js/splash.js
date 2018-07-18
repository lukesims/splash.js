(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Splash = factory());
}(this, (function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  // Default options for the library
  var defaultConfig = {
    attr: 'data-splash-waves',
    cls: {
      base: 'splash',
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

      _classCallCheck(this, Splash);

      // Shortcuts
      this.ts = Object.prototype.toString;
      this.$ = document.querySelectorAll.bind(document);
      // Make sure `config` is an object
      var cfg = this.ts.call(config) !== '[object Object]' ? {} : config;
      this.cfg = Object.assign({}, defaultConfig, cfg);
      // Add event listeners to .splash elements
      this._addEventListeners();
      // Acts as a state for the currently active waves. When a hover wave is
      // created, a reference is saved to this object and the triggering element,
      // so that when the `mouseleave` event is triggered, we can find the correct
      // wave element to operate on. Without this, nesting .splash elements and
      // combining click/hover causes problems.
      this.active = {};
    }

    /**
     * Loops through all Splash elements and attachs the event listeners to them
     *
     * @returns {undefined}
     */


    _createClass(Splash, [{
      key: '_addEventListeners',
      value: function _addEventListeners() {
        var _this = this;

        // Locate the splash elements
        var elements = this.$('.' + this.cfg.cls.base);
        // Attach the event listeners to each splash element
        for (var i = 0; i < elements.length; i += 1) {
          var elem = elements[i];
          elem.addEventListener('mouseenter', function (e) {
            return _this._startHover(e);
          }, false);
          elem.addEventListener('mouseleave', function (e) {
            return _this._endHover(e);
          }, false);
        }
      }

      /**
       * Creates a new element for a wave effect within the waves container inside
       * the given element.
       *
       * @param {HTMLElement} element - The element to create a wave for
       * @return {HTMLElement} The generated element for the wave effect
       */

    }, {
      key: '_createWave',
      value: function _createWave(element) {
        // Create a new element for our wave
        var wave = newElem('div', this.cfg.cls.wave);
        // Find the waves container within our element
        var container = first(element, this.cfg.cls.waves);
        // Insert the wave into the container
        container.appendChild(wave);
        // Save a reference to the wave
        var ts = Date.now();
        this.active[ts] = wave;
        element.setAttribute(this.cfg.attr, ts);
        // Return the wave so we don't have to manually find it again
        return wave;
      }

      /**
       * Callback for the `mouseleave` event
       *
       * @param {Event} e
       * @returns {undefined}
       */

    }, {
      key: '_endHover',
      value: function _endHover(e) {
        e.stopPropagation();
        // Get the target of the event listeners, which is our .splash elements
        var element = e.currentTarget;
        // Determine the offset of the element relative to the viewport
        var offset = getOffset(element);
        // Find the waves container
        var waves = first(element, this.cfg.cls.waves);
        // Find the wave element
        var ts = element.getAttribute(this.cfg.attr);
        var wave = this.active[ts];
        delete this.active[ts];
        element.removeAttribute(this.cfg.attr);
        // Position the wave where the cursor left the splash element
        // In order to get left/top values relative to the position of the element,
        // we must subtract the element's offset from the co-ordinates of the event.
        wave.style.left = e.pageX - offset.x + 'px';
        wave.style.top = e.pageY - offset.y + 'px';
        // Bring the wave back in
        removeClass(wave, this.cfg.cls.waveOut);
        // Determine how long the animations are set to take
        var waveDur = Splash._getDuration(wave);
        // Wait for the animation to finish and remove the wave
        setTimeout(function () {
          waves.removeChild(wave);
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
      key: '_isWrapped',


      /**
       * Determines if the given element has already been wrapped by the library
       *
       * @param {HTMLElement} element - The element to test
       * @returns {Boolean}
       */
      value: function _isWrapped(element) {
        return !!first(element, this.cfg.cls.waves);
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

      /**
       * Callback for the `mouseenter` event
       *
       * @param {Event} e
       * @returns {undefined}
       */

    }, {
      key: '_startHover',
      value: function _startHover(e) {
        e.stopPropagation();
        // Get the target of the event listeners, which is our .splash elements
        var element = e.currentTarget;
        // Determine the offset of the element relative to the viewport
        var offset = getOffset(element);
        // Wrap the contents of `element` with our lib-specific elements
        this._wrap(element);
        // Create a new wave element inside our container
        var wave = this._createWave(element);
        // Determine the position of the event/wave relative to the element
        var position = {
          left: e.pageX - offset.x,
          top: e.pageY - offset.y
        };
        // Position the wave where the cursor entered the splash element
        // In order to get left/top values relative to the position of the element,
        // we must subtract the element's offset from the co-ordinates of the event.
        wave.style.left = position.left + 'px';
        wave.style.top = position.top + 'px';
        // Determine what the size for our wave should be.
        var size = Splash._getWaveSize(element, position);
        // Apply the size to the wave
        wave.style.width = 2 * size + 'px';
        wave.style.height = 2 * size + 'px';
        // Make the wave spread out
        addClass(wave, this.cfg.cls.waveOut);
      }

      /**
       * Takes a Splash element and wraps its contents so we can add wave effects
       *
       * @param {HTMLElement} element - The element to test
       * @returns {undefined}
       */

    }, {
      key: '_wrap',
      value: function _wrap(element) {
        // Only need to proceed if the element is not already wrapped
        if (this._isWrapped(element)) return;
        // Create our wrapper
        var wrapper = newElem('div', this.cfg.cls.wrap);
        // Wrap the element's content
        element.appendChild(wrapper);
        while (element.firstChild !== wrapper) {
          wrapper.appendChild(element.firstChild);
        }
        // Create the waves container
        var waves = newElem('div', this.cfg.cls.waves);
        // Insert the waves before the content wrapper
        element.insertBefore(waves, wrapper);
      }
    }], [{
      key: '_getDuration',
      value: function _getDuration(element) {
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

      /**
       * Determines how big a wave should be such that it completely covers the
       * element it is being displayed on.
       *
       * @param {HTMLElement} element - The .splash element we are testing
       * @param {Object} position - The position of the event relative to `element`
       * @param {Number} position.left - Horizontal position of the event (circle center)
       * @param {Number} position.top - Vertical position of the event (circle center)
       */

    }, {
      key: '_getWaveSize',
      value: function _getWaveSize(element, position) {
        // Determine which point of the element the event took place furthest from
        var fx = position.left < element.offsetWidth / 2 ? element.offsetWidth : 0;
        var fy = position.top < element.offsetHeight / 2 ? element.offsetHeight : 0;
        // Calculate the distances from the event to the furthest point
        var dx = Math.abs(position.left - fx);
        var dy = Math.abs(position.top - fy);
        // Now we can calculate the required radius of the circle by using
        // pythagoras theorem - a^2 + b^2 = c^2 - in this context, b and c are
        // `dx` and `dy` and `a` is the radius value we need.
        return Math.sqrt(dx * dx + dy * dy);
      }
    }]);

    return Splash;
  }();

  return Splash;

})));
