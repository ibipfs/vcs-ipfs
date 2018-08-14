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
                  <input type="submit" id="action" value="Release">
               </td></tr>
            </table>
         </div></div>
      </div>
   `;

   // RENDER THEM IN & TURN OPACITY ON
   $('#content-body').html(container);
   $('#container').css('opacity', '1');

   // ACTION
   $('#action').on('click', () => {
      var significance = $("#significance :selected").text();

      // FETCH ACTIONS MODULE
      var Actions = require('../classes/actions.js');
      var actions = new Actions();

      actions.release(significance);
   });
}

// EXPORT MODULE
module.exports = render;