const dbConnect = require('./mongodb');

const updateData = async function () {
    let data = await dbConnect();
    let result = await data.updateOne(
        {name:'note6'},
        {
            $set:{name:'note pro 6'}
        }
    );
}

updateData();