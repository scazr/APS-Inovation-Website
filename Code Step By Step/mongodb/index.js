const path = require('path');
const publicPath = path.join(__dirname, 'public');

const express = require('express');
const app = express();
const route = express.Router();

const reqFilter = require('./middleware.js');

const dbConnect = require('./mongodb');

const main = async function () {
    let data = await dbConnect();
    data = await data.find({name:'nord'}).toArray();
    console.log(data);
    console.log('function called')
}

// app.use(reqFilter);
route.use(reqFilter);
app.set('view engine', 'ejs');


app.get('/', function (_, res) {
    res.sendFile(`${publicPath}/index.html`);
});

app.get('/profile', function (_, res) {
    const user = {
        name:'Peter',
        email:'peter@test.com',
        country:'USA',
        skills:['php', 'js', 'node js', 'java']
    }

    res.render('profile', {user});
});

app.get('/users', function (_, res) {
    const user = {
        name:'Peter',
        email:'peter@test.com',
        country:'USA',
        skills:['php', 'js', 'node js', 'java']
    }

    res.render('profile', {user});
});

route.get('/about', function (_, res) {
    res.send('Welcome to About page');
});

app.use('/', route);

app.listen(8080);