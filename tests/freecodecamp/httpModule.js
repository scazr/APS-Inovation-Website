const http = require('http');

const server = http.createServer(function (req, res) {
    if(req.url === '/'){
        res.writeHead(404, {'content-type': 'text/html'});
        res.write('<h1>Home Page</h1>');
        res.end();
    } else if(req.url === '/about'){
        res.writeHead(200, {'content-type': 'text/html'});
        res.write('<h1>About Page</h1>');
        res.end();
    } else if(req.url === '/contact'){
        res.writeHead(200, {'content-type': 'text/html'});
        res.write('<h1>Contact Page</h1>');
        res.end();
    } else {
        res.writeHead(200, {'content-type': 'text/html'});
        res.write('<h1>404, Resource Not Found <a href="/">Go Back Home</a></h1>');
        res.end();
    }
});

server.listen(5000, function () {
    console.log('Server listening at port 5000');
});