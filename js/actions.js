function render() {

   // FETCH MUTABLE MODULE
   var Mutable = require('./classes/mutable.js');
   var mutable = new Mutable();

   var fileArray = [];

   // READ FROM HISTORY LOG
   mutable.read('history.json').then((history) => {
      
      // PARSE HISTORY
      history = JSON.parse(history);

      // FETCH HASH OF LATEST RELEASE
      var base = history.current.hash

      // READ FROM TRACKER LOG
      mutable.read('tracker.json').then((tracker) => {

         // PARSE TRACKER
         tracker = JSON.parse(tracker);

         // TRACKER KEYS
         var keys = Object.keys(tracker);
         var toChange = [];

         // MAKE ARRAY OF FILES THAT NEED TO BE EDITED
         for (var y = 0; y < keys.length; y++) {

            // CHANGE ELEM1 FROM ROOT TO ACTUAL BASE
            var data = tracker[keys[y]].path;
            data = data.split('/');
            data[0] = base;
            data = data.join('/');

            toChange.push(data);
         }

         promisify('get', base).then((result) => {

            var keys = Object.keys(result);

            for (var x = 0; x < keys.length; x++) {
               var instance = result[keys[x]];
               var obj = {};

               // CHECK IF TARGET IS A FILE
               if (instance.content != undefined) {

                  // CHECK IF FILE IS IN ARRAY
                  var check = $.inArray(instance.path, toChange);

                  // IF IT EXISTS
                  if (check != -1) {
                     log(instance.path + ' needs to change!');
                  }

                  // BUILD OBJECT
                  obj = {
                     path: instance.path,
                     content: instance.content
                  }

                  // PUSH OBJECT INTO GATHERING ARRAY
                  fileArray.push(obj);
               }
            }

            // PUBLISH TO IPFS
            mutable.release(fileArray).then((response) => {
               
               // FETCH HASH OF ROOT DIR
               var hash = response[response.length - 1].hash;
               log(hash);
            });
         });
      });

   });
}

// EXPORT MODULE
module.exports = render;