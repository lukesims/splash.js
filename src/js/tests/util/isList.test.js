/* global expect test */

const { isList } = require('../../util');

test('detects when `o` is of type {Array|HTMLCollection|NodeList|Object} and not empty', () => {
  // Create DOM elements to test with
  const emptydiv = document.createElement('div');
  const textdiv = document.createElement('div');
  textdiv.innerHTML = 'a text node'; // Text
  const div = document.createElement('div');
  div.appendChild(document.createElement('div'));
  div.appendChild(document.createElement('div'));
  div.appendChild(document.createElement('div'));
  const comment = document.createComment('a comment node'); // Comment
  // Objects expected to be true
  expect(isList(div.children)).toBe(true); // HTMLCollection
  expect(isList(div.childNodes)).toBe(true); // NodeList
  expect(isList(['not', 'empty'])).toBe(true); // Array
  expect(isList({ not: 'empty' })).toBe(true); // Object
  // Similar objects expected to be false
  expect(isList(comment)).toBe(false); // Comment
  expect(isList(div)).toBe(false); // (HTML)Element
  expect(isList(emptydiv)).toBe(false); // (HTML)Element
  expect(isList(emptydiv.children)).toBe(false); // Empty HTMLCollection
  expect(isList(emptydiv.childNodes)).toBe(false); // Empty NodeList
  expect(isList(document)).toBe(false); // Document
  expect(isList(window)).toBe(false); // Window/AbstractView
  expect(isList([])).toBe(false); // Empty Array
  expect(isList({})).toBe(false); // Empty Object
  // All other types expected to be false
  expect(isList('string')).toBe(false);
  expect(isList(true)).toBe(false);
  expect(isList(1984)).toBe(false);
  expect(isList(null)).toBe(false);
  expect(isList()).toBe(false);
});
