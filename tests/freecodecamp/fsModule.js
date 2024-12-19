const { EventEmitterAsyncResource } = require('events');
const fs = require('fs');
const { escape } = require('querystring');

fs.mkdir('.\\myFolder', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Folder created successfully');
    }
});

const data = 'Hi, this is newFile.txt';

fs.writeFile('./myFolder/myFile.txt', data, {flag: 'a'}, function (err) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Written to file successfully!');
    }
});

fs.readFile('./myFolder/myFile.txt', {encoding: 'utf-8'}, function (err, data) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('File read successfully! Here is the data');
        console.log(data);
    }
})

