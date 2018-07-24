import {
  isElem,
  isList,
} from './util';

import SplashElement from './splash-element';

// Default options for the library
const defaultConfig = {
  click: false,
  hover: true,
  class: {
    base: 'splash',
    disabled: 'disabled',
    wave: 'splash-wave',
    waveOut: 'splash-wave-out',
    waves: 'splash-waves',
    wrap: 'splash-wrap',
  },
};

export default class Splash {

  /**
   * [attach description]
   *
   * @param  {[type]} selection [description]
   * @param  {Object} config    [description]
   * @return {[type]}           [description]
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
   * [destroy description]
   *
   * @return {[type]} [description]
   */
  destroy() {
    for (let i = 0; i < this.active.length; i += 1) {
      this.active[i].destroy();
      delete this.active[i];
    }
  }

  /**
   * [find description]
   *
   * @param  {[type]} elem [description]
   * @return {[type]}      [description]
   */
  find(elem) {
    return this.active.filter(splashElement => splashElement.elem === elem)[0];
  }

  /**
   *
   */
  init() {
    this.active = [];
    const elements = this.$(`.${this.cfg.class.base}`);
    for (let i = 0; i < elements.length; i += 1) {
      this.active.push(new SplashElement(elements[i], this.cfg));
    }
  }

  /**
   *
   */
  normalize(selection) {
    if (typeof selection === 'string') return this.$(selection);
    if (isList(selection)) return selection;
    if (isElem(selection)) return [selection];
    return [];
  }

}
