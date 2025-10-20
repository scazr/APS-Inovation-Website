const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Muitas submissões já realizadas. Tente novamente mais tarde." },
    header: true,
});