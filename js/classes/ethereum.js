class Ethereum {

   // FETCH ROW FROM WHITELIST
   userInfo (address) {
      return new Promise((resolve, reject) => {
         contract.whitelist(address, (error, result) => {
            if (error) { reject(error); } else { resolve(result); }
         });
      });
   }
   
}

// EXPORT CLASS AS MODULE
module.exports = Ethereum;