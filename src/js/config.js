// The default configuration for the library.
//   Separated into another file so it can be pulled into tests.
export default {
  // Whether the click effect is enabled
  click: true,
  // Whether the focus effect is enabled
  focus: false,
  // Whether the hover effect is enabled
  hover: false,
  // Whether to swap the z-index of the waves and content
  // When false, the waves are _above_ the element's content
  swap: false,
  // Whether click waves should wait for the `mouseup` event to fade out.
  // When false, wave fades out after fully covering the splash element.
  waitForMouseup: false,
  // html/css class names employed by the library
  class: {
    // For the base splash element
    base: 'splash',
    swap: 'splash-swap',
    // Wave and content wrappers
    waves: 'splash-waves',
    wrap: 'splash-wrap',
    // For the wave elements
    clickWave: 'splash-click',
    clickOut: 'splash-click-out',
    focusWave: 'splash-focus',
    focusOut: 'splash-focus-out',
    hide: 'splash-hide',
    hoverWave: 'splash-hover',
    hoverOut: 'splash-hover-out',
  },
};
