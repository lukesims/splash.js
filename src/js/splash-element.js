import {
  addClass,
  first,
  getOffset,
  hasClass,
  newElem,
  removeClass,
} from './util';

/**
 * This class represents an individual .splash element.
 * Allows each instantiation to have unique configurations.
 */
export default class SplashElement {

  /**
   * Attachs our event listeners to this Splash element
   *
   * @returns {undefined}
   */
  addEventListeners() {
    // Hover
    this.elem.addEventListener('mouseenter', this.handler.mouseenter, false);
    this.elem.addEventListener('mouseleave', this.handler.mouseleave, false);
    // Click
    this.elem.addEventListener('mousedown', this.handler.mousedown, false);
    this.elem.addEventListener('mouseup', this.handler.mouseup, false);
  }

  /**
   * Creates a new element for a wave effect within the waves container inside
   * this Splash element.
   *
   * @return {HTMLElement} The generated element for the wave effect
   */
  createWave() {
    // Create a new element for our wave
    const wave = newElem('div', this.cfg.class.wave);
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
  constructor(element, config = {}) {
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
    //  Save references on the class so that if the event listeners are removed
    //  in future, we are definitely referencing the same methods.
    this.handler = {
      mouseenter: this.startHover.bind(this),
      mouseleave: this.endHover.bind(this),
      mousedown: this.startClick.bind(this),
      mouseup: this.endClick.bind(this),
    };
    this.addEventListeners();
  }

  /**
   * Destroys all functionality attached to this Splash element by removing
   * the event listeners and returning the markup to its initial state.
   *
   * @returns {undefined}
   */
  destroy() {
    this.removeEventListeners();
    this.unwrap();
  }

  /**
   * Callback for the `mouseup` event on this Splash element
   *
   * @param {Event} e
   * @returns {undefined}
   */
  endClick(e) {
    //
  }

  /**
   * Callback for the `mouseleave` event
   *
   * @param {Event} e
   * @returns {undefined}
   */
  endHover(e) {
    e.stopPropagation();
    // Determine the offset of the element relative to the viewport
    const offset = getOffset(this.elem);
    // Find the wave element
    const wave = this.getWave();
    // Position the wave where the cursor left the splash element
    // In order to get left/top values relative to the position of the element,
    // we must subtract the element's offset from the co-ordinates of the event.
    wave.style.left = `${e.pageX - offset.x}px`;
    wave.style.top = `${e.pageY - offset.y}px`;
    // Bring the wave back in
    removeClass(wave, this.cfg.class.waveOut);
    // Determine how long the animations are set to take
    const waveDur = SplashElement.getDuration(wave);
    // Wait for the animation to finish and remove the wave
    setTimeout(() => {
      this.waves.removeChild(wave);
    }, waveDur);
  }

  /**
   * Takes an element, reads the computed 'transition-duration' value,
   * and then returns the duration in milliseconds as an integer.
   *
   * @param {HTMLElement} element - The element to test
   * @returns {Number} The duration in ms
   */
  static getDuration(element) {
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
   * Determines how big a wave should be such that it completely covers this
   * Splash element which it is being displayed on.
   *
   * @param {Number} posX - Horizontal position of the event (circle center)
   * @param {Number} posY - Vertical position of the event (circle center)
   * @returns {Number} The calculated radius for the wave's circle
   */
  getSize(posX, posY) {
    // Determine which point of the element the event took place furthest from
    const fx = posX < this.elem.offsetWidth / 2 ? this.elem.offsetWidth : 0;
    const fy = posY < this.elem.offsetHeight / 2 ? this.elem.offsetHeight : 0;
    // Calculate the distances from the event to the furthest point
    const dx = Math.abs(posX - fx);
    const dy = Math.abs(posY - fy);
    // Now we can calculate the required radius of the circle by using
    // pythagoras theorem - a^2 + b^2 = c^2 - in this context, a and b are
    // `dx` and `dy` and `c` is the radius value we need.
    return Math.sqrt((dx * dx) + (dy * dy));
  }

  /**
   * Gets the currently active hover wave
   *
   * @returns {HTMLElement}
   */
  getWave() {
    const wave = this.active;
    delete this.active;
    return wave;
  }

  /**
   * Determines if this element is disabled, either by attribute or class
   *
   * @returns {Boolean}
   */
  get isDisabled() {
    return this.elem.hasAttribute('disabled')
        || hasClass(this.elem, this.cfg.class.disabled);
  }

  /**
   * Determines if this element's contents has already been wrapped
   *
   * @returns {Boolean}
   */
  get isWrapped() {
    return !!first(this.elem, this.cfg.class.waves);
  }

  /**
   * Removes our event listeners from this Splash element
   *
   * @returns {undefined}
   */
  removeEventListeners() {
    this.elem.removeEventListener('mouseenter', this.handler.mouseenter, false);
    this.elem.removeEventListener('mouseleave', this.handler.mouseleave, false);
  }

  /**
   * Saves a reference to a given wave to be accessed later
   *
   * @param {HTMLElement} wave - The wave to save
   * @returns {undefined}
   */
  save(wave) {
    this.active = wave;
  }

  /**
   * Callback for the `mousedown` event on this Splash element
   *
   * @param {Event} e
   * @returns {undefined}
   */
  startClick(e) {
    //
  }

  /**
   * Callback for the `mouseenter` event on this Splash element
   *
   * @param {Event} e
   * @returns {undefined}
   */
  startHover(e) {
    e.stopPropagation();
    // Do not proceed if hover or the element itself is disabled
    if (this.isDisabled) return;
    if (!this.cfg.hover) return;
    // Determine the offset of the element relative to the viewport
    const offset = getOffset(this.elem);
    // Create a new wave element inside our container
    const wave = this.createWave();
    // Determine the position of the event (the center of the wave's circle)
    // relative to this Splash element. In order to get left/top values relative
    // to the position of the element, we must subtract the element's offset
    // from the co-ordinates of the event.
    const posX = e.pageX - offset.x;
    const posY = e.pageY - offset.y;
    // Position the wave where the cursor entered the Splash element
    wave.style.left = `${posX}px`;
    wave.style.top = `${posY}px`;
    // Determine what the size for our wave should be
    const size = this.getSize(posX, posY);
    // Apply the size to the wave
    wave.style.width = `${2 * size}px`;
    wave.style.height = `${2 * size}px`;
    // Make the wave spread out
    addClass(wave, this.cfg.class.waveOut);
  }

  /**
   * Unwraps this element's contents and returns to its normal markup
   *
   * @returns {undefined}
   */
  unwrap() {
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
    removeClass(this.elem, this.cfg.class.base);
  }

  /**
   * Updates the configuration for this Splash element
   *
   * @param {Object|undefined} config - The configuration settings
   * @returns {undefined}
   */
  update(config = {}) {
    this.cfg = Object.assign({}, config);
  }

  /**
   * Wraps this element's contents so we can add wave effects
   *
   * @returns {undefined}
   */
  wrap() {
    // Ensure the element has the base class
    addClass(this.elem, this.cfg.class.base);
    // We should only proceed if the element is not already wrapped
    if (this.isWrapped) return;
    // Create our wrapper
    const wrapper = newElem('div', this.cfg.class.wrap);
    // Wrap the element's content
    this.elem.appendChild(wrapper);
    while (this.elem.firstChild !== wrapper) {
      wrapper.appendChild(this.elem.firstChild);
    }
    // Create the waves container
    const waves = newElem('div', this.cfg.class.waves);
    // Insert the waves before the content wrapper
    this.elem.insertBefore(waves, wrapper);
    // Saves references to the waves container and the wrapper
    this.waves = waves;
    this.wrapper = wrapper;
  }

}
