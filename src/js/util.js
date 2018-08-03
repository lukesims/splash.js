/**
 * Finds the first immediate child with the class `className` of the `parent`.
 *
 * @param {HTMLElement} parent - The DOM element to search
 * @param {String} className - The class name to search for
 * @returns {undefined|HTMLElement}
 */
export function first(parent, className) {
  let found;
  if (!parent || !parent.children) return found;
  for (let i = 0; i < parent.children.length; i += 1) {
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
export function getOffset(element) {
  const bodyRect = document.body.getBoundingClientRect();
  const elemRect = element.getBoundingClientRect();
  return {
    x: elemRect.left - bodyRect.left,
    y: elemRect.top - bodyRect.top,
  };
}

/**
 *
 */
export function newElem(selector, classes = []) {
  const element = document.createElement(selector);
  element.classList.add(...classes);
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
export function isElem(o) {
  return typeof HTMLElement === 'object'
    ? o instanceof HTMLElement
    : !!o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string';
}

/**
 * Determines if the given value is a 'list' of elements (Array, HTMLCollection,
 * NodeList or Object).
 *
 * @param {*} o - The variable being tested
 * @returns {Boolean} Whether `o` is one of: Array|HTMLCollection|NodeList|Object
 */
export function isList(o) {
  const str = Object.prototype.toString.call(o);
  return !!o
    && typeof o === 'object'
    && !!(o.length || Object.keys(o).length)
    && /^\[object (Array|HTMLCollection|NodeList|Object)\]$/.test(str);
}

/**
 * Determines if touch is enabled on the current device
 *
 * @returns {Boolean}
 */
export function isTouch() {
  return 'ontouchstart' in window;
}
