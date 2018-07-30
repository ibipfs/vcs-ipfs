var Mutable = require('./mutable.js');
var mutable = new Mutable();
var moment = require('moment');

class Activities {

   // FETCH IPFS CONTENT 
   init() {
      var p = mutable.read('log.json').then((content) => {
         return content;
      });

      return p;
   }

   // RENDER BODY
   body(filter = '') {
      require('../config.js')().then((config) => {

         this.init().then((content) => {
            mutable.read('history.json').then((history) => {

               // PARSE HISTORY & FETCH HASH OF PROJ ROOT
               history = JSON.parse(history);
               var base = history.current.hash;

               // PARSE LOG
               var logz = JSON.parse(content);

               // FETCH & REVERSE KEYS
               var keys = Object.keys(logz);
               keys.reverse();

               // HELP ARRS
               var rows = '';
               var row = '';
               var table = '';

               var type = '';
               var timestamp = 0;
               var user = '';
               var original = '';
               var path = '';
               var realPath = '';
               var hash = '';

               var string = '';

               // MAKE ROW FOR EACH ENTRY
               for (var x = 0; x < keys.length; x++) {

                  // FETCH VALUES
                  type = logz[keys[x]].type;
                  timestamp = moment.unix(keys[x]).format('D/MM @ HH:mm');
                  user = logz[keys[x]].user;
                  original = logz[keys[x]].original;

                  // SHORTHAND PATH
                  path = logz[keys[x]].path;

                  // REAL PATH
                  realPath = path.split('/');
                  realPath[0] = base;
                  realPath = realPath.join('/');

                  // FILE HASH
                  hash = logz[keys[x]].hash;

                  // FILENAME FOR FILTER QUERY
                  var suffix = path.split('/').pop();

                  // CONTINUE IF A REQUIREMENT IS FILLED
                  if (filter == '' || filter.toLowerCase() == user.toLowerCase() || filter == original || filter == path || filter.toLowerCase() == suffix) {

                     // GENERATE ENTRY STRING
                     switch (type) {
                        
                        // PUBLISH
                        case 'publish':
                           string = capitalize(user) + ' published an entry of <a id="compare" old="' + original + '" new="' + hash + '" author="' + user + '" path="' + realPath + '" time="' + timestamp + '">' + path + '</a>';
                        break;
                     }

                     // GENERATE ROW
                     row = `
                        <tr><td><div>
                           <table><tbody><tr>
                              <td>` + string + `</td>
                              <td>` + timestamp + `</td>
                           </tr></tbody></table>
                        </div></td></tr>
                     `;

                     // CONCAT TO ROWS
                     rows += row;
                  }
               }

               // FALLBACK IF NO ROWS ARE FOUND
               if (rows == '') {
                  rows = '<tr><td><div>No entries found.</div></td></tr>';
               }

               // GENERATE FULL TABLE
               table = '<table><tbody>' + rows + '</tbody></table>';
               var cont = $('#activity').html();

               // COMPARE OLD AND NEW SELECTOR CONTENT
               if (table == cont) {

                  // RENDER TO SELECTOR
                  $('#activity').html(table);

               // WHEN CONTENT HAS CHANGED
               } else {

                  // FADE IN
                  fadeIn('activity', table);
               }

            });
         });
      });
   }
}

// EXPORT CLASS
module.exports = Activities;