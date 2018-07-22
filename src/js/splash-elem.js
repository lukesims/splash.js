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
    this.elem.addEventListener('mouseenter', e => this.startHover(e), false);
    this.elem.addEventListener('mouseleave', e => this.endHover(e), false);
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
   *
   */
  getWave() {
    const ts = this.elem.getAttribute(this.cfg.attr);
    const wave = this.active[ts];
    delete this.active[ts];
    this.elem.removeAttribute(this.cfg.attr);
    return wave;
  }

  /**
   * Determines if this element is disabled
   */
  get isDisabled() {
    return hasClass(this.elem, this.cfg.class.disabled);
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
   *
   */
  save(wave) {
    const ts = Date.now();
    this.active[ts] = wave;
    this.elem.setAttribute(this.cfg.attr, ts);
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
   * Wraps this element's contents so we can add wave effects
   *
   * @returns {undefined}
   */
  wrap() {
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
