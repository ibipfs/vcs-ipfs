// ONCLICK FILE
$('body').on('click', 'a#show', () => {

   // FILE PATH
   var path = $(event.target).attr('key');
   var split = path.split('/');

   // REFS
   var dir = split[0];
   var file = split[1];

   // GENERATE PROMISES
   var first = promisify('file', path);
   var second = promisify('dir', dir);

   // AFTER BOTH PROMISES ARE RESOLVED
   Promise.all([first, second]).then(function(values) {

      var content = values[0].toString('utf8');
      var info = fetchData(values[1], file);

      var type = info.name.split('.');
      type = findLang(type.pop());

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
                                 <td>Name/Path:</td>
                                 <td>` + info.path + `</td>
                              </tr>
                           </table>

                           <hr>

                           <table>
                              <tr>
                                 <td>Direct Link:</td>
                                 <td><a href="http://ipfs.io/ipfs/` + info.hash + `" target="_blank">` + info.hash + `</a></td>
                              </tr>
                           </table>

                           <hr>

                           <table>
                              <tr>
                                 <td>Size:</td>
                                 <td>` + info.size / 1000 + ` KB</td>
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

   // RENDER NEW CONTENT
   var render = new Render(hash);
   render.body();

});