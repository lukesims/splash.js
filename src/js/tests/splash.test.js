/* global beforeEach describe expect test */

import Splash from '../splash';
import config from '../config';

// DOM elements used throughout the tests
let div1;
let div2;
let span1;
let span2;
let link1;
let link2;
let button1;
let button2;

// For each test, create some test elements to play around with
// Some to be initialised by the library, some not
beforeEach(() => {
  // Reset the body
  document.body.innerHTML = '';
  // Create the elements, two of each
  div1 = document.createElement('div');
  div2 = document.createElement('div');
  span1 = document.createElement('span');
  span2 = document.createElement('span');
  link1 = document.createElement('a');
  link2 = document.createElement('a');
  button1 = document.createElement('button');
  button2 = document.createElement('button');
  // Give the 1's the library's identifying class
  div1.classList.add(config.class.base);
  span1.classList.add(config.class.base);
  link1.classList.add(config.class.base);
  button1.classList.add(config.class.base);
  // Add them into the DOM
  document.body.appendChild(div1);
  document.body.appendChild(div2);
  document.body.appendChild(span1);
  document.body.appendChild(span2);
  document.body.appendChild(link1);
  document.body.appendChild(link2);
  document.body.appendChild(button1);
  document.body.appendChild(button2);
});

// Test class instantiation
describe('new Splash()', () => {
  // The active state is an array holding currently affected elements
  test('creates an empty state', () => {
    const splash = new Splash();
    expect(splash.active).toEqual([]);
  });
  // When the second parameter is ommitted, check the default config is used
  test('uses default config when none is provided', () => {
    const splash = new Splash();
    expect(splash.cfg).toEqual(config);
  });
  // Check any config values passed as the second parameter override the defaults
  test('overrides default config with provided config values', () => {
    // Swap the boolean configuration values so we know they're different
    const click = !config.click;
    const hover = !config.hover;
    const splash = new Splash({ click, hover });
    expect(splash.cfg.click).toBe(click);
    expect(splash.cfg.hover).toBe(hover);
    expect(splash.cfg.click).not.toBe(config.click);
    expect(splash.cfg.hover).not.toBe(config.hover);
  });
});

// Test initialization of functionality on elements with base class
describe('Splash.init()', () => {
  // When initializing, should reset the state first.
  test('resets the state', () => {
    const splash = new Splash();
    const randomval = new Date();
    splash.active = [randomval];
    splash.init();
    for (let i = 0; i < splash.active.length; i += 1) {
      expect(splash.active[i]).not.toBe(randomval);
    }
  });
  // The functionality should only be attached to elements that have opted in
  // with the base class specified in the config.
  test('only affects elements with base class', () => {
    const splash = new Splash();
    splash.init();
    // We created 8 elements in `beforeEach` above, 4 of which have the base
    // class - so only 4 elements should be held in the state
    expect(splash.active.length).toBe(4);
    // Check that all elements in the state have the base class
    for (let i = 0; i < splash.active.length; i += 1) {
      const hasClass = splash.active[i].elem.classList.contains(config.class.base);
      expect(hasClass).toEqual(true);
    }
  });
});

// Test attaching of functionality to elements without base class
describe('Splash.attach()', () => {
  //
  describe('attaches functionality to selection', () => {
    //
    test('when a string is given', () => {
      const splash = new Splash();
      splash.attach('button');
      expect(splash.active.length).toBe(2);
      expect(splash.active[0].elem).toEqual(button1);
      expect(splash.active[1].elem).toEqual(button2);
    });
    //
    test('when a list is given', () => {
      const splash = new Splash();
      let selection = document.querySelectorAll('button');
      splash.attach(selection);
      expect(splash.active.length).toBe(2);
      expect(splash.active[0].elem).toEqual(button1);
      expect(splash.active[1].elem).toEqual(button2);
      //
      selection = [
        document.querySelectorAll('span')[0],
        document.querySelectorAll('span')[1],
      ];
      splash.attach(selection);
      expect(splash.active.length).toBe(4);
      expect(splash.active[2].elem).toEqual(span1);
      expect(splash.active[3].elem).toEqual(span2);
    });
  });
});

// Test attaching of functionality to elements without base class
// describe('Splash.destroy()', () => {
// });
