var Buffer = require('buffer/').Buffer
var Mutable = require('./mutable.js');

class Actions {

   constructor() {
      this.mutable = new Mutable();
   }

   release(significance) {
      var mutable = this.mutable;
      significance = significance.toLowerCase();
   
      // READ FROM HISTORY LOG
      mutable.read('history.json').then((history) => {

         // PARSE STRING TO OBJ
         history = JSON.parse(history);

         // FETCH CONTENT OF CURRENT VERSION
         promisify('get', history.current.hash).then((content) => {
            
            // ASSIST VARS
            var files = [];
            var obj = {};

            // LOOP THROUGH EACH ENTRY
            content.forEach(entry => {

               // IF ENTRY IS A FILE
               if (entry.content != undefined) {
                  log('File found!');

                  // GENERATE OBJECT FOR ENTRY
                  obj = {
                     path: entry.path,
                     content: Buffer.from('asdaasd')
                  }

                  // SAVE OBJECT INTO ARRAY
                  files.push(obj);
               }
            });

            // ADD CONSTRUCTED DIR TO IPFS
            mutable.release(files).then((response) => {

               // FETCH ROOT DIR HASH
               var root = response[response.length - 1].hash;

               // ASSESS NEW NAME
               var old_name = parseFloat(history.current.name);
               var new_name = '';

               switch(significance) {

                  // MEDIUM
                  case 'medium':
                     new_name = old_name + 0.1;
                     new_name = new_name.toFixed(1);
                  break;

                  // LARGE
                  case 'large':
                     if (old_name % 1 != 0) { 
                        new_name = Math.ceil(old_name);
                     } else {
                        new_name = old_name + 1;
                        new_name = new_name.toFixed(1);
                     }
                  break;

                  // SMALL & FALLBACK
                  default:
                     new_name = old_name + 0.01;
                     new_name = new_name.toFixed(2);
                  break;
               }

               // CONVERT TO STRING
               new_name = new_name.toString();

               // MODIFY HISTORY LOG
               history.old[history.current.name] = history.current;
               history.current = {
                  name: new_name,
                  hash: root,
                  timestamp: unixTime()
               }

               // STRINGIFY
               history = JSON.stringify(history);

               // ADD CHANGES TO HISTORY LOG
               mutable.write('history.json', history).then(() => {
                  log('Rewrote history!');

               });
            });
         });
      });
   }

}

// EXPORT CLASS
module.exports = Actions;