// ONCLICK FILE
$('body').on('click', 'a#show', () => {

   // PICK UP TARGET HASH
   var path = $(event.target).attr('key');

   // FILE DETAILS
   var instanceData = fetchData(path);

   promisify('file', instanceData.hash).then((file) => {

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
                                 <td>` + instanceData.path + `</td>
                              </tr>
                           </table>
                           <hr>
                           <table>
                              <tr>
                                 <td>Direct Link: </td>
                                 <td><a href="http://ipfs.io/ipfs/` + instanceData.hash + `" target="_blank">` + instanceData.hash + `</a></td>
                              </tr>
                           </table>
                           <hr>
                           <table>
                              <tr>
                                 <td>Size: </td>
                                 <td>` + instanceData.size / 1000 + ` KB</td>
                              </tr>
                           </table>
                        </div>
                     </div>

                     <div id="prompt-inner">
                        <pre><code class="` + instanceData.suffix + `">` + file + `</code></pre>
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