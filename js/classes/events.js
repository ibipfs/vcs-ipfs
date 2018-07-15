// HIDE PROMPT ON ESC
$(document).on('keyup',function(evt) {

   // ESC KEY
   if (evt.keyCode == 27) {
      closePrompt();
   }

});

// HIDE PROMPT WITH DISCARD BUTTON
$('body').on('click', '#discard', () => {
   closePrompt();
});

// CTRL + X KEYBINDS
$(window).bind('keydown', function(event) {
   if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {

         // CTRL + S
         case 's':
            event.preventDefault();
            saveCache();
         break;

         // CTRL + X
         case 'x':
            event.preventDefault();
            removeCache();
         break;
      }
   }
});

// ONCLICK FILE
$('body').on('click', 'a#show', () => {

   // FILE PATH
   var path = $(event.target).attr('key');
   var split = path.split('/');

   // REFS
   var file = split.pop();
   var dir = split.join('/');

   // GENERATE PROMISES
   var first = promisify('file', path);
   var second = promisify('dir', dir);

   // AFTER BOTH PROMISES ARE RESOLVED
   Promise.all([first, second]).then(function(values) {

      // FILE PROPS
      var content = values[0].toString('utf8');
      var info = fetchData(values[1], file);

      // FETCH FILETYPE FOR HIGHLIGHT JS
      var type = info.name.split('.');
      type = findLang(type.pop());

      // FETCH AND CONCAT FULL PATH TO FILE
      var location = $('#location').text();
      location += ' / ' + capitalize(file);

      // BUTTONS
      var buttons = new Buttons(info.hash);

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
                                 <td>` + location + `</td>
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
      `;

      // STITCH IN BUTTON ROW IF USER IS LOGGED
      if (metamask.isLogged) {
         selector += buttons.render();
      }

      // STITCH IN END OF SELECTORS
      selector += `
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

// SAVE FILE RENDITION TO CACHE
$('body').on('click', '#save', () => {
   saveCache();
});

// REMOVE CACHED FILE
$('body').on('click', '#remove', () => {
   removeCache();
});

// UPLOAD VIRTUAL FILE TO IPFS
$('body').on('click', '#upload', () => {
   upload();
});