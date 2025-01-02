const express = require('express');
const con = require('./config');
const app = express();

app.use(express.json());

app.get('/', function(req, res) {
    con.query('select * from teste', function(err, result) {
        if (err) {
            res.send('error in api');
        } else {
            res.send(result);
        }
    })
});

app.post('/', function (req, res) {
    const data = {
        name:'peter',
        password:'5050',
        user_type:'admin'
    }
    
    con.query('INSERT INTO teste SET?', req.body, function (err, result, fields) {
        if (err) throw err;
        res.send(result); 
    })
})

app.listen(8080);