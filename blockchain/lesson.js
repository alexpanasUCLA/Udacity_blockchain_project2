
let story = 'Found star using https://www.google.com/sky/';
const buf = Buffer.from(story, 'ascii').toString('hex');
const sizeBite = Buffer.byteLength(buf);
console.log(buf);
console.log(sizeBite);