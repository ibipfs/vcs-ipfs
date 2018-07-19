class Metamask {

   // REPLACE WITH SMART CONTRACT & BLOCKCHAIN EQUIVALENT
   constructor() {

      // MEMBER WHITELIST & NAMELIST
      this.whitelist = ['0x8a1fe5accc4ee542917058236f6c9cbac8f2b74e', '0x83dea6e4a7d7fdea1e1ee9f1c0284cdf27bac69b'];
      this.namelist = ['wickstjo', 'mydude'];
   
      // MEMBERSINFO OBJECT
      this.memberInfo = {
         "0x8a1fe5accc4ee542917058236f6c9cbac8f2b74e": {
            name: "wickstjo",
            timestamp: 1530321302
         },
         
         "0x83dea6e4a7d7fdea1e1ee9f1c0284cdf27bac69b": {
            name: "mydude",
            timestamp: 1530324655
         },
      }
   }

   // INIT METHOD
   init() {
      var p = promisify('metamask').then((accounts) => {
         return accounts;
      });

      return p;
   }

   // CHECK & RENDER
   check() {
      this.init().then((accounts) => {

         // CHECK AMOUNT
         var count = accounts.length;
         log(count + ' account(s) found.');

         // CSS VARS
         var text;
         var bg;
         var border;

         // IF ARRAY CONSISTS OF ONE ELEMENT IE. SOMEONE IS LOGGED IN
         if (count == 1) {
            var user = accounts[0];

            // CHECK IF MEMBER IS IN ARRAY
            var check = $.inArray(user, this.whitelist);

            // IF USER IS FOUND
            if (check != -1) {

               // FETCH CORRESPONDING NAME
               var name = this.memberInfo[user].name;

               // SET ACCOUNT NAME AS SELECTOR KEY
               $('#metamask').attr('whois', name);
               
               text = 'MetaMask Connected - ' + name;
               bg = 'success';
               border = '#B5D0C6';

            // IF CONNECTED BUT NOT A MEMBER
            } else {
               text = 'MetaMask Found - Unknown User';
               bg = 'caution';
               border = '#dada8b';
            }

         // IF METAMASK CANT BE FOUND
         } else {
            text = 'MetaMask Session Not Found';
            bg = 'error';
            border = '#CCAAAA';
         }
         
         // FINALLY RENDER APPROPRIATELY
         $('#metamask').text(text);
         $('#metamask').css('background', "url('interface/img/" + bg + ".png')");
         $('#metamask').css('border', 'thin solid' + border);
      });
   }

   // CHECK FOR LOGIN SESSION
   checkStatus() {
      var check = $('#metamask').attr('whois');
      var value = false;

      // IF SOMEONE IS LOGGED IN
      if (check != undefined) {
         var count = $.inArray(check, this.namelist);

         // IF USER IS PART OF MEMBERLIST
         if (count != -1) {
            value = true;
         }
      }

      return value;
   }

   // GETTER FOR ISLOGGED
   get isLogged() {
      return this.checkStatus();
   }

}