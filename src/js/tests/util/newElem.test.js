/* global expect test */

const { newElem } = require('../../util');

test('creates a new DOM element', () => {
  expect(newElem('div')).toBeInstanceOf(Element);
  expect(newElem('div')).toBeInstanceOf(HTMLElement);
});

test('applies provided class names to new elements', () => {
  const div1 = newElem('div', ['class-one']);
  const div2 = newElem('div', ['class-one', 'class-two']);
  const div3 = newElem('div', ['class-one', 'class-two', 'class-three']);
  expect(div1.classList.contains('class-one')).toBe(true);
  expect(div1.classList.contains('class-two')).toBe(false);
  expect(div1.classList.contains('class-three')).toBe(false);
  expect(div2.classList.contains('class-one')).toBe(true);
  expect(div2.classList.contains('class-two')).toBe(true);
  expect(div2.classList.contains('class-three')).toBe(false);
  expect(div3.classList.contains('class-one')).toBe(true);
  expect(div3.classList.contains('class-two')).toBe(true);
  expect(div3.classList.contains('class-three')).toBe(true);
});
