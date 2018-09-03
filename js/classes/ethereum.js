class Ethereum {

   // FETCH WEB3 ETH ACCOUNTLIST
   sessions() {
      return new Promise((resolve, reject) => {
         web3.eth.getAccounts((error, result) => {
            if (error) { reject(error); } else { resolve(result); }
         });
      });
   }

   // FETCH ROW FROM WHITELIST
   userInfo (address) {
      return new Promise((resolve, reject) => {
         contract.whitelist(address, (error, result) => {
            if (error) { reject(error); } else { resolve(result); }
         });
      });
   }

   // ADD USER TO WHITELIST
   add (_name, _permission, _address) {
      return new Promise((resolve, reject) => {
         contract.add(_name, _permission, _address, (error, result) => {
            if (error) {
               reject(error);
            } else {
               resolve('User "' + _name + '" was successfully added!');
            }
         });
      });
   }
   
}

// EXPORT CLASS AS MODULE
module.exports = Ethereum;