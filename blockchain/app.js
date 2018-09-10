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

// GET request for a specific block with provided ID
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
    for (let index = 1; index < lengthOfChain; index++) {
        const element = await bc.getBlock(index);
        if(element.hash === starHash) {
            element.body.star.decodedStory = Buffer.from(element.body.star.story,'hex').toString();
            res.json(element);
            return;
        }       
    }
    res.json(`No block with hash ${starHash} in the chain`);

});



// POST provided data on star with given Blockchain ID into the blockchain 
app.post('/block',async (req,res)=>{
    const {address,star} = req.body; 
    // TODO: Check if there is memPool entry with address, and it is validated
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

    memPool[address].block = minedBlock; 
    console.log(memPool);
    res.json(minedBlock)

});

// user provides public address in POST request, and receives message to sign 

app.post('/requestValidation',(req,res)=>{
    let address = req.body.address;
    let requestTimeStamp = new Date().getTime().toString().slice(0,-3);
    let message = `${address}:${requestTimeStamp}:starRegistry`;
    const validationRequest = {address,requestTimeStamp,message,"validationWindow":300}
    memPool[address] = {address,requestTimeStamp,message};  
    res.json(validationRequest)
})

// POST request with address, signature, and message to verify identity 
app.post('/message-signature/validate',(req,res)=>{
    const{address,signature,message} = req.body; 
    if(memPool[address]) {
        let timeNow = new Date().getTime().toString().slice(0,-3);
        let timeWindow = timeNow-memPool[address].requestTimeStamp-300;
        if(timeWindow > 0){
            delete memPool[address];
            res.json('Waiting time exceeded 5 minutes; try again, please!')
        } else {
            const verificationResponse ={
                messageSigniture: bitcoinMessage.verify(message, address, signature),
                address,
                signature,
                message,
                validationWindow:-timeWindow,
                requestTimeStamp:memPool[address].requestTimeStamp                   
            };
            res.json(verificationResponse);
        }
    }
    res.json(`There is no such approved address as ${address}.`);

})

app.listen(HTTP_PORT,()=>{
    console.log(`Listening on port ${HTTP_PORT}`);
})









