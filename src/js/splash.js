import {
  addClass,
  first,
  getOffset,
  isElem,
  isList,
  newElem,
  removeClass,
} from './util';

// Default options for the library
const defaultConfig = {
  attr: 'data-splash-waves',
  cls: {
    base: 'splash',
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
  _addEventListeners() {
    // Locate the splash elements
    const elements = this.$(`.${this.cfg.cls.base}`);
    // Attach the event listeners to each splash element
    for (let i = 0; i < elements.length; i += 1) {
      const elem = elements[i];
      elem.addEventListener('mouseenter', e => this._startHover(e), false);
      elem.addEventListener('mouseleave', e => this._endHover(e), false);
    }
  }

  /**
   * Creates a new element for a wave effect within the waves container inside
   * the given element.
   *
   * @param {HTMLElement} element - The element to create a wave for
   * @return {HTMLElement} The generated element for the wave effect
   */
  _createWave(element) {
    // Create a new element for our wave
    const wave = newElem('div', this.cfg.cls.wave);
    // Find the waves container within our element
    const container = first(element, this.cfg.cls.waves);
    // Insert the wave into the container
    container.appendChild(wave);
    // Save a reference to the wave
    const ts = Date.now();
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
  _endHover(e) {
    e.stopPropagation();
    // Get the target of the event listeners, which is our .splash elements
    const element = e.currentTarget;
    // Determine the offset of the element relative to the viewport
    const offset = getOffset(element);
    // Find the waves container
    const waves = first(element, this.cfg.cls.waves);
    // Find the wave element
    const ts = element.getAttribute(this.cfg.attr);
    const wave = this.active[ts];
    delete this.active[ts];
    element.removeAttribute(this.cfg.attr);
    // Position the wave where the cursor left the splash element
    // In order to get left/top values relative to the position of the element,
    // we must subtract the element's offset from the co-ordinates of the event.
    wave.style.left = `${e.pageX - offset.x}px`;
    wave.style.top = `${e.pageY - offset.y}px`;
    // Bring the wave back in
    removeClass(wave, this.cfg.cls.waveOut);
    // Determine how long the animations are set to take
    const waveDur = Splash._getDuration(wave);
    // Wait for the animation to finish and remove the wave
    setTimeout(() => {
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
  static _getDuration(element) {
    // Get the duration specified in the styles
    const styles = window.getComputedStyle(element, null);
    const cssDur = styles.getPropertyValue('transition-duration');
    // Strip the unit from the string and get a number
    const numDur = parseFloat(cssDur);
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
  static _getWaveSize(element, position) {
    // Determine which point of the element the event took place furthest from
    const fx = position.left < element.offsetWidth / 2 ? element.offsetWidth : 0;
    const fy = position.top < element.offsetHeight / 2 ? element.offsetHeight : 0;
    // Calculate the distances from the event to the furthest point
    const dx = Math.abs(position.left - fx);
    const dy = Math.abs(position.top - fy);
    // Now we can calculate the required radius of the circle by using
    // pythagoras theorem - a^2 + b^2 = c^2 - in this context, b and c are
    // `dx` and `dy` and `a` is the radius value we need.
    return Math.sqrt((dx * dx) + (dy * dy));
  }

  /**
   * Determines if the given element has already been wrapped by the library
   *
   * @param {HTMLElement} element - The element to test
   * @returns {Boolean}
   */
  _isWrapped(element) {
    return !!first(element, this.cfg.cls.waves);
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

  /**
   * Callback for the `mouseenter` event
   *
   * @param {Event} e
   * @returns {undefined}
   */
  _startHover(e) {
    e.stopPropagation();
    // Get the target of the event listeners, which is our .splash elements
    const element = e.currentTarget;
    // Determine the offset of the element relative to the viewport
    const offset = getOffset(element);
    // Wrap the contents of `element` with our lib-specific elements
    this._wrap(element);
    // Create a new wave element inside our container
    const wave = this._createWave(element);
    // Determine the position of the event/wave relative to the element
    const position = {
      left: e.pageX - offset.x,
      top: e.pageY - offset.y,
    };
    // Position the wave where the cursor entered the splash element
    // In order to get left/top values relative to the position of the element,
    // we must subtract the element's offset from the co-ordinates of the event.
    wave.style.left = `${position.left}px`;
    wave.style.top = `${position.top}px`;
    // Determine what the size for our wave should be.
    const size = Splash._getWaveSize(element, position);
    // Apply the size to the wave
    wave.style.width = `${2 * size}px`;
    wave.style.height = `${2 * size}px`;
    // Make the wave spread out
    addClass(wave, this.cfg.cls.waveOut);
  }

  /**
   * Takes a Splash element and wraps its contents so we can add wave effects
   *
   * @param {HTMLElement} element - The element to test
   * @returns {undefined}
   */
  _wrap(element) {
    // Only need to proceed if the element is not already wrapped
    if (this._isWrapped(element)) return;
    // Create our wrapper
    const wrapper = newElem('div', this.cfg.cls.wrap);
    // Wrap the element's content
    element.appendChild(wrapper);
    while (element.firstChild !== wrapper) {
      wrapper.appendChild(element.firstChild);
    }
    // Create the waves container
    const waves = newElem('div', this.cfg.cls.waves);
    // Insert the waves before the content wrapper
    element.insertBefore(waves, wrapper);
  }

}
