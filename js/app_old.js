// UNCOMMENT IPFS LIBRARY @INDEX

const ipfs = new Ipfs({
   config: {
     Addresses: {
       Swarm: [
         '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/ipfs/QmZBAWZqfCTvBGqjiYLpp19MC2srkhdJWaUoUFY42JsCuS'
       ]
     }
   }
 });

ipfs.on('ready', () => {

   // QmQ2r6iMNpky5f1m4cnm3Yqw8VSvjuKpTcK1X7dBR1LkJF
   const validCID = 'QmXZG9SDe4xqo6FtBQ1EFdtidwL8pV3RNb8UAeJd8o66ec';
   $('body').html('<a href="https://ipfs.io/ipfs/' + validCID + '">' + validCID + '</a>')

/*    ipfs.ls(validCID, function (err, files) {
      log(files);
      files.forEach((file) => {
         console.log(file.path)
      })
   }) */

   ipfs.files.cat(validCID, function (err, file) {
      if (err) {
        throw err
      }
    
      console.log(file.toString('utf8'))
    })    

});

function log(stuff) {
   console.log(stuff);
}