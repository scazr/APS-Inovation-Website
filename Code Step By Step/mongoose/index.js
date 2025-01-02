const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/e-comm');

const express = require('express');
require('./config');
const Product = require('./product')
const app = express();

app.use(express.json());
app.post('/create', function (req, res) {
    // let data = new Product();
    console.log(req.body);
    res.send('done');
})

app.listen(8080);   

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    brand: String,
    category: String
});

const saveInDB = async function () {
    const Product = mongoose.model('products', productSchema);
    let data = new Product({
        name: 'max 100',
        price: 200,
        brand: 'maxx',
        category: 'Mobile'
    });
    const result = await data.save();
    console.log(result);

}

const updateInDB = async function () {
    const Product = mongoose.model('products', productSchema);
    let data = await Product.updateOne(
        { name: 'max 6' },
        {
            $set: { price: 600 }
        }
    )
    console.log(data);
}

const deleteInDB = async function() {
    const Product = mongoose.model('products', productSchema);
    let data = await Product.deleteOne({name:'max 100'})
    console.log(data)
}

const findInDB = async function() {
    const Product = mongoose.model('products', productSchema);
    let data = await Product.find({name:'max 100'})
    console.log(data)
}

updateInDB();