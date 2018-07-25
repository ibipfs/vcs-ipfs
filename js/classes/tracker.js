var Mutable = require('./mutable.js');
var mutable = new Mutable();

var moment = require('moment');

class Tracker {

   // FETCH IPFS CONTENT 
   init() {
      var p = mutable.read('tracker.json').then((content) => {
         return content;
      });

      return p;
   }

   // RENDER BODY
   body(filter = '') {
      this.init().then((content) => {
         
         mutable.read('history.json').then((history) => {
            history = JSON.parse(history);
            var base = history.current.hash;

            // PARSE OBJECT & FETCH KEYS
            content = JSON.parse(content);
            var keys = Object.keys(content);

            // REVERSE TO GET NEWEST FIRST
            keys.reverse();

            // HELP VARS
            var fileName = '';
            var fileData = {};
            var filePath = '';
            var subKeys = [];
            var blobHolder = '';

            // LOOP THROUGH FILES WITH SUBMISSIONS
            for (var x = 0; x < keys.length; x++) {
               fileName = keys[x];
               fileData = content[fileName];
               filePath = fileData.path;
               subKeys = Object.keys(fileData);
               
               // SLICE ONLY FILE FROM PATH
               var suffix = filePath.split('/').pop();

               // CONTINUE IF A REQUIREMENT IS FILLED
               if (filter == '' || filter == fileName || filter.toLowerCase() == suffix || filter == headerify(filePath)) {

                  // REVERSE TO GET NEWEST FIRST
                  subKeys.reverse();

                  // HELP VARS
                  var user = '';
                  var hash = '';
                  var timestamp = 0;

                  // STRUCTURE VARS
                  var wrap = '';
                  var table = '';
                  var header = '';
                  var rows = '';
                  var row = '';

                  // GENERATE HEADER
                  header = `
                     <tr><td><div id="header">` + headerify(filePath) + `</div></td></tr>
                  `;

                  // CONCAT TO PARENT
                  rows += header;

                  // LOOP THROUGH SUBMISSIONS
                  for (var y = 0; y < subKeys.length; y++) {
                     user = subKeys[y];

                     // FILTER OUT PATH PROPERTY
                     if (user != 'path') {
                        hash = fileData[user].hash;

                        // FORMAT TIMESTAMP
                        timestamp = fileData[user].timestamp;
                        timestamp = moment.unix(timestamp).format('D/MM @ HH:mm');

                        // GENERATE ROW
                        row = `
                           <tr><td>
                              <div id="gray" class="selected">
                                 <table><tbody><tr>
                                    <td>Author:</td>
                                    <td>` + capitalize(user) + `</td>
                                 </tr></tbody></table>
                                 <hr>
                                 <table><tbody><tr>
                                    <td>Hash Location:</td>
                                    <td><a id="compare" old="` + fileName + `" new="` + hash + `" author="` + user + `" path="` + filePath + `" time="` + timestamp + `">` + hash + `</a></td>
                                 </tr></tbody></table>
                                 <hr>
                                 <table><tbody><tr>
                                    <td>Submitted:</td>
                                    <td>` + timestamp + `</td>
                                 </tr></tbody></table>
                              </div>
                           </td></tr>
                        `;

                        // CONCAT ROW TO PARENT
                        rows += row;
                     }
                  }

                  // GENERATE ENTIRE STRUCTURE
                  table = '<table><tbody>' + rows + '</tbody></table>';
                  wrap = '<div id="tracker-outer"><div id="tracker-inner">' + table + '</div></div>';

                  blobHolder += wrap;
               }
            }

            // ADD ERROR MSG IF NOTHING IF FOUND
            if (blobHolder == '') {
               blobHolder = '<div id="tracker-outer"><div id="tracker-inner"><table><tbody><tr><td><div id="header">No entries found.</div></td></tr></tbody></table></div></div>';
            }

            // PARENT CONTENT
            var cont = $('#container').html();

            // CHECK IF CONTENT IS SAME AS BEFORE QUERY - TO STOP FLICKERING
            if (blobHolder == cont) {

               // RENDER TO SELECTOR
               $('#container').html(cont);

            // OTHERWISE CHANGE CONTENT & TRANSITION
            } else {

               // FADE IN
               fadeIn('container', blobHolder);
            }
         });
      });
   }
}

// EXPORT CLASS
module.exports = Tracker;