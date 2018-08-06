import { first, getOffset, newElem } from './util';

const SP_CLICK = 'click';
const SP_HOVER = 'hover';

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
  createWave(key, className) {
    // Create a new element for our wave
    const wave = newElem('div', [className]);
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
  constructor(element, config = {}) {
    // Save references to the element and the config
    this.elem = element;
    this.cfg = config;
    // Acts as a state for the active waves. When a wave is created, a reference
    // is saved to this property, so that if the wave needs to be manipulated in
    // another event's callback, we can access safely it again. Without this,
    // nesting .splash elements and combining click/hover causes problems.
    this.active = {
      click: null,
      hover: null,
    };
    // Wrap this element's content with our required elements
    this.wrap();
    // Add event listeners to this element
    //  Save references on the class so that if the event listeners are removed
    //  in future, we are definitely referencing the same methods.
    this.handler = {
      start: this.startEffect.bind(this),
      end: this.endEffect.bind(this),
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
   * Callback function for the 'mouseleave' and 'mouseup' events. Cleans up
   * any existing waves by scaling or fading them out.
   *
   * @param {Event} e
   * @returns {undefined}
   */
  endEffect(e) {
    e.stopPropagation();
    // Determine which wave this should be from the event type (click|hover)
    const type = SplashElement.getWaveType(e.type);
    if (!type) return;
    // If this is a click wave and `waitForMouseup` is off, we don't need to
    // do any cleanup as it has already been done in this.startEffect
    if (type === SP_CLICK && !this.cfg.waitForMouseup) return;
    // Do not proceed if the DOM element is disabled (attribute or class)
    if (this.isDisabled) return;
    // Do not proceed if the configuration has (click|hover) disabled
    if (!this.cfg[type]) return;
    // Determine the offset of the element relative to the viewport
    const offset = getOffset(this.elem);
    // Find the hover wave element
    const wave = this.getWave(type);
    if (!wave) return;
    // Determine how long the animations are set to take
    const waveDur = SplashElement.getDuration(wave);
    // If this is a click wave, we simply need to fade it out
    if (type === SP_CLICK) {
      // Fade out the wave
      wave.classList.add(this.cfg.class.hide);
    }
    // If this is a hover wave, we need to reposition the wave before scaling
    if (type === SP_HOVER) {
      // Position the wave where the cursor left the splash element
      // In order to get left/top values relative to the position of the element,
      // we must subtract the element's offset from the co-ordinates of the event.
      wave.style.left = `${e.pageX - offset.x}px`;
      wave.style.top = `${e.pageY - offset.y}px`;
      // Bring the wave back in
      wave.classList.remove(this.cfg.class[`${type}Out`]);
    }
    // For both, we need to wait until the scaling/fading has completed,
    // and remove the wave from the DOM
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
    return Math.ceil(Math.sqrt((dx * dx) + (dy * dy)));
  }

  /**
   * Gets a reference to a wave element from the 'active' object
   *
   * @returns {HTMLElement}
   */
  getWave(key) {
    // Check that the key actually exists first
    if (!Object.prototype.hasOwnProperty.call(this.active, key)) return undefined;
    const wave = this.active[key];
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
  static getWaveType(eventType) {
    let type;
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

  /**
   * Determines if this element is disabled, either by attribute or class
   *
   * @returns {Boolean}
   */
  get isDisabled() {
    return this.elem.hasAttribute('disabled')
        || this.elem.classList.contains(this.cfg.class.disabled);
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
   * Saves a reference to a given (hover) wave to be accessed later
   *
   * @param {HTMLElement} wave - The (hover) wave to save
   * @returns {undefined}
   */
  saveWave(key, wave) {
    this.active[key] = wave;
  }

  /**
   * Callback function for the 'mouseenter' and 'mousedown' events. Creates the
   * wave element and starts the animations.
   *
   * @param {Event} e
   * @returns {undefined}
   */
  startEffect(e) {
    e.stopPropagation();
    // Determine which wave this should be from the event type (click|hover)
    const type = SplashElement.getWaveType(e.type);
    if (!type) return;
    // Do not proceed if the DOM element is disabled (attribute or class)
    if (this.isDisabled) return;
    // Do not proceed if the configuration has (click|hover) disabled
    if (!this.cfg[type]) return;
    // Determine the offset of the element relative to the viewport
    const offset = getOffset(this.elem);
    // Create a new wave element inside our container
    const wave = this.createWave(type, this.cfg.class[`${type}Wave`]);
    // Determine the position of the event (which will be used as the center of
    // the wave's circle) relative to this Splash element.
    // In order to get left|top values that are relative to the element, we
    // must subtract the element's offset from the co-ordinates of the event.
    const posX = e.pageX - offset.x;
    const posY = e.pageY - offset.y;
    // Center the new wave element where the event took place
    // - Either where the mouse entered the element or where a click took place
    wave.style.left = `${posX}px`;
    wave.style.top = `${posY}px`;
    // Determine what size the wave should be
    const radius = this.getSize(posX, posY);
    // Apply the size to the wave
    wave.style.width = `${2 * radius}px`;
    wave.style.height = `${2 * radius}px`;
    // Make the wave spread out
    wave.classList.add(this.cfg.class[`${type}Out`]);
    // If this is a click wave and `waitForMouseup` is off, we need to clean it
    // up after the animation is complete.
    if (type === SP_CLICK && !this.cfg.waitForMouseup) {
      // Determine how long the animations are set to take
      const waveDur = SplashElement.getDuration(wave);
      // Wait for the animation to finish..
      setTimeout(() => {
        // ..and fade out the wave
        wave.classList.add(this.cfg.class.hide);
        // Wait for the fading to finish and remove the wave
        setTimeout(() => {
          this.waves.removeChild(wave);
        }, waveDur);
      }, waveDur);
    }
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
    this.elem.classList.remove(this.cfg.class.base);
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
    this.elem.classList.add(this.cfg.class.base);
    // We should only proceed if the element is not already wrapped
    if (this.isWrapped) return;
    // Create our wrapper
    const wrapper = newElem('div', [this.cfg.class.wrap]);
    // Wrap the element's content
    this.elem.appendChild(wrapper);
    while (this.elem.firstChild !== wrapper) {
      wrapper.appendChild(this.elem.firstChild);
    }
    // Create the waves container
    const waves = newElem('div', [this.cfg.class.waves]);
    // Insert the waves before the content wrapper
    this.elem.insertBefore(waves, wrapper);
    // Saves references to the waves container and the wrapper
    this.waves = waves;
    this.wrapper = wrapper;
  }

}
