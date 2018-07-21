function render() {
   var Mutable = require('./classes/mutable.js');
   var mutable = new Mutable();

   var fileArray = [];
   var base = 'QmaQSy8hzDRJRBrc37sAcX17AGTjwti9KTem4KvKXpL6YP'

   promisify('get', base).then((result) => {
      var keys = Object.keys(result);
      log(result);

      for (var x = 0; x < keys.length; x++) {
         var instance = result[keys[x]];
         var obj = {};

         // CHECK IF TARGET IS A FILE
         if (instance.content != undefined) {

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
}

// EXPORT MODULE
module.exports = render;