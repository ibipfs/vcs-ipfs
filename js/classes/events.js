var funcs = require('../classes/event-funcs.js');

// HIDE PROMPT ON ESC
$(document).on('keyup',function(evt) {
   
   // ESC KEY
   if (evt.keyCode == 27) {
      event.preventDefault();
      funcs.closePrompt();
   }

});

// HIDE PRObuttonsMPT WITH DISCARD BUTTON
$('body').on('click', '#discard', () => {
   funcs.closePrompt();
});

// CTRL + X KEYBINDS
$(window).bind('keydown', function(event) {
   if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {

         // CTRL + S
         case 's':
            event.preventDefault();
            funcs.saveCache();
         break;

         // CTRL + X
         case 'x':
            event.preventDefault();
            funcs.removeCache();
         break;
      }
   }
});

// ONCLICK FILE
$('body').on('click', 'a#show', (target) => {

   // MAKE SHORTHAND
   var target = target.currentTarget;

   // CHECK IF VIEW ONLY STATUS
   var viewOnly = $(target).attr('viewonly');
   
   // FILE PATH
   var path = $(target).attr('hash');

   // CHECK WHAT TYPE OF HASH WAS PASSED
   var typeCheck = path.split('/').length;

   // FULL HASH
   if (typeCheck > 1) {

      // REFS
      var split = path.split('/');
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

         // FIGURE OUT FILE TYPE
         var type = info.name.split('.');
         type = type[type.length - 1];

         // FORMAT PATH TO BE MORE AESTHETIC
         var location = info.path.split('/');
         location[0] = 'root';
         location = location.join('/');
         location = headerify(location);

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
                                 <td id="path">` + location + `</td>
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

                     <div id="prompt-inner"></div>
         `;

         // STITCH IN BUTTON ROW IF USER IS LOGGED
         if (metamask.isLogged == true && viewOnly == undefined) {

            // FETCH BUTTONS MODULE
            var buttons = new Buttons(info.hash);

            // RENDER BUTTON ROW
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

         // FETCH MONACO EDITOR MODULE
         var monaco = require('@timkendrick/monaco-editor');
         
         monaco.editor.create(document.getElementById('prompt-inner'), {
            value: beautify(content, type),
            language: findLang(type),
            minimap: {
               enabled: false
            }
         });

         $("#prompt-space").css('opacity', '1');
      });

   // PARTIAL PATH
   } else {

      // READ FILE CONTENT
      promisify('file', path).then((content) => {

         // UNKNOWN, DEFAULTING TO JSON
         var type = 'JSON';

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
                                    <td>Name/Direct Link:</td>
                                    <td><a href="http://ipfs.io/ipfs/` + path + `" target="_blank">` + path + `</a></td>
                                 </tr>
                              </table>

                           </div>
                        </div>

                        <div id="prompt-inner">
                           <pre><code class="` + type + `">` + beautify(content, type) + `</code></pre>
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

   }
});

// ONCLICK DIRECTORY
$('body').on('click', 'a#open', (target) => {

   // MAKE SHORTHAND
   var target = target.currentTarget;

   // FILE PATH
   var hash = $(target).attr('hash');

   // RENDER NEW CONTENT
   var files = new Files(hash);
   files.body();
});

// SAVE FILE RENDITION TO CACHE
$('body').on('click', '#save', () => {
   funcs.saveCache();
});

// REMOVE CACHED FILE
$('body').on('click', '#remove', () => {
   funcs.removeCache();
});

// UPLOAD VIRTUAL FILE TO IPFS
$('body').on('click', '#upload', () => {
   funcs.upload();
});