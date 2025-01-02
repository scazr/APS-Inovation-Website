const dbConnect = require('./mongodb');

const deleteData = async function () {
    let data = await dbConnect();
    let result = await data.deleteOne({name:'max 5'})
    console.log(data)
}

deleteData();