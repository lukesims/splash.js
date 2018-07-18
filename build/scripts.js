// Dependencies
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const filesize = require('filesize');
const notifier = require('node-notifier');
const fs = require('fs');
const path = require('path');

// Load npm package configuration
const pkg = require('../package.json');

// Our helper function
const announce = require('./announce.js');

// The output directory
const outputdir = pkg.output.js;

// The default options for this build script
const options = {
  input: null,       // Path to input file
  name: null,        // Name of output file
  sourcemaps: false, // Whether to include sourcemaps
  uglify: false,     // Whether to uglify the JS
};

// Process any arguments
process.argv.forEach((val, index) => {
  // Skip first two arguments (node path and this file's path)
  if (index < 2) return;
  // Remove '--' from arguments and split by '='
  const opt = val.substr(2).split('=');
  // Only proceed if an option with that name exists
  if (Object.prototype.hasOwnProperty.call(options, opt[0])) {
    // If there is a '=' in the string its a string assignment, not boolean
    options[opt[0]] = opt.length > 1 ? opt[1] : true;
  }
});

// Only proceed if we have an input file
if (options.input === null) {
  announce.error('Error! No input file specified [ --input=path/to/file.js ]');
  process.exit();
}

// The default/shared output configuration
const output = {
  name: 'Splash',
  format: 'umd',
  sourcemap: options.sourcemaps,
};

// The default/shared plugin configuration
const plugins = [
  // Transpiles our JS
  babel({
    exclude: ['node_modules/**'],
  }),
];

// Include Uglify in the plugin chain if necessary
if (options.uglify) {
  plugins.push(uglify.uglify());
}

// Determine the filename/path
const filename = options.name === null ? `${pkg.name}.js` : options.name;
const filepath = path.join(outputdir, filename);

// Roll it up
rollup
  .rollup({ input: options.input, plugins })
  .then(async (bundle) => {
    // Write file to disk
    await bundle.write({ ...output, file: filepath });
  })
  .then(() => {
    // Find out how big the file is
    const fsize = filesize(fs.statSync(filepath).size);
    // Announce in console
    announce.success(`BUILT\t${filename}\t(${fsize})`);
    // Announce via desktop notifications
    notifier.notify({
      title: 'Splash.js',
      message: 'JavaScript build complete.',
      wait: false,
    });
  });
