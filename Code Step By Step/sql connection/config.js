const mysql = require('mysql2');

const con = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'123456',
    database:'teste'
});

con.connect(function (err) {
    if(err)
    {
        console.warn('error in connection');
        console.log(err);
    } else {
        console.warn('connected');
    }
});

con.query('select * from teste', function(err, res) {
    console.warn('result', res)
})

module.exports = con;