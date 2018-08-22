import { isElem, isList } from './util';

import defaultConfig from './config';
import SplashElement from './splash-element';

class Splash {

  /**
   * Attachs global event listeners to the window
   *
   * @returns {undefined}
   * @private
   */
  static addListeners() {
    // Track the mouse movement for focus/blur events
    window.addEventListener('mousemove', Splash.onMouseMove.bind(Splash), false);
  }

  /**
   * Attach Splash functionality to a selection of elements on the page, that
   * do not necessarily have the base class.
   *
   * @param  {String|NodeList|HTMLElement} selection - The element(s) to use
   * @param  {Object} config - A config object, overriding the instance's defaults
   * @return {undefined}
   */
  attach(selection, config = {}) {
    // Normalize the user's selection
    const elements = this.normalize(selection);
    // Make sure `config` is an object
    let cfg = this.ts.call(config) !== '[object Object]' ? {} : config;
    // Merge config with defaults (overriding)
    cfg = Object.assign({}, this.cfg, cfg);
    // Loop the elements and init/update them
    for (let i = 0; i < elements.length; i += 1) {
      // See if we have already touched that element
      const found = this.find(elements[i]);
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
  constructor(config = {}) {
    // Shortcuts
    this.ts = Object.prototype.toString;
    this.$ = document.querySelectorAll.bind(document);
    // Make sure `config` is an object
    const cfg = this.ts.call(config) !== '[object Object]' ? {} : config;
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
  destroy() {
    for (let i = 0; i < this.active.length; i += 1) {
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
  find(element) {
    return this.active.filter(splashElement => splashElement.elem === element)[0];
  }

  /**
   * Initializes the Splash functionality for all elements on the page with
   * the correct base class.
   *
   * @returns {undefined}
   */
  init() {
    this.active = [];
    const elements = this.$(`.${this.cfg.class.base}`);
    for (let i = 0; i < elements.length; i += 1) {
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
  normalize(selection) {
    if (typeof selection === 'string') return this.$(selection);
    if (isList(selection)) return selection;
    if (isElem(selection)) return [selection];
    return [];
  }

  /**
   * Callback for the `mousemove` event on the window object.
   *
   * @param {Event} e
   * @returns {undefined}
   */
  static onMouseMove(e) {
    window.Splash.mouseX = e.pageX || 0;
    window.Splash.mouseY = e.pageY || 0;
  }

}

// Create an object on the window (sorry!) to hold some library-related info.
window.Splash = {
  // Holds the current co-ordinates of the mouse. Will be updated in the
  // mousemove event callback. This is the only way to know where the mouse was
  // when focusing an input, as the focus event is not a Mouse event and therefore
  // does not contain the properties that tell us where the mouse is positioned.
  // (https://stackoverflow.com/a/7984782/3389737)
  mouseX: 0,
  mouseY: 0,
};

// Add global event listeners
Splash.addListeners();

export default Splash;
