// ONCLICK FILE
$('body').on('click', 'a#show', () => {

   // PICK UP TARGET PATH
   var path = $(event.target).attr('key');

   promisify('file', path).then((file) => {

      // INSTANCE DATA
      var data = file["0"];

      // CONTENT
      var content = data.content.toString('utf8');

      // FILE SUFFIX
      var type = data.path.split('.');
      type = type[1];

      // GENERATE TABLE
      var selector = `
         <table id="prompt">
            <tr>
               <td>
                  <div id="prompt-outer">

                     <div id="prompt-header">
                        <div id="item">
                           <table>
                              <tr>
                                 <td>Name/Path: </td>
                                 <td>` + path + `</td>
                              </tr>
                           </table>
                        </div>
                     </div>

                     <div id="prompt-inner">
                        <pre><code class="` + type + `">` + content + `</code></pre>
                     </div>

                     <div id="prompt-tools">
                        <table>
                           <tr>
                              <td><span id="save-cache">Save To Cache</span><span id="upload">Upload To IPFS</span></td>
                              <td><span id="remove-cache">Remove From Cache</span><span id="discard">Discard & Close</span></td>
                           </tr>
                        </table>
                     </div>

                  </div>
               </td>
            </tr>
         </table>
      `;

      // PREPEND TO BODY
      $('#prompt-space').prepend(selector);

      // CODE HIGHLIGHTING
      $('pre code').each(function(i, block) {
         hljs.highlightBlock(block);
      });

      $("#prompt-space").css('opacity', '1');
   });
});

// ONCLICK DIRECTORY
$('body').on('click', 'a#open', () => {

   // NEW DIR HASH
   var hash = $(event.target).attr('key');

   // EMPTY SELECTOR
   $('#files').html('');

   // RENDER NEW CONTENT
   var render = new Render(hash);
   render.body();

});