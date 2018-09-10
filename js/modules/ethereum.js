// FETCH WEB3 ETH ACCOUNTLIST
function sessions() {
   return new Promise((resolve, reject) => {
      web3.eth.getAccounts((error, result) => {
         if (error) { reject(error); } else { resolve(result); }
      });
   });
}

// FETCH ROW FROM WHITELIST
function user_info(address) {
   return new Promise((resolve, reject) => {
      contract.whitelist(address, (error, result) => {
         if (error) { reject(error); } else { resolve(result); }
      });
   });
}

// FETCH MASTER ADDRESS
function fetch_master() {
   return new Promise((resolve, reject) => {
      contract.master((error, result) => {
         if (error) { reject(error); } else { resolve(result); }
      });
   });
}

// ADD USER TO WHITELIST
function add(_name, _permission, _address) {
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

// CHANGE EXISTING USERS PERMISSION
function change(_address, _permisson) {
   return new Promise((resolve, reject) => {
      contract.change(_address, _permission, (error, result) => {
         if (error) {
            reject(error);
         } else {
            resolve('Permission Changed!');
         }
      });
   });
}

// EXPORT INDIVIDUAL FUNCTIONS AS MODULES
module.exports = {
   sessions: sessions,
   user_info: user_info,
   fetch_master: fetch_master,
   add: add,
   change: change
}