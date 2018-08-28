function render() {

   var container = `
      <div id="container">
         <div id="tracker-outer"><div id="tracker-inner">
            <table>
               <tr><td><div id="header">Release New Version</div></td></tr>
               <tr><td>
                  <div id="gray">
                     <table><tbody><tr>
                        <td style="vertical-align: middle">Significance:</td>
                        <td>
                           <select id="significance">
                              <option>Small</option>
                              <option>Medium</option>
                              <option>Large</option>
                           </select>
                        </td>
                     </tr></tbody></table>
                  </div>
                  <input type="submit" id="release" value="Release">
               </td></tr>
            </table>
         </div></div>

         <div id="tracker-outer"><div id="tracker-inner">
            <table>
               <tr><td><div id="header">Add user to Whitelist</div></td></tr>
               <tr><td>
                  <div id="gray">
                     <table><tbody><tr>
                        <td style="vertical-align: middle">Name:</td>
                        <td>
                           <input type="text" placeholder="Claire" id="name">
                        </td>
                     </tr></tbody></table>
                     <table style="margin-top: 5px;"><tbody><tr>
                        <td style="vertical-align: middle">Ethereum Address:</td>
                        <td>
                           <input type="text" placeholder="0x45597FE80FE0F6dedEbe3359dC6C59A5414Fc9A2" id="address">
                        </td>
                     </tr></tbody></table>
                  </div>
                  <input type="submit" id="whitelist" value="Add">
               </td></tr>
            </table>
         </div></div>
      </div>
   `;

   // RENDER THEM IN & TURN OPACITY ON
   $('#content-body').html(container);
   $('#container').css('opacity', '1');

   // RELEASE
   $('#release').on('click', () => {

      // FETCH ACTIONS MODULE
      var Actions = require('../classes/actions.js');
      var actions = new Actions();

      // PICK UP SIGNIFICANCE & EXECUTE
      var significance = $("#significance :selected").text();
      actions.release(significance);

   });

   // WHITELIST
   $('#whitelist').on('click', () => {

      // PICK UP INPUT VALUES
      var name = $('#name').val();
      var address = $('#address').val();

      // CHECK LENGTHS
      if (name.length != 0 && address.length == 42) {

         // FETCH ACTIONS MODULE
         var Actions = require('../classes/actions.js');
         var actions = new Actions();

         // EXECUTE & LOG RESPONSE
         actions.add(name, address).then((response) => {
            log(response);
         });

      } else {
         log('Bad input data.');
      }
   });
}

// EXPORT MODULE
module.exports = render;