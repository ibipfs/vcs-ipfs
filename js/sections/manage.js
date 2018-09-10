function render(config) {

   // LIMIT TO MASTER
   if (config.metamask.permission == 'master') {
      body();

   } else { log('Permission Denied!'); }
}

// ADD HTML CONTENT
function body() {
   var container = '<div id="container"></div>';
   $('#content-body').html(container);

   var release = `
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
   `;

   var add = `
      <div id="tracker-outer"><div id="tracker-inner">
         <table>
            <tr><td><div id="header">Add user to Whitelist</div></td></tr>
            <tr><td>
               <div id="gray">
                  <table><tbody>
                     <tr>
                        <td style="vertical-align: middle">Name:</td>
                        <td>
                           <input type="text" placeholder="Claire" id="add-name">
                        </td>
                     </tr>
                     <tr>
                        <td style="vertical-align: middle">Ethereum Address:</td>
                        <td>
                           <input type="text" placeholder="0x45597FE80FE0F6dedEbe3359dC6C59A5414Fc9A2" id="add-address">
                        </td>
                     </tr>
                     <tr>
                        <td style="vertical-align: middle">Permission:</td>
                        <td>
                           <select id="add-permission">
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
   `;

   var change = `
      <div id="tracker-outer"><div id="tracker-inner">
         <table>
            <tr><td><div id="header">Change address Permission</div></td></tr>
            <tr><td>
               <div id="gray">
                  <table><tbody>
                     <tr>
                        <td style="vertical-align: middle">Ethereum Address:</td>
                        <td>
                           <input type="text" placeholder="0x45597FE80FE0F6dedEbe3359dC6C59A5414Fc9A2" id="change-address">
                        </td>
                     </tr>
                     <tr>
                        <td style="vertical-align: middle">Permission:</td>
                        <td>
                           <select id="change-permission">
                              <option>Editor</option>
                              <option>Admin</option>
                              <option>Master</option>
                           </select>
                        </td>
                     </tr>
                  </tbody></table>
               </div>
               <input type="submit" id="change" value="Change">
            </td></tr>
         </table>
      </div></div>
   `;

   fadeIn('container', release + add + change);
}

// EXPORT RENDER FUNCTION AS MODULE
module.exports = { render: render }