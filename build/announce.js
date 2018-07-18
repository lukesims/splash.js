// Prefix for outputting colors in the terminal
const prefix = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
};

// Helper functions
const announce = {
  success: (val) => {
    // eslint-disable-next-line no-console
    console.log(`\t${prefix.green}${val}\n${prefix.reset}`);
  },
  error: (val) => {
    // eslint-disable-next-line no-console
    console.log(`\t${prefix.red}${val}\n${prefix.reset}`);
  },
};

module.exports = announce;
