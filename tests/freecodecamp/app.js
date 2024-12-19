// __dirname Global Variable
console.log(__dirname);

// __filename Global Variable
console.log(__filename);

// Define a global variable in NodeJS
global.myVariable = 'Hello World';

const hello = require('./hello.js');
const myFunction1 = require('./myModule');

hello.sayHello('John');
hello.sayHello('Peter');
hello.sayHello('Rohit');

// app.js

const myModule = require('./myModule');

console.log(myModule.foo); // logs 'bar'
myModule.myFunction1(); // logs 'Hello from myFunction1!'
myModule.myFunction2(); // logs 'Hello from myFunction2!'