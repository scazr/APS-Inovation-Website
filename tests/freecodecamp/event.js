const EventEmitter = require('events');
const myEmitter = new EventEmitter();

const welcomeUser = function () { console.log('Hi there, welcome to the server!'); }

myEmitter.on('userJoined', welcomeUser);

myEmitter.emit('userJoined');

