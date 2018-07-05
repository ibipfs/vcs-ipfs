// CONSOLE LOG SHORTHAND
function log(stuff) {
   console.log(stuff);
}

// PROMISIFY
function promisify(query, value = null) {
   return new Promise(function(resolve, reject) {

      switch(query) {

         // FETCH IPFS DIRECTORY CONTENT
         case 'dir':
            ipfs.ls(value, function (err, files) {
               resolve(files);
            });
         break;

         // FETCH IPFS FILE CONTENT
         case 'file':
            ipfs.files.cat(value, function (err, file) {
               resolve(file.toString('utf8'));
            });
         break;

         // FETCH NUMBER OF RECORDS
         case 'metamask':
            web3.eth.getAccounts(function(err, result) {
               if (err) {
                  log('MetaMask Error: ' + err)
               } else {
                  resolve(result);
               }
            });
         break;

         // FALLBACK
         default:
            log('Error in Promisify Switch.')
         break;
      }

   });
}

// HIDE PROMPT WITH DISCARD BUTTON
$('body').on('click', '#discard', () => {
   closePrompt();
});

// HIDE PROMPT ON ESC
jQuery(document).on('keyup',function(evt) {

   // ESC KEY
   if (evt.keyCode == 27) {
      closePrompt();
   }

});

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

// SLEEP FUNC FOR TRANSITIONS
function sleep (time) {
   return new Promise((resolve) => setTimeout(resolve, time));
 }

// CHECK IF USER IS LOGGED IN
promisify('metamask').then((accounts) => {

   // CHECK AMOUNT
   var count = accounts.length;
   log(count + ' account(s) found.');

   // ASSIST VARS
   var text;
   var bg;

   if (count == 1) {
      var user = accounts[0];

      // MEMBERS ARRAY -- REPLACE WITH BLOCKCHAIN VERSION
      var members = ['0xf8ac66155f50a5abd84e663834e2bca064f360c4', '0x2ca50c5fb8d1667189706d589cb554ef882c8eff'];
      
      // CHECK IF MEMBER IS IN ARRAY
      var check = $.inArray(user, members);

      // IF USER IS FOUND
      if (check != -1) {

         // MEMBERSINFO OBJECT -- REPLACE WITH BLOCKCHAIN VERSION
         var memberInfo = {
            "0xf8ac66155f50a5abd84e663834e2bca064f360c4": {
               name: "wickstjo",
               timestamp: 1530321302
            },
            "0x2ca50c5fb8d1667189706d589cb554ef882c8eff": {
               name: "testuser",
               timestamp: 1530324655
            },
         }

         // FETCH CORRESPONDING NAME
         var name = memberInfo[user].name;

         // SET ACCOUNT NAME AS SELECTOR KEY
         $('#metamask').attr('key', name);
         
         text = 'MetaMask Connected - ' + name;
         bg = 'success';

      // IF CONNECTED BUT NOT A MEMBER
      } else {
         text = 'MetaMask Found - Unknown User';
         bg = 'caution';
      }

   // IF METAMASK CANT BE FOUND
   } else {
      text = 'MetaMask Not Found';
      bg = 'error';
   }
   
   // FINALLY RENDER APPROPRIATELY
   $('#metamask').text(text);
   $('#metamask').css('background', "url('interface/img/" + bg + ".png')");
});