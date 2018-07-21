function render() {
   var Mutable = require('./classes/mutable.js');
   var mutable = new Mutable();

   // REMOVE RELEASE DIR
   mutable.rm('temp/release').then(() => {
      log('Removed release dir!');

   // MAKE NEW DIRECTORY
   mutable.mkdir('temp/release').then(() => {
      log('Created release dir!');

      // WRITE FIRST FILE
      mutable.write('temp/release/first.js', 'first file').then(() => {
         log('Created first file!');

         // WRITE SECOND FILE
         mutable.write('temp/release/second.js', 'second file').then(() => {
            log('Created second file!');
   
            // LIST OUT TEMP DIRECTORY
            mutable.ls('temp/release').then((stuff) => {
               log(stuff);

               var fileArray = [
                  {
                     path: '/release/first.js',
                     content: 'first'
                  },
                  {
                     path: '/release/second.js',
                     content: 'second'
                  }
               ];

               // UPLOAD FILES
               mutable.release(fileArray).then((answer) => {
                  var parentHash = answer[answer.length - 1].hash

                  promisify('dir', parentHash).then((r) => {
                     log(r);
                  })

               });
            });
         });
      });
   });
   });
}

// EXPORT MODULE
module.exports = render;