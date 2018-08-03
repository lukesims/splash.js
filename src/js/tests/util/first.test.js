/* global beforeEach describe expect test */

const { first } = require('../../util');

const correctClass = 'correct';
const wrongClass = 'wrong';

// DOM elements used throughout the tests
let parent;
let correctChild1;
let correctChild2;
let wrongChild1;
let wrongChild2;

// Before each test, set up each of the DOM elements anew
beforeEach(() => {
  // Create a parent container
  parent = document.createElement('div');
  // Create two children with the correct class
  correctChild1 = document.createElement('div');
  correctChild2 = document.createElement('div');
  correctChild1.classList.add(correctClass);
  correctChild2.classList.add(correctClass);
  // Create two children with the wrong class
  wrongChild1 = document.createElement('div');
  wrongChild2 = document.createElement('div');
  wrongChild1.classList.add(wrongClass);
  wrongChild2.classList.add(wrongClass);
});

describe('returns {undefined}', () => {
  test('when `parent` has no children', () => {
    expect(first(parent, correctClass)).toBeUndefined();
  });
  test('when `parent` has no children with `className`', () => {
    parent.appendChild(wrongChild1);
    parent.appendChild(wrongChild2);
    expect(first(parent, correctClass)).toBeUndefined();
  });
});

describe('returns correct {HTMLElement}', () => {
  test('when `parent` has one child (total) which has `className`', () => {
    parent.appendChild(correctChild1);
    expect(first(parent, correctClass)).toEqual(correctChild1);
  });
  test('when `parent` has multiple children and one child with `className`', () => {
    // Test when matching element is first
    parent.appendChild(correctChild1);
    parent.appendChild(wrongChild1);
    parent.appendChild(wrongChild2);
    expect(first(parent, correctClass)).toEqual(correctChild1);
    // Test when matching element is in middle
    parent.insertBefore(correctChild1, wrongChild2);
    expect(first(parent, correctClass)).toEqual(correctChild1);
    // Test when matching element is last
    parent.appendChild(correctChild1);
    expect(first(parent, correctClass)).toEqual(correctChild1);
  });
  test('when `parent` has multiple children and multiple children with `className`', () => {
    // Test when wrong element is first
    parent.appendChild(wrongChild1);
    parent.appendChild(correctChild1);
    parent.appendChild(correctChild2);
    expect(first(parent, correctClass)).toEqual(correctChild1);
    // Test when wrong element is in middle
    parent.insertBefore(wrongChild1, correctChild2);
    expect(first(parent, correctClass)).toEqual(correctChild1);
    // Test when wrong element is last
    parent.appendChild(wrongChild1);
    expect(first(parent, correctClass)).toEqual(correctChild1);
  });
});

describe('detects correct `className`', () => {
  test('when it is the first of multiple classes of a matching element', () => {
    correctChild1.className = `${correctClass} wrong also-wrong`;
    parent.appendChild(correctChild1);
    expect(first(parent, correctClass)).toEqual(correctChild1);
  });
  test('when it is in the middle of multiple classes of a matching element', () => {
    correctChild1.className = `wrong ${correctClass} also-wrong`;
    parent.appendChild(correctChild1);
    expect(first(parent, correctClass)).toEqual(correctChild1);
  });
  test('when it is the last of multiple classes of a matching element', () => {
    correctChild1.className = `wrong also-wrong ${correctClass}`;
    parent.appendChild(correctChild1);
    expect(first(parent, correctClass)).toEqual(correctChild1);
  });
});
