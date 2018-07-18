// Dependencies
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const fs = require('fs');
const path = require('path');
const filesize = require('filesize');
const notifier = require('node-notifier');
const postcss = require('postcss');
const sass = require('node-sass');

// Load npm package configuration
const pkg = require('../package.json');

// Our helper function
const announce = require('./announce.js');

// The output directory
const outputdir = pkg.output.css;

// The default options for this build script
const options = {
  input: null,   // Path to input file
  name: null,    // Name of output file
  prefix: false, // Whether to run styles through autoprefixer
  minify: false, // Whether to minify the styles
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
  announce.error('Error! No input file specified [ --input=path/to/file.scss ]');
  process.exit();
}

// Determine the filename/path
const filename = options.name === null ? `${pkg.name}.css` : options.name;
const filepath = path.join(outputdir, filename);

// Compile the styles
const { css } = sass.renderSync({ file: options.input });

// Set the default PostCSS plugins
const plugins = [
];

// Include autoprefixer in the plugin chain if necessary
if (options.prefix) {
  plugins.push(autoprefixer);
}

// Include cssnano in the plugin chain if necessary
if (options.minify) {
  plugins.push(cssnano({ preset: 'default' }));
}

// Run the styles through PostCSS
postcss(plugins)
  .process(css, {
    from: options.input,
    to: filepath,
    map: false,
  })
  .then((result) => {
    try {
      // Create the directory if it doesn't exist
      if (!fs.existsSync(outputdir)) {
        fs.mkdirSync(outputdir);
      }
      // Write file to disk
      fs.writeFile(filepath, result.css, (err) => {
        if (err) throw err;
        // Find out how big the file is
        const fsize = filesize(fs.statSync(filepath).size);
        // Announce in console
        announce.success(`BUILT\t${filename}\t(${fsize})`);
        // Announce via desktop notifications
        notifier.notify({
          title: 'Splash.js',
          message: 'SCSS build complete.',
          wait: false,
        });
      });
    } catch (e) {
      announce.error(e);
      // Announce via desktop notifications
      notifier.notify({
        title: 'Splash.js',
        message: 'SCSS build ERROR!',
        wait: false,
      });
      // Kill the script
      process.exit();
    }
  });
