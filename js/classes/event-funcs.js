var Mutable = require('./mutable.js')

// CLOSE PROMPT WINDOW
function closePrompt() {

   // CHECK CURRENT DISPLAY VALUE
   var value = $("#prompt").css('display');

   if (value == 'table') {

      // MAKE PARENT OPACITY ZERO AGAIN
      $('#prompt-space').css('opacity', '0');

      // WAIT FOR 0.2 SECONDS
      sleep(180).then(() => {

         // CSS HIDE SELECTOR
         $("#prompt").css('display', 'none');

         // REMOVE FROM DOM
         $('#prompt').remove();
      });
   }
}

// TRANSITION PROMPT BUTTONS EVENTS
function transitionButtons(_hash) {

   // TURN OPACITY TO ZERO
   $('#left').css('opacity', '0');
   $('#right').css('opacity', '0');

   // SLEEP FOR 1.8s
   sleep(180).then(() => {

      // RECALIBRATE BUTTONS
      var buttons = new Buttons(_hash);
      buttons.recalibrate();

      // TURN OPACITY TO MAX AGAIN
      $('#left').css('opacity', '1');
      $('#right').css('opacity', '1');
   });
}

// SAVE CACHE
function saveCache() {

   // PICK UP CACHE ID & VALUE
   var cache = $('#save-cache').attr('storage');

   // MAKE SURE SOMETHING IS CACHED
   if (cache != undefined && metamask.isLogged) {

      var value = 'I LOVE MEMES';
      var split = cache.split('-');

      // SAVE TO CACHE
      localStorage.setItem(cache, value);
      log('Cache Set.');

      // TRANSITION
      transitionButtons(split[0]);
   } else {

      // FALLBACK ERROR
      log('Trying to save.')
   }
}

// REMOVE CACHE
function removeCache() {

   // PICK UP CACHE ID & VALUE
   var cache = $('#remove-cache').attr('storage');

   // MAKE SURE SOMETHING IS CACHED
   if (cache != undefined && metamask.isLogged) {
      var split = cache.split('-');

      // SAVE TO CACHE
      localStorage.removeItem(cache);
      log('Cache Purged.')

      // TRANSITION
      transitionButtons(split[0]);
   
   } else {

      // FALLBACK ERROR
      log('Nothing is cached.')
   }
}

function upload() {

   // PICK UP CACHE ID & VALUE
   var cache = $('#save-cache').attr('storage');

   // MAKE SURE SOMETHING IS CACHED
   if (cache != undefined && metamask.isLogged) {
      var mutable = new Mutable();

      // LISTING FILES
      mutable.ls().then((files) => {
         log(files);

         // WRITE VIRTUAL TEMP FILE
         mutable.write(cache, localStorage.getItem(cache)).then((result) => {
            log('Wrote to file!');

            // FLUSH TO SAVE
            mutable.flush(cache).then((res) => {
               log('Flushed file!')
               
               // LISTING NEW FILES 
               mutable.ls().then((files) => {
                  log(files);
               });
            });
         });
      });
   } else {
      log('Tried to Upload.');
   }
}

// EXPORT ALL FUNCTIONS
module.exports = {
   closePrompt: closePrompt,
   transitionButtons: transitionButtons,
   saveCache: saveCache,
   removeCache: removeCache,
   upload: upload
}