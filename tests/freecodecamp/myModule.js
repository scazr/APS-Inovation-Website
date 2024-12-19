function myFunction1() {
    console.log('Hello from myFunction1!');
}

function myFunction2() {
    console.log('Hello from myFunction2!');
}

exports.myDateTime = function () {
    return Date();
}


module.exports = {
    foo: 'bar',
    myFunction1: myFunction1,
    myFunction2: myFunction2,
};