class Metamask {

   // FETCH WEB3 ETH ACCOUNTLIST
   sessions() {
      return new Promise((resolve, reject) => {
         web3.eth.getAccounts((error, result) => {
            if (error) { reject(error); } else { resolve(result); }
         });
      });
   }
}

// EXPORT CLASS AS MODULE
module.exports = Metamask;