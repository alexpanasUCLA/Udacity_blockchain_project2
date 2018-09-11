# Node Framework

The project uses Express.js version 4.6.13 and Node.js version 9.5.0. Please, check your version of Node.js and change it to version 9.5.0 or higher as error may be thrown in case 
of diffrent version of Node. You can use nvm use command for that. 

``` 
nvm use 9

```

The project is located in the folder blockchain within PROJECT_2 directory. Please, 
cd to blockchain directory. 

 - Use npm install command to intall project dependencies. The folder node_modules should be generated. 
  ```
  npm install
  ```
- Entry file in blockchain folder is app.js. It starts a server on default port 8000 unless other port is specified by environmental variable. Use the node app.js command in the blockchain folder to start the server. 

``` node app.js
```

# API ENDPOINTS 

The user submits its public key (Blockchain ID) to request Validation, and in response
in JSON receives message to sign with private key. The messages needs to be signed no later
than 300ms (5min) after request is received. 

The user signes the message with its private key and sumbits to validation. The result of 
validation is provided in JSON response with messageSigniture set to true or false. 

Provided that messageSigniture is validate, the encoded information on the star is 
stored in the block on the blockchain. 



POST ENDPOINTS

Request Validation. 

```
localhost:8000//requestValidation
```
Parameters: 

```
{
  "address": <public key>
}
```
Response: 

```
{
  "address": <public key>,
  "requestTimeStamp": <new Date()>,
  "message": "<public key>:<requestedTimeStamp>:starRegistry",
  "validationWindow": 300
}

```

Validate message with private key. 

```
localhost:8000//message-signature/validate
```

Parameters: 

```
{
	"address":<public address>,
	"signature":<signiture of message with private key>
}


```

Response: 

```
{
    "messageSigniture": true or false,
    "address": <publickey>,
    "signature": <signiture of message with private key>,
    "message": <message sent after request for validation>,
    "validationWindow": <time difference request and submit of data>,
    "requestTimeStamp": <time of request>
}
```
Add encodes data on star to blockchain. 

```
localhost:8000/block
```

Parameters:

```
{
  "address": <public key>,
  "star": {
    "dec": <data>,
    "ra": <data>,
    "story": <message in ASCII>"
  }
}

```
Response:

```
{
    "hash": <block hash>,
    "height": <block height>,
    "body": {
        "address": <public key>,
        "star": {
            "dec": <data>,
            "ra": "<data>,
            "story": <hex encoded story>
        }
    },
    "time": <time of block creation>,
    "previousBlockHash": <hash of previous block>
}

```

GET ENDPOINTS.

GET block with given height. 

```
localhost:8000/block/<block height>
```

Response: 
```
{
    "hash": <block hash>,
    "height": <block height>,
    "body": {
        "address": <public key>,
        "star": {
            "dec": <data>,
            "ra": "<data>,
            "story": <hex encoded story>,
            "decodedStory":<decoded story>
        }
    },
    "time": <time of block creation>,
    "previousBlockHash": <hash of previous block>
}

```

GET block with given block hash.

```
localhost:8000/stars/hash:<block hash>
``` 
Response is the same as in GET block with given height. 

GET block with given Blockchain ID (address).

```
localhost:8000/stars/address:<address>
```

Response:

Array of blocks containing provided Blockchain ID (address). 




# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```

## Testing

To test code:
1: Open a command prompt or shell terminal after install node.js.
2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
```
node
```
3: Copy and paste your code into your node session
4: Instantiate blockchain with blockchain variable
```
let blockchain = new Blockchain();
```
5: Generate 10 blocks using a for loop
```
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new Block("test data "+i));
}
```
6: Validate blockchain
```
blockchain.validateChain();
```
7: Induce errors by changing block data
```
let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
}
```
8: Validate blockchain. The chain should now fail with blocks 2,4, and 7.
```
blockchain.validateChain();
```
