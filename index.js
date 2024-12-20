const express = require('express');
const path = require('path');

const app = express();
const publicPath = path.join(__dirname, 'public');

app.set('view engine', 'ejs');

app.get('', function (_, res) {
    res.sendFile(`${publicPath}/index.html`);
});

app.get('/about', function (_, res) {
    const user = {
        name:'Peter',
        email:'peter@test.com',
        country:'USA'
    }

    res.render('profile', user);
});

app.get('/about', function (_, res) {
    res.sendFile(`${publicPath}/about.html`);
});

app.get('/help', function (_, res) {
    res.sendFile(`${publicPath}/help.html`);
});

app.get('*', function (_, res) {
    res.sendFile(`${publicPath}/notfound.html`);
});

app.listen(8080);
