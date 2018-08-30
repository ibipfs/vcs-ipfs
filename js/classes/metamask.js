class Metamask {

   // FETCH WEB3 ETH ACCOUNTLIST
   accounts () {
      return new Promise((resolve, reject) => {
         web3.eth.getAccounts((error, accounts) => {
            if (error) {
               reject(error);
            } else {
               resolve(accounts);
            }
         });
      });
   }

}

// EXPORT CLASS
module.exports = Metamask;