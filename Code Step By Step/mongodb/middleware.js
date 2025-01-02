module.exports = function (req, res, next) {
    if (!req.query.age) {
        res.send("Please provide your age");
    } 
    else if (req.query.age < 18) {
        res.send("You are under aged");
    } else {
        next();
    }
}