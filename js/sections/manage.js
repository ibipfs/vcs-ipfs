function render(config) {
   elements();
   events(config);
}

// ADD HTML CONTENT
function elements() {
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
                     <table><tbody>
                        <tr>
                           <td style="vertical-align: middle">Name:</td>
                           <td>
                              <input type="text" placeholder="Claire" id="name">
                           </td>
                        </tr>
                        <tr>
                           <td style="vertical-align: middle">Ethereum Address:</td>
                           <td>
                              <input type="text" placeholder="0x45597FE80FE0F6dedEbe3359dC6C59A5414Fc9A2" id="address">
                           </td>
                        </tr>
                        <tr>
                           <td style="vertical-align: middle">Permission:</td>
                           <td>
                              <select id="permission">
                                 <option>Editor</option>
                                 <option>Admin</option>
                                 <option>Master</option>
                              </select>
                           </td>
                        </tr>
                     </tbody></table>
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
}

// ADD SPECIFIC EVENTS
function events(config) {

   // FETCH ACTION MODULES
   var actions = require('../classes/actions.js');

   // RELEASE
   $('#release').on('click', () => {

      // PICK UP USER SELECTED SIGNIFICANCE
      var significance = $("#significance :selected").text();

      // EXECUTE
      actions.release(significance);
   });

   // WHITELIST
   $('#whitelist').on('click', () => {

      // PICK UP INPUT VALUES
      var name = $('#name').val();
      var permission = $("#permission :selected").text();
      var address = $('#address').val();

      // EXECUTE
      actions.add(name, permission, address);
   });
}

// EXPORT RENDER FUNCTION AS MODULE
module.exports = render;