const Block = require('./block.js');
const Blockchain = require('./simpleChain.js');
const express = require('express');
const bodyParser = require('body-parser');

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

})

app.listen(HTTP_PORT,()=>{
    console.log(`Listening on port ${HTTP_PORT}`);
})









