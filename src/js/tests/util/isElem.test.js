/* global expect test */

const { isElem } = require('../../util');

test('detects when `o` is of type {HTMLElement}', () => {
  // Create some Nodes of varying types to test with
  const div = document.createElement('div'); // (HTML)Element
  div.innerHTML = 'a text node'; // Text
  const comment = document.createComment('a comment node'); // Comment
  // Only DOM elements should be true
  expect(isElem(div)).toBe(true); // (HTML)Element
  // Other node types do not count
  expect(isElem(div.children)).toBe(false); // HTMLCollection
  expect(isElem(div.childNodes)).toBe(false); // NodeList
  expect(isElem(div.childNodes[0])).toBe(false); // Text
  expect(isElem(comment)).toBe(false); // Comment
  expect(isElem(document)).toBe(false); // Document
  expect(isElem(window)).toBe(false); // Window/AbstractView
  // All other types expected to be false
  expect(isElem([])).toBe(false);
  expect(isElem({})).toBe(false);
  expect(isElem('string')).toBe(false);
  expect(isElem(true)).toBe(false);
  expect(isElem(1984)).toBe(false);
  expect(isElem(null)).toBe(false);
  expect(isElem()).toBe(false);
});
