const Block = require('./block.js');
const Blockchain = require('./simpleChain.js');
const express = require('express');
const bodyParser = require('body-parser');

const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');



const HTTP_PORT = process.env.HTTP_PORT || 8000;

const app = express();
const bc = new Blockchain();

// Declare memPool to store data corresponding to a Blockchain ID
let memPool = {};


app.use(bodyParser.json())

// GET request for a specific block with provided block ID
app.get('/block/:id',async (req,res)=>{
 
        const blockRes = await bc.getBlock(req.params.id);
        if(blockRes) {
            blockRes.body.star.decodedStory = Buffer.from(blockRes.body.star.story,'hex').toString();
            res.json(blockRes)
        } else {
            res.status(404).send()
        }
   
});

// GET request for a specific block with provided block hash
app.get('/stars/hash:hash',async (req,res)=>{
    const lengthOfChain = await bc.getBlockHeight(); 
    const starHash = req.params.hash.slice(1);
    for (let index = 0; index < lengthOfChain; index++) {
        const element = await bc.getBlock(index);
        if(element.hash === starHash) {
            element.body.star.decodedStory = Buffer.from(element.body.star.story,'hex').toString();
            res.json(element);
            return;
        }       
    }
    res.json(`No block with hash ${starHash} in the chain`);

});


// GET blocks containing data on registered stars 
app.get('/stars/address:address',async (req,res)=>{
    const lengthOfChain = await bc.getBlockHeight(); 
    const blockchainID = req.params.address.slice(1);
    let starredBlocks =[];

    for (let index = 1; index < lengthOfChain; index++) {
        const element = await bc.getBlock(index);
        if(element.body.address === blockchainID) {
            element.body.star.decodedStory = Buffer.from(element.body.star.story,'hex').toString();
            starredBlocks.push(element)
        }       
    }

    res.json(starredBlocks);

});


// POST provided data on star with given Blockchain ID into the blockchain 
app.post('/block',async (req,res)=>{
    const {address,star} = req.body; 

    // Check if there are enough data
    if(!(star && star.dec && star.ra && star.story)) {
        return res.json('Not enough data provided');
    }

    // Check if there is memPool entry with address, and it is validated
    if(!memPool[address] || !memPool[address].messageSignature) {
        return res.json(`Your address is not validated`); 
    }
    star.story = Buffer.from(star.story, 'ascii').toString('hex');

    // Use Buffer.byteLength() to check size and truncate if >500 bytes
    if(Buffer.byteLength(star.story)>=500) {
        return res.json(`Story max size is 500 bytes. 
        Your story is ${Buffer.byteLength(star.story)} bytes`)
    }
    const notaryData = {
        address,
        star
    }

    const minedBlock = await bc.addBlock(new Block(notaryData));

    // Delete entry with validated address to avoid ability to send different req
    delete memPool[address];
    res.json(minedBlock)

});

// user provides public address in POST request, and receives message to sign 

app.post('/requestValidation',(req,res)=>{

    let address = req.body.address;
    if(!address.trim()){
        res.json('Please,provide valid address');
    }

    if(!memPool[address]){     
        let requestTimeStamp = new Date().getTime().toString().slice(0,-3);
        let message = `${address}:${requestTimeStamp}:starRegistry`;
        
        memPool[address] = {
            address,
            requestTimeStamp,
            message,
            validationWindow:300,
        };   
    } else {
        // adjust validationRequest
        let timeNow = new Date().getTime().toString().slice(0,-3);
        let timeWindow = timeNow-memPool[address].requestTimeStamp-300;
        timeWindow <0?memPool[address].validationWindow = - timeWindow: delete memPool[address];
    }
    
    memPool[address]?res.json(memPool[address]):res.json('Repeat validation request');

})

// POST request with address, signature, and message to verify identity 
app.post('/message-signature/validate',(req,res)=>{
    const{address,signature} = req.body; 

    if(!address.trim() || !signature.trim()) {
        res.json('Please,provide address and/or signiture')
    }

    if(memPool[address]) {
        let timeNow = new Date().getTime().toString().slice(0,-3);
        let timeWindow = timeNow-memPool[address].requestTimeStamp-300;
     
        if(timeWindow > 0){
            delete memPool[address];
            res.json('Waiting time exceeded 5 minutes; try again, please!')
        } else {
            const verificationResponse ={
                registerStar: bitcoinMessage.verify(memPool[address].message, address, signature),
                status: {
                    messageSignature: bitcoinMessage.verify(memPool[address].message, address, signature),
                    address,
                    signature,
                    message:memPool.message,
                    validationWindow:-timeWindow,
                    requestTimeStamp:memPool[address].requestTimeStamp 

                }               
            };
            memPool[address].messageSignature = verificationResponse.status.messageSignature;
            res.json(verificationResponse);
        }
    }
    res.json(`There is no such approved address as ${address}.`);

})

app.listen(HTTP_PORT,()=>{
    console.log(`Listening on port ${HTTP_PORT}`);
})

