const fs = require('fs');

try {
    fs.writeFileSync('./tests/freecodecamp/myFileSync.txt', 'myFileSync says Hi');
    console.log('Write operation successful');

    const fileData = fs.readFileSync('./tests/freecodecamp/myFileSync.txt', 'utf-8');
    console.log('Read operation successful. Here is the data:');
    console.log(fileData);
} catch(err) {
    console.log('Error occurred!');
    console.log(err);
}

fs.readdir('./test/freecodecamp', function (err, files) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Directory read successfully! Here are the files:');
    console.log(files);
});

fs.rename('oldpath', 'newpath', function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('File renamed successfully!');
});

fs.unlink('path', function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Files deleted successfully!');
});

