const path = require('path');

const myPath = 'c:\\Users\\Guilherme\\OneDrive - AUTORIDADE PORTUARIA DE SANTOS S.A\\APS Inovação Site\\tests\\freecodecamp\\app.js';

const pathInfo = {
    fileName: path.basename(myPath),
    folderName: path.dirname(myPath),
    fileExtension: path.extname(myPath),
    absoluteOrNot: path.isAbsolute(myPath),
    detailInfo: path.parse(myPath),
}

console.log(pathInfo);