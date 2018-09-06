function render(config) {
   elements();
   content(config);
   events(config);
}

// ADD HTML CONTENT
function elements() {

   // GENERATE PARENT SELECTORS
   var filter = '<div id="filter-outer"><div id="filter-inner"><input type="text" id="filter" placeholder="Filter by File Name or File Hash" tabindex="1"></div></div>';
   var container = '<div id="container"></div>';

   // RENDER THEM IN
   $('#content-body').html(filter + container);
}

// ADD GENERATED CONTENT
function content(config, filter = '') {

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

         // FILTER OUT "HELPER" KEYS
         sub_keys = sub_keys.filter(key => key != 'path');
         sub_keys = sub_keys.filter(key => key != 'selected');

         // REVERSE REMAINING KEYS IN ORDER TO GET NEWEST FIRST
         sub_keys.reverse();

         // ENTRY BLOCK
         var block = '';

         // GENERATE HEADER
         var header = '<tr><td><div id="header"><table><tbody><tr><td>' + headerify(instance.path) + '</td>';

         // ADD SELECTED DROPDOWN TO HEADER IF USER EQUALS MASTER AND THERE ARE ATLEAST TWO SUBMISSIONS
         if (config.metamask.permission == 'master') {

            // GENERATE OPTIONS BASED ON SUBMISSION NAMES
            var options = '';
            sub_keys.forEach(name => {

               if (name == instance.selected) {
                  options += '<option selected>' + capitalize(name) + '</option>';
               } else {
                  options += '<option>' + capitalize(name) + '</option>';
               }

            });

            // ADD THEM TO SELECT & ADD SELECT TO HEADER
            header += '<td><select id="tracker-select" instance="' + entry + '"><option>None</option>' + options + '</select></td>';
         }

         // STITCH ENDTAGS TO HEADER & CONCAT TO BLOCK
         header += '</tr></tbody></table>';
         block += header;

         // GENERATE ROW FOR EACH ENTRY
         sub_keys.forEach((sub_entry) => {

            var sub_instance = instance[sub_entry];

            // FETCH MOMENT MODULE
            var moment = require('moment');

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
                        <td>` + moment.unix(sub_instance.timestamp).format('DD/MM @ HH:mm') + `</td>
                     </tr></tbody></table>
                  </div>
               </td></tr>
            `;

            // CONCAT ROW TO BLOCK
            block += row;
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
}

// ADD SPECIFIC EVENTS
function events(config) {

   // FETCH ACTION MODULES
   var actions = require('../modules/actions.js');

   // FILTER EVENT
   $("#filter").on('keyup', () => { var query = $('#filter').val(); content(config, query); });

   // COMPARE FILES EVENT
   $('body').on('click', 'a#compare', (target) => { actions.compare(target.currentTarget); });

   // CLOSE WINDOW EVENT
   $(document).on('keyup', (evt) => {
      
      // ESC KEY
      if (evt.keyCode == 27) {
         event.preventDefault();
         actions.close();
      }

   });

   // WHEN INSTANCE USER SELECTION DROPDOWN OPTION CHANGES
   $('body').on('change', '#tracker-select', (target) => {
      log('called event')

      target = target.currentTarget;

      // PICK UP RELEVANT INFO
      var instance = $(target).attr('instance');
      var user = $(target).val();

      // EXECUTE
      actions.change_selected(instance, user);
   });
}

// EXPORT RENDER FUNCTION AS MODULE
module.exports = render;