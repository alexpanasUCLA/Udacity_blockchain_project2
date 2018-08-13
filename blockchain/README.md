# Node Framework

The project uses Express.js version 4.6.13 and Node.js version 9.5.0. Please, check your version of Node.js and change it to version 9.5.0 or higher as error may be thrown in case 
of diffrent version of Node. You can use nvm use command for that. 

``` 
nvm use 9

```

The project is located in the folder blockchain within PROJECT_2 directory.

 - Use npm install command to intall project dependencies. The folder node_modules should be generated. 
  ```
  npm install
  ```
- Entry file in blockchain folder is app.js. It starts a server on default port 8000 unless other port is specified by environmental variable. Use the node app.js command in the blockchain folder to start the server. 

``` node app.js
```

# API endpoints 

Express.js based API exposes 2 endpoints: GET: '/block/:id', and POST: '/block'.

- GET endpoints:

API return JSON formated block specified by a number if reached by GET endpoint. 
The syntax is `localhost:8000/block/number`, where number is a height of the block in blockchain. 

Example:

GET request using the syntax below return block with height 0 - which is Genesis Block. 

```
localhost:8000/block/0

```
Error handling:

If no block exist with provided height, GET request returns with STATUS 404, NOT FOUND. 

- POST endpoints 

API accepts data send in JSON format. Use the follwing syntax to reach POST endpoint of API:

```
{
  "body": "Insert your data here"
}

```
The POST request is parsed by body-parser middleware third-party package. Use "body" field to 
send data to POST endpoint.

Example: 

```
localhost:8000/block

```

POST endpoint uses parsed data to generate a block using mineBlock() method of Blockchain class and sends back response which contains JSON encoding of the block to be inserted to the blockchain. The new block is generated and inserted into the blockchain (stored in blockchaindata file that stores blockchain). 



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
