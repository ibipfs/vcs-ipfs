class Ethereum {

   // FETCH ROW FROM WHITELIST
   whitelist (address) {
      return new Promise((resolve, reject) => {
         contract.whitelist(address, (error, whitelist) => {
            if (error) {
               reject(error);
            } else {
               resolve(whitelist);
            }
         });
      });
   }

   // ADD USER TO WHITELIST
   add(_name, _permission, _address) {
      return new Promise((resolve, reject) => {
         contract.add(_name, _permission, _address, (error, result) => {
            if (error) {
               reject(error);
            } else {
               resolve('Added "' + _name + '" to the whitelist!');
            }
         });
      });
   }

   // FETCH CONTRACT MASTER ADDRESS
   master() {
      return new Promise((resolve, reject) => {
         contract.master((error, master) => {
            if (error) {
               reject(error);
            } else {
               resolve(master);
            }
         });
      });
   }

}

// EXPORT CLASS
module.exports = Ethereum;