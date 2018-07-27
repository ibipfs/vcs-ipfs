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

         // CURRENT ROOT DIR
         var base = history.current.hash;

         // FETCH CONTENT OF CURRENT VERSION
         promisify('get', history.current.hash).then((content) => {
            
            // READ TRACKER
            mutable.read('tracker.json').then((tracker) => {
               tracker = JSON.parse(tracker);

               var trackerKeys = Object.keys(tracker);
               var edited_names = [];
               var edited_content = [];

               // LOOP THROUGH OBJECT
               trackerKeys.forEach(entry => {

                  // FORMAT PATH
                  var path = tracker[entry].path;
                  path = path.split('/');
                  path[0] = base;
                  path = path.join('/');
                  
                  // PUSH INTO EDITED ARRAY
                  edited_names.push(path.toLowerCase());                      // FORCE LOWERCASE
                  edited_content.push(tracker[entry]['wickstjo'].hash);
               });

               // CONTENT PROMISES
               var content_promises = [];

               // CREATE PROMISE FOR FILE
               edited_content.forEach(entry => {
                  
                  // GENERATE PROMISE
                  var promise = promisify('file', entry);

                  // PUSH INTO ARRAY
                  content_promises.push(promise);
               });

               // WAIT FOR ALL PROMISES TO BE RESOLVED
               Promise.all(content_promises).then((edited_values) => {
                  log(edited_values);

                  // ASSIST VARS
                  var files = [];
                  var obj = {};

                  // LOOP THROUGH EACH ENTRY
                  content.forEach(entry => {

                     // IF ENTRY IS A FILE
                     if (entry.content != undefined) {
                        
                        // CHECK IF MATCH IS FOUND
                        var indexCheck = $.inArray(entry.path.toLowerCase(), edited_names);
                        var content = '';

                        // MATCH FOUND
                        if (indexCheck != -1) {
                           log(entry.path + ' needs to be edited!');

                           // FIX CASE SENSITIVE ISSUES
                           if (entry.path != edited_names[indexCheck]) {
                              edited_names[indexCheck] = entry.pathM
                           }

                           // REWRITE FILE
                           content = edited_values[indexCheck];

                        // FALLBACK
                        } else {

                           // KEEP OLD CONTENT
                           content = entry.content;
                        }

                        // GENERATE OBJECT FOR ENTRY
                        obj = {
                           path: entry.path,
                           content: Buffer.from(content)
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
         });
      });
   }

}

// EXPORT CLASS
module.exports = Actions;