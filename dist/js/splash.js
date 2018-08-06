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

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  /**
   * Finds the first immediate child with the class `className` of the `parent`.
   *
   * @param {HTMLElement} parent - The DOM element to search
   * @param {String} className - The class name to search for
   * @returns {undefined|HTMLElement}
   */
  function first(parent, className) {
    var found = void 0;
    if (!parent || !parent.children) return found;
    for (var i = 0; i < parent.children.length; i += 1) {
      if (parent.children[i].classList.contains(className)) {
        found = parent.children[i];
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
    var _element$classList;

    var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var element = document.createElement(selector);
    (_element$classList = element.classList).add.apply(_element$classList, toConsumableArray(classes));
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
    return (typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object' ? o instanceof HTMLElement : !!o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string';
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
    return !!o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && !!(o.length || Object.keys(o).length) && /^\[object (Array|HTMLCollection|NodeList|Object)\]$/.test(str);
  }

  // The default configuration for the library.
  //   Separated into another file so it can be pulled into tests.
  var defaultConfig = {
    click: true,
    hover: true,
    waitForMouseup: false,
    class: {
      base: 'splash',
      clickWave: 'splash-click',
      clickOut: 'splash-click-out',
      disabled: 'disabled',
      fade: 'splash-fade',
      hoverWave: 'splash-hover',
      hoverOut: 'splash-hover-out',
      waves: 'splash-waves',
      wrap: 'splash-wrap'
    }
  };

  var SP_CLICK = 'click';
  var SP_HOVER = 'hover';

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
        // Hover
        this.elem.addEventListener('mouseenter', this.handler.start, false);
        this.elem.addEventListener('mouseleave', this.handler.end, false);
        // Click
        // - Listen for mouseup on document because even though the mousedown might
        //   occur on our element, we cannot guarantee the mouseup event will, so we
        //   need to listen for all mouseup events to enable tidying up the waves.
        this.elem.addEventListener('mousedown', this.handler.start, false);
        document.addEventListener('mouseup', this.handler.end, false);
        // Touch
        // touchstart
        // touchmove
        // touchend
        // touchcancel
      }

      /**
       * Creates a new element for a wave effect within the waves container inside
       * this Splash element.
       *
       * @return {HTMLElement} The generated element for the wave effect
       */

    }, {
      key: 'createWave',
      value: function createWave(key, className) {
        // Create a new element for our wave
        var wave = newElem('div', [className]);
        // Insert the wave into the waves container
        this.waves.appendChild(wave);
        // Save a reference to the wave
        this.saveWave(key, wave);
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
      // Acts as a state for the active waves. When a wave is created, a reference
      // is saved to this property, so that if the wave needs to be manipulated in
      // another event's callback, we can access safely it again. Without this,
      // nesting .splash elements and combining click/hover causes problems.
      this.active = {
        click: null,
        hover: null
      };
      // Wrap this element's content with our required elements
      this.wrap();
      // Add event listeners to this element
      //  Save references on the class so that if the event listeners are removed
      //  in future, we are definitely referencing the same methods.
      this.handler = {
        start: this.startEffect.bind(this),
        end: this.endEffect.bind(this)
      };
      this.addEventListeners();
    }

    /**
     * Destroys all functionality attached to this Splash element by removing
     * the event listeners and returning the markup to its initial state.
     *
     * @returns {undefined}
     */


    createClass(SplashElement, [{
      key: 'destroy',
      value: function destroy() {
        this.removeEventListeners();
        this.unwrap();
      }

      /**
       * Callback function for the 'mouseleave' and 'mouseup' events. Cleans up
       * any existing waves by scaling or fading them out.
       *
       * @param {Event} e
       * @returns {undefined}
       */

    }, {
      key: 'endEffect',
      value: function endEffect(e) {
        var _this = this;

        e.stopPropagation();
        // Determine which wave this should be from the event type (click|hover)
        var type = SplashElement.getWaveType(e.type);
        if (!type) return;
        // If this is a click wave and `waitForMouseup` is off, we don't need to
        // do any cleanup as it has already been done in this.startEffect
        if (type === SP_CLICK && !this.cfg.waitForMouseup) return;
        // Do not proceed if the DOM element is disabled (attribute or class)
        if (this.isDisabled) return;
        // Do not proceed if the configuration has (click|hover) disabled
        if (!this.cfg[type]) return;
        // Determine the offset of the element relative to the viewport
        var offset = getOffset(this.elem);
        // Find the hover wave element
        var wave = this.getWave(type);
        if (!wave) return;
        // Determine how long the animations are set to take
        var waveDur = SplashElement.getDuration(wave);
        // If this is a click wave, we simply need to fade it out
        if (type === SP_CLICK) {
          // Fade out the wave
          wave.classList.add(this.cfg.class.fade);
        }
        // If this is a hover wave, we need to reposition the wave before scaling
        if (type === SP_HOVER) {
          // Position the wave where the cursor left the splash element
          // In order to get left/top values relative to the position of the element,
          // we must subtract the element's offset from the co-ordinates of the event.
          wave.style.left = e.pageX - offset.x + 'px';
          wave.style.top = e.pageY - offset.y + 'px';
          // Bring the wave back in
          wave.classList.remove(this.cfg.class[type + 'Out']);
        }
        // For both, we need to wait until the scaling/fading has completed,
        // and remove the wave from the DOM
        setTimeout(function () {
          _this.waves.removeChild(wave);
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
        return Math.ceil(Math.sqrt(dx * dx + dy * dy));
      }

      /**
       * Gets a reference to a wave element from the 'active' object
       *
       * @returns {HTMLElement}
       */

    }, {
      key: 'getWave',
      value: function getWave(key) {
        // Check that the key actually exists first
        if (!Object.prototype.hasOwnProperty.call(this.active, key)) return undefined;
        var wave = this.active[key];
        delete this.active[key];
        return wave;
      }

      /**
       * Determines which type of Splash wave we need (click|hover) based on the
       * provided eventType (mouseenter, mouseleave, mousedown etc.)
       *
       * @param {String} eventType - The `type` property of the Event object passed
       *                             to event listener callback functions.
       * @returns {String|Boolean} Type of wave needed or false if eventType is invalid
       */

    }, {
      key: 'removeEventListeners',


      /**
       * Removes our event listeners from this Splash element
       *
       * @returns {undefined}
       */
      value: function removeEventListeners() {
        this.elem.removeEventListener('mouseenter', this.handler.mouseenter, false);
        this.elem.removeEventListener('mouseleave', this.handler.mouseleave, false);
      }

      /**
       * Saves a reference to a given (hover) wave to be accessed later
       *
       * @param {HTMLElement} wave - The (hover) wave to save
       * @returns {undefined}
       */

    }, {
      key: 'saveWave',
      value: function saveWave(key, wave) {
        this.active[key] = wave;
      }

      /**
       * Callback function for the 'mouseenter' and 'mousedown' events. Creates the
       * wave element and starts the animations.
       *
       * @param {Event} e
       * @returns {undefined}
       */

    }, {
      key: 'startEffect',
      value: function startEffect(e) {
        var _this2 = this;

        e.stopPropagation();
        // Determine which wave this should be from the event type (click|hover)
        var type = SplashElement.getWaveType(e.type);
        if (!type) return;
        // Do not proceed if the DOM element is disabled (attribute or class)
        if (this.isDisabled) return;
        // Do not proceed if the configuration has (click|hover) disabled
        if (!this.cfg[type]) return;
        // Determine the offset of the element relative to the viewport
        var offset = getOffset(this.elem);
        // Create a new wave element inside our container
        var wave = this.createWave(type, this.cfg.class[type + 'Wave']);
        // Determine the position of the event (which will be used as the center of
        // the wave's circle) relative to this Splash element.
        // In order to get left|top values that are relative to the element, we
        // must subtract the element's offset from the co-ordinates of the event.
        var posX = e.pageX - offset.x;
        var posY = e.pageY - offset.y;
        // Center the new wave element where the event took place
        // - Either where the mouse entered the element or where a click took place
        wave.style.left = posX + 'px';
        wave.style.top = posY + 'px';
        // Determine what size the wave should be
        var radius = this.getSize(posX, posY);
        // Apply the size to the wave
        wave.style.width = 2 * radius + 'px';
        wave.style.height = 2 * radius + 'px';
        // Make the wave spread out
        wave.classList.add(this.cfg.class[type + 'Out']);
        // If this is a click wave and `waitForMouseup` is off, we need to clean it
        // up after the animation is complete.
        if (type === SP_CLICK && !this.cfg.waitForMouseup) {
          // Determine how long the animations are set to take
          var waveDur = SplashElement.getDuration(wave);
          // Wait for the animation to finish..
          setTimeout(function () {
            // ..and fade out the wave
            wave.classList.add(_this2.cfg.class.fade);
            // Wait for the fading to finish and remove the wave
            setTimeout(function () {
              _this2.waves.removeChild(wave);
            }, waveDur);
          }, waveDur);
        }
      }

      /**
       * Unwraps this element's contents and returns to its normal markup
       *
       * @returns {undefined}
       */

    }, {
      key: 'unwrap',
      value: function unwrap() {
        // Remove the waves container
        this.elem.removeChild(this.waves);
        this.waves = null;
        // Unwrap the original content
        while (this.wrapper.firstChild) {
          this.elem.insertBefore(this.wrapper.firstChild, this.wrapper);
        }
        this.elem.removeChild(this.wrapper);
        this.wrapper = null;
        // Remove the base class
        this.elem.classList.remove(this.cfg.class.base);
      }

      /**
       * Updates the configuration for this Splash element
       *
       * @param {Object|undefined} config - The configuration settings
       * @returns {undefined}
       */

    }, {
      key: 'update',
      value: function update() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.cfg = Object.assign({}, config);
      }

      /**
       * Wraps this element's contents so we can add wave effects
       *
       * @returns {undefined}
       */

    }, {
      key: 'wrap',
      value: function wrap() {
        // Ensure the element has the base class
        this.elem.classList.add(this.cfg.class.base);
        // We should only proceed if the element is not already wrapped
        if (this.isWrapped) return;
        // Create our wrapper
        var wrapper = newElem('div', [this.cfg.class.wrap]);
        // Wrap the element's content
        this.elem.appendChild(wrapper);
        while (this.elem.firstChild !== wrapper) {
          wrapper.appendChild(this.elem.firstChild);
        }
        // Create the waves container
        var waves = newElem('div', [this.cfg.class.waves]);
        // Insert the waves before the content wrapper
        this.elem.insertBefore(waves, wrapper);
        // Saves references to the waves container and the wrapper
        this.waves = waves;
        this.wrapper = wrapper;
      }
    }, {
      key: 'isDisabled',


      /**
       * Determines if this element is disabled, either by attribute or class
       *
       * @returns {Boolean}
       */
      get: function get$$1() {
        return this.elem.hasAttribute('disabled') || this.elem.classList.contains(this.cfg.class.disabled);
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
    }, {
      key: 'getWaveType',
      value: function getWaveType(eventType) {
        var type = void 0;
        switch (eventType) {
          case 'mousedown':
          case 'mouseup':
            type = SP_CLICK;
            break;
          case 'mouseenter':
          case 'mouseleave':
            type = SP_HOVER;
            break;
          default:
            type = false;
        }
        return type;
      }
    }]);
    return SplashElement;
  }();

  var Splash = function () {
    createClass(Splash, [{
      key: 'attach',


      /**
       * Attach Splash functionality to a selection of elements on the page, that
       * do not necessarily have the base class.
       *
       * @param  {String|NodeList|HTMLElement} selection - The element(s) to use
       * @param  {Object} config - A config object, overriding the instance's defaults
       * @return {undefined}
       */
      value: function attach(selection) {
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        // Normalize the user's selection
        var elements = this.normalize(selection);
        // Make sure `config` is an object
        var cfg = this.ts.call(config) !== '[object Object]' ? {} : config;
        // Merge config with defaults (overriding)
        cfg = Object.assign({}, this.cfg, cfg);
        // Loop the elements and init/update them
        for (var i = 0; i < elements.length; i += 1) {
          // See if we have already touched that element
          var found = this.find(elements[i]);
          // If we have, update its config
          if (found !== undefined) found.update(cfg);
          // If we haven't, create a new instance
          else this.active.push(new SplashElement(elements[i], cfg));
        }
      }

      /**
       * Sets up the class
       *
       * @param {Object|undefined} config - The user-specified configuration
       * @returns {undefined}
       */

    }]);

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
     * Destroys all Splash functionality for the currently active elements created
     * by this Splash instance. Unwraps the element's original content and removes
     * event listeners.
     *
     * @return {undefined}
     */


    createClass(Splash, [{
      key: 'destroy',
      value: function destroy() {
        for (var i = 0; i < this.active.length; i += 1) {
          this.active[i].destroy();
          delete this.active[i];
        }
      }

      /**
       * Finds the SplashElement instance (created by this Splash instance) for the
       * given HTMLElement, if it exists.
       *
       * @param {HTMLElement} element - The element to search for
       * @return {SplashElement|undefined}
       */

    }, {
      key: 'find',
      value: function find(element) {
        return this.active.filter(function (splashElement) {
          return splashElement.elem === element;
        })[0];
      }

      /**
       * Initializes the Splash functionality for all elements on the page with
       * the correct base class.
       *
       * @returns {undefined}
       */

    }, {
      key: 'init',
      value: function init() {
        this.active = [];
        var elements = this.$('.' + this.cfg.class.base);
        for (var i = 0; i < elements.length; i += 1) {
          this.active.push(new SplashElement(elements[i], this.cfg));
        }
      }

      /**
       * Takes an element selection (as a selector string, NodeList or HTMLElement)
       * from the user and returns a consistent list of elements to work with.
       *
       * @param {String|NodeList|HTMLElement} selection - The selection of elements
       * @returns {NodeList|Array[HTMLElement]}
       */

    }, {
      key: 'normalize',
      value: function normalize(selection) {
        if (typeof selection === 'string') return this.$(selection);
        if (isList(selection)) return selection;
        if (isElem(selection)) return [selection];
        return [];
      }
    }]);
    return Splash;
  }();

  return Splash;

})));
