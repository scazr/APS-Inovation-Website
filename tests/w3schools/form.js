var formidable = require('formidable');
var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var uploadedFile = files.filetoupload;
            // console.log(uploadedFile);
            
            if (uploadedFile && uploadedFile[0] && uploadedFile[0].filepath) {
                console.log('File path:', uploadedFile[0].filepath);
            }

            var oldpath = uploadedFile[0].filepath;
            var newpath = 'C:/Users/guilherme.scatuzzi/' + uploadedFile[0].originalFilename;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end()
            })
            
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(8080);