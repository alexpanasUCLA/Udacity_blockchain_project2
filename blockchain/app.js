const Block = require('./block.js');
const Blockchain = require('./simpleChain.js');
const express = require('express');
const bodyParser = require('body-parser');

const HTTP_PORT = process.env.HTTP_PORT || 8000;

const app = express();
const bc = new Blockchain();

app.use(bodyParser.json())

app.get('/block/:id',(req,res)=>{
    let blockID = req.params.id; 

    bc.getBlock(blockID)
        .then((block)=>{
            if(block){res.json(block)}
            else {res.status(404).send()}
        })
        .catch(((error)=>{
            res.status(404).send()

        }))
   
});

app.post('/block',(req,res)=>{
    bc.mineBlock(new Block(req.body.body))
        .then((blc)=>{
            res.json(blc)
        })

})

app.listen(HTTP_PORT,()=>{
    console.log(`Listening on port ${HTTP_PORT}`);
})









