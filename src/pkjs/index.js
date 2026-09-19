// Import the Clay package
var Clay = require('@rebble/clay');
// Load Clay config file
var clayConfig = require('./config.js');
// modifications.js shows/hides the random-layout toggles based on the
// "Randomise" master toggle -- see that file for details.
var modifications = require('./modifications.js');
// Initialize Clay
var clay = new Clay(clayConfig, modifications);