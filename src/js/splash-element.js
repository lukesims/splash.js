import { first, getOffset, newElem } from './util';

const SP_CLICK = 'click';
const SP_FOCUS = 'focus';
const SP_HOVER = 'hover';

// https://www.w3.org/TR/html/syntax.html#void-elements
const SP_VOID = ['hr', 'img', 'input', 'select', 'textarea'];

/**
 * This class represents an individual .splash element.
 * Allows each instantiation to have unique configurations.
 */
export default class SplashElement {

  /**
   * Attachs our event listeners to this Splash element
   *
   * @returns {undefined}
   * @private
   */
  addListeners() {
    // Determine which elements to add the event listeners to
    const listenTo = this.isVoid ? this.wrapper.childNodes[0] : this.elem;
    // Add hover event listeners
    listenTo.addEventListener('mouseenter', this.handler.start, false);
    listenTo.addEventListener('mouseleave', this.handler.end, false);
    // Click
    // - Listen for mouseup on document because even though the mousedown might
    //   occur on our element, we cannot guarantee the mouseup event will, so we
    //   need to listen for all mouseup events to enable tidying up the waves.
    listenTo.addEventListener('mousedown', this.handler.start, false);
    document.addEventListener('mouseup', this.handler.end, false);
    // Touch
    //   touchstart
    //   touchmove
    //   touchend
    //   touchcancel
    // Focus
    listenTo.addEventListener('focus', this.handler.start, false);
    listenTo.addEventListener('blur', this.handler.end, false);
  }

  /**
   * Creates a new element for a wave effect within the waves container inside
   * this Splash element.
   *
   * @param {string} key - The type of wave; 'click' or 'hover'
   * @param {string} className - The desired classname for the wave
   * @return {HTMLElement} The generated element for the wave
   * @private
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
      focus: null,
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
    this.addListeners();
  }

  /**
   * Destroys all functionality attached to this Splash element by removing
   * the event listeners and returning the markup to its initial state.
   *
   * @returns {undefined}
   */
  destroy() {
    this.removeListeners();
    this.unwrap();
  }

  /**
   * Callback function for the 'mouseleave' and 'mouseup' events. Cleans up
   * any existing waves by scaling or fading them out.
   *
   * @param {Event} e
   * @returns {undefined}
   * @private
   */
  endEffect(e) {
    e.stopPropagation();
    // Determine which wave this should be from the event type (click|hover)
    const type = SplashElement.getWaveType(e.type);
    // If this is a click wave and `waitForMouseup` is off, we don't need to
    // do any cleanup as it has already been done in this.startEffect
    if (type === SP_CLICK && !this.cfg.waitForMouseup) return;
    // Check if we should proceed with the effect
    if (!this.shouldContinue(type)) return;
    // Determine the offset of the event relative to the element
    const offset = this.getOffset(e, type);
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
    // If this is a hover or focus wave, we need
    // to reposition the wave before scaling
    if (type === SP_HOVER || type === SP_FOCUS) {
      // Center the wave where the cursor left the Splash element.
      wave.style.left = `${offset.x}px`;
      wave.style.top = `${offset.y}px`;
      // Resize the wave so it fully covers the element
      this.resizeWave(wave, offset);
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
   * @private
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
   * Determine the offset of the event (`e`), relative to this Splash element
   *
   * @param {Event} e
   * @returns {Object} offset - The calculated offset
   * @returns {Number} offset.x - The calulcated left offset
   * @returns {Number} offset.y - The calulcated top offset
   * @private
   */
  getOffset(e, type) {
    // Determine the offset of the element relative to the viewport
    const offset = getOffset(this.elem);
    // Determine whether to get the mouse coordinates from the event itself
    // or from the Splash object (for focus effect)
    let mouseX = type === SP_FOCUS ? window.Splash.mouseX : e.pageX;
    let mouseY = type === SP_FOCUS ? window.Splash.mouseY : e.pageY;
    // If focusing the element using the keyboard, the mouse may be positioned
    // outside of the element itself at the time of focus, so we need to
    // constrain the mouse position to the bounding rectangle of the element.
    if (mouseX < offset.x) mouseX = offset.x;
    if (mouseY < offset.y) mouseY = offset.y;
    if (mouseX > offset.x + offset.w) mouseX = offset.x + offset.w;
    if (mouseY > offset.y + offset.h) mouseY = offset.y + offset.h;
    // Determine the position of the event (which will be used as the center of
    // the wave's circle) relative to this Splash element.
    // In order to get left|top values that are relative to the element, we
    // must subtract the element's offset from the co-ordinates of the event.
    const posX = mouseX - offset.x;
    const posY = mouseY - offset.y;
    // Return the calculated offset
    return {
      x: posX,
      y: posY,
    };
  }

  /**
   * Determines how big a wave should be such that it completely covers this
   * Splash element which it is being displayed on.
   *
   * @param {Object} offset - The offset of the event relative to the element
   * @param {Number} offset.x - Horizontal position of the event (circle center)
   * @param {Number} offset.y - Vertical position of the event (circle center)
   * @returns {Number} The calculated radius for the wave's circle
   * @private
   */
  getSize(offset) {
    // Determine which point of the element the event took place furthest from
    const fx = offset.x < this.elem.offsetWidth / 2 ? this.elem.offsetWidth : 0;
    const fy = offset.y < this.elem.offsetHeight / 2 ? this.elem.offsetHeight : 0;
    // Calculate the distances from the event to the furthest point
    const dx = Math.abs(offset.x - fx);
    const dy = Math.abs(offset.y - fy);
    // Now we can calculate the required radius of the circle by using
    // pythagoras theorem - a^2 + b^2 = c^2 - in this context, a and b are
    // `dx` and `dy` and `c` is the radius value we need.
    return Math.ceil(Math.sqrt((dx * dx) + (dy * dy)));
  }

  /**
   * Gets a reference to a wave element from the 'active' object
   *
   * @param {String} key - The type of wave; 'click' or 'hover'
   * @returns {HTMLElement|undefined}
   * @private
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
   * @private
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
      case 'focus':
      case 'blur':
        type = SP_FOCUS;
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
   * @private
   */
  get isDisabled() {
    return this.elem.hasAttribute('disabled');
  }

  /**
   * Determines if this element's contents has already been wrapped
   *
   * @returns {Boolean}
   * @private
   */
  get isWrapped() {
    return !!first(this.elem, this.cfg.class.waves);
  }

  /**
   *
   */
  modify() {
    // Swap z-indexes
    this.elem.classList.toggle(this.cfg.class.swap, this.cfg.swap);
  }

  /**
   * Removes our event listeners from this Splash element
   *
   * @returns {undefined}
   * @private
   */
  removeListeners() {
    // Hover
    this.elem.removeEventListener('mouseenter', this.handler.start, false);
    this.elem.removeEventListener('mouseleave', this.handler.end, false);
    // Click
    this.elem.removeEventListener('mousedown', this.handler.start, false);
    document.removeEventListener('mouseup', this.handler.end, false);
  }

  /**
   * Resizes the given `wave` to an appropriate size, considering the `offset`
   * of the event relative to the element.
   *
   * @param {HTMLElement} wave - The wave to resize
   * @param {Object} offset - The offset of the event relative to the element
   * @param {Number} offset.x - Horizontal position of the event (circle center)
   * @param {Number} offset.y - Vertical position of the event (circle center)
   * @returns {undefined}
   * @private
   */
  resizeWave(wave, offset) {
    // Determine what size the wave should be
    const radius = this.getSize(offset);
    // Apply the size to the wave
    wave.style.width = `${2 * radius}px`;
    wave.style.height = `${2 * radius}px`;
  }

  /**
   * Saves a reference to a given wave to be accessed later
   *
   * @param {String} key - The type of wave; 'click' or 'hover'
   * @param {HTMLElement} wave - The wave to save
   * @returns {undefined}
   * @private
   */
  saveWave(key, wave) {
    this.active[key] = wave;
  }

  /**
   * Determines if execution should continue within the event listener callbacks
   *
   * @param {String} type - The type of wave; 'click' or 'hover'
   * @returns {Boolean} - Whether to continue or not
   * @private
   */
  shouldContinue(type) {
    // Do not proceed if we were unable to discern a type
    if (!type) return false;
    // Do not proceed if the DOM element is disabled (attribute or class)
    if (this.isDisabled) return false;
    // Do not proceed if the configuration has (click|hover) disabled
    if (!this.cfg[type]) return false;
    // All is well
    return true;
  }

  /**
   * Callback function for the 'mouseenter' and 'mousedown' events. Creates the
   * wave element and starts the animations.
   *
   * @param {Event} e
   * @returns {undefined}
   * @private
   */
  startEffect(e) {
    e.stopPropagation();
    // Determine which wave this should be from the event type (click|hover)
    const type = SplashElement.getWaveType(e.type);
    // Check if we should proceed with the effect
    if (!this.shouldContinue(type)) return;
    // Determine the offset of the event relative to the element
    const offset = this.getOffset(e, type);
    // Create a new wave element inside our container
    const wave = this.createWave(type, this.cfg.class[`${type}Wave`]);
    // Apply the offset to the wave
    wave.style.left = `${offset.x}px`;
    wave.style.top = `${offset.y}px`;
    // Resize the wave so it fully covers the element
    this.resizeWave(wave, offset);
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
   * @private
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
    // Add/remove modifier classes if necessary
    this.modify();
  }

  /**
   * Wraps the element so that Splash functionality can be added.
   *
   * @returns {undefined}
   * @private
   */
  wrap() {
    // We should only proceed if the element is not already wrapped
    if (this.isWrapped) return;
    // Determine if we need to wrap the element alternatively,
    // e.g. for inputs that do not allow child elements.
    this.isVoid = SP_VOID.includes(this.elem.tagName.toLowerCase());
    // Wrap the element
    this[`wrap${this.isVoid ? 'Void' : 'Default'}`]();
  }

  /**
   * Wraps any regular element's contents so we can add the Splash effect.
   *
   * @returns {undefined}
   * @private
   */
  wrapDefault() {
    // Ensure the element has the base class
    this.elem.classList.add(this.cfg.class.base);
    // Add modifier classes if necessary
    this.modify();
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
    // Saves references to the various elements
    this.waves = waves;
    this.wrapper = wrapper;
  }

  /**
   * Wraps void element's inside the Splash wrappers so we can add effects.
   *
   * @returns {undefined}
   * @private
   */
  wrapVoid() {
    // Remove the base class from the void element
    this.elem.classList.remove(this.cfg.class.base);
    // Wrap the void element in the Splash wrapper class
    const wrapper = newElem('div', [this.cfg.class.wrap]);
    this.elem.parentNode.insertBefore(wrapper, this.elem);
    wrapper.appendChild(this.elem);
    // Create the waves container and insert it before the wrapper
    const waves = newElem('div', [this.cfg.class.waves]);
    wrapper.parentNode.insertBefore(waves, wrapper);
    // Wrap both the new elements in another new element with the base class
    const parent = newElem('div', [this.cfg.class.base]);
    waves.parentNode.insertBefore(parent, waves);
    parent.appendChild(waves);
    parent.appendChild(wrapper);
    // We need to change the elem reference we have as it is expecting the
    // element with the base class.
    this.elem = parent;
    // Add modifier classes if necessary
    this.modify();
    // Saves references to the various elements
    this.waves = waves;
    this.wrapper = wrapper;
  }

}
