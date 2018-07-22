import {
  isElem,
  isList,
} from './util';

import SplashElement from './splash-elem';

// Default options for the library
const defaultConfig = {
  attr: 'data-splash-waves',
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
   * Sets up the class
   *
   * @param {Object|undefined} config - The user-specified configuration settings
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
   *
   */
  init() {
    this.active = [];
    // Locate the splash elements
    const elements = this.$(`.${this.cfg.class.base}`);
    // Instantiate splash on each element with current config
    for (let i = 0; i < elements.length; i += 1) {
      const se = new SplashElement(elements[i], this.cfg);
      this.active.push(se);
    }
  }

  /**
   *
   */
  _normalize(selection) {
    if (typeof selection === 'string') return this.$$(selection);
    if (isList(selection)) return selection;
    if (isElem(selection)) return [selection];
    return [];
  }

}
