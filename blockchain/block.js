
/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }

    static genesisBlock() {
      let genesisBlock = new this("First block in the chain - Genesis block");
      genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString(); 

      return genesisBlock; 
    }
}

module.exports = Block; 