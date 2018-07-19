var Mutable = require('./mutable.js')
var moment = require('moment');

class Activities {

   // FETCH IPFS CONTENT 
   init() {
      var mutable = new Mutable();
      
      var p = mutable.read('log.json').then((content) => {
         return content;
      });

      return p;
   }

   // RENDER BODY
   body(filter = '') {
      this.init().then((content) => {

         // PARSE LOG
         var logz = JSON.parse(content);

         // FETCH & REVERSE KEYS
         var keys = Object.keys(logz);
         keys.reverse();

         // HELP ARRS
         var rows = '';
         var row = '';
         var string = '';
         var timestamp = 0;
         var table = '';
         var user = '';
         var original = '';

         // MAKE ROW FOR EACH ENTRY
         for (var x = 0; x < keys.length; x++) {

            // FETCH VALUES
            string = logz[keys[x]].string;
            timestamp = moment.unix(keys[x]).format('D/MM @ HH:mm');
            user = logz[keys[x]].user;
            original = logz[keys[x]].original;

            // IF FILTER IF UNDEFINED
            if (filter == '') {

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

            } else {

               // IF FILTER QUERY EQUALS ROW AUTHOR
               if (filter.toLowerCase() == user.toLowerCase() || filter == original) {

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

            // TURN OPACITY OFF
            $('#activity').css('opacity', '0');

            sleep(180).then(() => {

               // RENDER TO SELECTOR
               $('#activity').html(table);

               // TURN OPACITY UP
               $("#activity").css('opacity', '1');

            });  
         }
      });
   }
}

// EXPORT CLASS
module.exports = Activities;