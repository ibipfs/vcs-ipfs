class Sections {

   // FETCH CONFIG & HELPER MODULES
   constructor() {
      this.config = require('../config.js')();
      this.moment = require('moment');
   }

   // ACTIVITIES
   activities (filter = '') {
      this.config.then((config) => {
         
         // FETCH KEYS & REVERSE ORDER
         var keys = Object.keys(config.log);
         keys.reverse();

         // ALL ENTRY ROWS
         var rows = '';

         // GENERATE ROW FOR EACH ENTRY
         keys.forEach((entry) => {
            var instance = config.log[entry];
            var filename = instance.path.split('/').pop();
            var timestamp = this.moment.unix(entry).format('D/MM @ HH:mm');;

            // CHANGE FIRST KEY IN PATH TO ROOT DIR
            instance.path = instance.path.split('/');
            instance.path[0] = config.history.current.hash;
            instance.path = instance.path.join('/');

            // CHECK FILTER
            if (filter == '' || filter.toLowerCase() == instance.user.toLowerCase() || filter == instance.original || filter == instance.path || filter.toLowerCase() == filename.toLowerCase()) {
               
               // ENTRY STRING
               var string = '';

               // GENERATE STRING BASED ON ENTRY TYPE
               switch (instance.type) {

                  // PUBLISH
                  case 'publish':
                     string = capitalize(instance.user) + ' published an entry of <a id="compare" old="' + instance.original + '" new="' + instance.hash + '" author="' + instance.user + '" path="' + instance.path + '" time="' + timestamp + '">' + headerify(instance.path, true) + '</a>';
                  break;

                  // FALLBACK
                  default:
                     string = 'Instance type not found.';
                  break;

               }

               // GENERATE ROW
               var row = `
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
         });

         // IF LOG IS EMPTY OR FILTER RETURNS NOTHING
         if (rows == '') {
            rows = '<tr><td><div>No entries found.</div></td></tr>';
         }

         // GENERATE TABLE & STITCH ROWS IN
         var table = '<table><tbody>' + rows + '</tbody></table>';

         // FETCH SELECTOR CONTENT BEFORE RE-RENDER
         var previous = $('#activity').html();

         // IF OLD AND NEW SELECTOR CONTENT ARE THE SAME, DO NOTHING --- DO THIS TO STOP UNECESSARY FLICKERING
         if (table == previous) {

            $('#activity').html(table);

         // OTHERWISE FADE IN NEW CONTENT
         } else {
            
            fadeIn('activity', table);
         }

      });
   }

   // TRACKER
   tracker (filter = '') {
      this.config.then((config) => {

         // FETCH KEYS & REVERSE ORDER
         var keys = Object.keys(config.tracker);
         keys.reverse();

         // ALL ENTRY BLOCKS
         var blocks = '';

         // GENERATE BLOCK FOR EACH FILE
         keys.forEach((entry) => {
            var instance = config.tracker[entry];
            var filename = instance.path.split('/').pop();
            var block_name = entry;

            // CHECK FILTER
            if (filter == '' || filter == block_name || filter.toLowerCase() == filename || filter == headerify(instance.path)) {

               // KEYS OF SUBMISSIONS FOR INSTANCE
               var sub_keys = Object.keys(instance);
               sub_keys.reverse();

               // ENTRY BLOCK
               var block = '';

               // GENERATE HEADER
               var header = `
                  <tr><td><div id="header">` + headerify(instance.path) + `</div></td></tr>
               `;

               // CONCAT TO BLOCK
               block += header;

               // GENERATE ROW FOR EACH ENTRY
               sub_keys.forEach((sub_entry) => {

                  // SKIP IF SUBKEY IS PATH
                  if (sub_entry != 'path') {
                     var sub_instance = instance[sub_entry];

                     // GENERATE ROW
                     var row = `
                        <tr><td>
                           <div id="gray" class="selected">
                              <table><tbody><tr>
                                 <td>Author:</td>
                                 <td>` + capitalize(sub_entry) + `</td>
                              </tr></tbody></table>

                              <hr>

                              <table><tbody><tr>
                                 <td>Compare:</td>
                                 <td><a id="compare" old="` + entry + `" new="` + sub_instance.hash + `" author="` + sub_entry + `" path="` + instance.path + `" time="` + sub_instance.timestamp + `">` + sub_instance.hash + `</a></td>
                              </tr></tbody></table>

                              <hr>

                              <table><tbody><tr>
                                 <td>Submitted:</td>
                                 <td>` + this.moment.unix(sub_instance.timestamp).format('D/MM @ HH:mm') + `</td>
                              </tr></tbody></table>
                           </div>
                        </td></tr>
                     `;

                     // CONCAT ROW TO BLOCK
                     block += row;
                  }

               });

               // GENERATE FULL BLOCK
               var table = '<table><tbody>' + block + '</tbody></table>';
               var wrap = '<div id="tracker-outer"><div id="tracker-inner">' + table + '</div></div>';

               // CONCAT TO BLOCKS
               blocks += wrap;
            }

         });

         // FALLBACK IF TRACKER IS EMPTY OR FILTER FINDS NOTHING
         if (blocks == '') {
            blocks = '<div id="tracker-outer"><div id="tracker-inner"><table><tbody><tr><td><div id="header">No entries found.</div></td></tr></tbody></table></div></div>';
         }

         // FETCH SELECTOR CONTENT BEFORE RE-RENDER
         var previous = $('#container').html();

         // IF OLD AND NEW SELECTOR CONTENT ARE THE SAME, DO NOTHING --- DO THIS TO STOP UNECESSARY FLICKERING
         if (blocks == previous) {

            $('#container').html(previous);

         // OTHERWISE FADE IN NEW CONTENT
         } else {

            fadeIn('container', blocks);
         }
      });
   }
}

// EXPORT CLASS
module.exports = Sections;