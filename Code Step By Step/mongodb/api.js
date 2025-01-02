const dbConnect = require('./mongodb');
const express = require('express');
const mongodb = require('mongodb');
const app = express();

app.use(express.json());
app.get('/', async function (req, res) {
    let data = await dbConnect();
    data = await data.find().toArray();
    res.send(data);
});

app.post('/', async function (req, res) {
    let data = await dbConnect();
    let result = await data.insert(req.body);
    response.send(result);
});

app.put('/', async function (req, res) {
    console.log(req.body);
    const data = await dbConnect();
    let result = data.updateOne(
        {name:'max 6'},
        {$set:req.body }
    );
    res.send({status:'updated'});
});

app.delete('/:id', async function (req, res) {
    console.log(req.params.id);
    const data = await dbConnect();
    let result = data.deleteOne({_id: new mongodb.ObjectId(req.params.id)})
    response.send(result);
    
})

app.listen(8080);