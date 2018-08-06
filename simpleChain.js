/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const level = require('level');
// const chainDB = './blockchaindata';
// const db = level(chainDB);


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

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

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {

  constructor(){
    this.chain = level('./blockchaindata');
    this.chain.put(0,JSON.stringify(Block.genesisBlock()))
  }

  // Add new block to LevelDB 
  async addBlock(newBlock){

    // Block height
    let l = await this.getBlockHeight(); 
    let prev = await this.getBlock(l-1)
   
        newBlock.height = l; 
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        newBlock.previousBlockHash = prev.hash; 
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();  
        console.log(newBlock);
        this.chain.put(newBlock.height,JSON.stringify(newBlock))
    }

    getBlockHeight() {
      return new Promise((resolve,reject)=>{
        let i = 0;
        this.chain.createReadStream().on('data', function(data) {
              i++;
            }).on('error', function(err) {
                reject('Unable to read data stream!', err)
            }).on('end', function() {
              resolve(i)
            });
      })
    }

    // get block from LevelDB 
    getBlock(blockHeight){
      // return object as a single string
      return this.chain.get(blockHeight)
      .then(block => JSON.parse(block))
      .catch(err=>console.log('Can not get block',err))
      // return JSON.parse(JSON.stringify(this.chain[blockHeight]));
    }

    // validate block
    async validateBlock(blockHeight){
      // get block object
      let block = await this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
     
      // remove block hash to test block integrity
      block.hash = "";
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();

      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    async validateChain(){
      let errorLog = [];
      let lengthChain = await this.getBlockHeight(); 
      for (let i = 0; i < lengthChain-1; i++) {
        // validate block
        if (!this.validateBlock(i)) errorLog.push(i);
        // compare blocks hash link
        let currentBlock = await this.getBlock(i);
        let previousBlock = await this.getBlock(i+1)

        let blockHash = currentBlock.hash;
        let previousHash = previousBlock.previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }
}





const blockChain_1 = new Blockchain()


// blockChain_1.addBlock(new Block('Block 2'))
  // blockChain_1.validateChain()
  // blockChain_1.validateBlock(0)

  // blockChain_1.getBlock(0)
  // .then(console.log)
  
  