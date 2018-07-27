var Mutable = require('./classes/mutable.js');
var mutable = new Mutable();

function build() {
   var config = {};

   mutable.read('tracker.json').then((tracker) => {
      tracker = JSON.parse(tracker);
      config.tracker = tracker;

      return config;
   });
}

// EXPORT CLASS
module.exports = build;