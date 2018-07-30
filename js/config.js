// FETCH & INSTANTIATE MUTABLE MODULE
var Mutable = require('./classes/mutable.js');
var mutable = new Mutable();

function build() {

   // GENERATE PROMISES
   var history = mutable.read('history.json');
   var tracker = mutable.read('tracker.json');
   var log = mutable.read('log.json');

   // WAIT FOR ALL PROMISES TO BE RESOLVED
   return Promise.all([history, tracker, log]).then((values) => {

      // PARSE LOGS
      history = JSON.parse(values[0]);
      tracker = JSON.parse(values[1]);
      log = JSON.parse(values[2]);

      // CREATE CONFIG OBJECT
      var config = {};

      // ADD LOGS TO CONFIG
      config.history = history;
      config.tracker = tracker;
      config.log = log;

      // RETURN CONFIG
      return config;
   });
}

// EXPORT FUNCTION
module.exports = build;