function render(config) {
   body();
   content(config);
}

// ADD HTML CONTENT
function body() {

   // GENERATE SELECTOR & RENDER
   var container = '<div id="container"></div>';
   $('#content-body').html(container);
}

// ADD GENERATED CONTENT
function content(config) {

   // FETCH TRACKER KEYS & REVERSE ORDER
   var keys = Object.keys(config.tracker).reverse();

   // FETCH MOMENT MODULE IF THERE ARE KEYS
   if (keys.length != 0) { var moment = require('moment'); }

   // ALL ENTRY BLOCKS
   var blocks = '';

   // GENERATE BLOCK FOR EACH FILE
   keys.forEach((entry) => {
      var instance = config.tracker[entry];

      // KEYS OF SUBMISSIONS FOR INSTANCE -- REVERSED
      var sub_keys = Object.keys(instance).reverse();

      // FILTER OUT "HELPER" KEYS
      sub_keys = sub_keys.filter(key => key != 'path');
      sub_keys = sub_keys.filter(key => key != 'selected');

      // ENTRY BLOCK
      var block = '';

      // GENERATE HEADER
      var header = '<tr><td><div id="header"><table><tr><td>' + headerify(instance.path) + '</td>';

      // ADD SELECTED DROPDOWN TO HEADER IF USER EQUALS MASTER AND THERE ARE ATLEAST TWO SUBMISSIONS
      if (config.metamask.permission == 'master') {

         // GENERATE OPTIONS BASED ON SUBMISSION NAMES
         var options = '';

         // ADD FILLED SELECTOR FOR EACH SUBMISSION
         sub_keys.forEach(name => {

            // PUSH SELECTED PROP TO OPTION SELECTOR IF MATCH IS FOUND
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
      header += '</tr></table>';
      block += header;

      // GENERATE ROW FOR EACH ENTRY
      sub_keys.forEach((sub_entry) => {
         var sub_instance = instance[sub_entry];

         // GENERATE ROW
         var row = `
            <tr><td>
               <div id="gray" class="selected">
                  <table><tr>
                     <td>Author:</td>
                     <td>` + capitalize(sub_entry) + `</td>
                  </tr></table>
                  <hr>
                  <table><tr>
                     <td>Compare:</td>
                     <td><a id="compare" old="` + entry + `" new="` + sub_instance.hash + `" author="` + sub_entry + `" path="` + instance.path + `" time="` + sub_instance.timestamp + `">` + sub_instance.hash + `</a></td>
                  </tr></table>
                  <hr>
                  <table><tr>
                     <td>Submitted:</td>
                     <td>` + moment.unix(sub_instance.timestamp).format('DD/MM @ HH:mm') + `</td>
                  </tr></table>
               </div>
            </td></tr>
         `;

         // CONCAT ROW TO BLOCK
         block += row;
      });

      // GENERATE FULL BLOCK
      var table = '<table>' + block + '</table>';  
      var wrap = '<div id="tracker-outer"><div id="tracker-inner">' + table + '</div></div>';

      // CONCAT TO BLOCKS
      blocks += wrap;
   });

   // FALLBACK IF TRACKER IS EMPTY
   if (blocks == '') { blocks = '<div id="tracker-outer"><div id="tracker-inner"><table><tr><td><div id="header">No entries found.</div></td></tr></table></div></div>'; }

   // RENDER IN BLOCKS
   fadeIn('container', blocks);
}

// EXPORT RENDER AND CONTENT FUNCTIONS AS MODULES
module.exports = {
   render: render,
   content: content
}