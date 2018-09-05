const Block = require('./block.js');
const Blockchain = require('./simpleChain.js');
const express = require('express');
const bodyParser = require('body-parser');

const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');



const HTTP_PORT = process.env.HTTP_PORT || 8000;

const app = express();
const bc = new Blockchain();

app.use(bodyParser.json())

app.get('/block/:id',async (req,res)=>{
 
        const blockRes = await bc.getBlock(req.params.id);
        if(blockRes) {
            res.json(blockRes)
        } else {
            res.status(404).send()
        }
    
    // bc.getBlock(blockID)
    //     .then((block)=>{
    //         if(block){res.json(block)}
    //         else {res.status(404).send()}
    //     })
    //     .catch(((error)=>{
    //         res.status(404).send()

    //     }))
   
});

app.post('/block',async (req,res)=>{

    const minedBlock = await bc.addBlock(new Block(req.body.body));
    res.json(minedBlock)




    // bc.mineBlock(new Block(req.body.body))
    //     .then((blc)=>{
    //         bc.addBlock(blc)
    //         return blc; 
    //     })
    //     .then((bl)=>{
    //         res.json(bl)
    //     })

});

// user provides public address in POST request, and receives message to sign 
let memPool = {};
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
    res.json('There is no such address.');

})

app.listen(HTTP_PORT,()=>{
    console.log(`Listening on port ${HTTP_PORT}`);
})









