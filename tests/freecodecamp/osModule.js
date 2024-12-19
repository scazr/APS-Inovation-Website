const os = require('os');

//os.uptime()
const systemUptime = os.uptime();

//os.userInfo()
const userInfo = os.userInfo();

const otherInfo = {
    name: os.type(),
    release: os.release(),
    totalMem: os.totalmem(),
    freeMem: os.freemem(),
}

console.log(systemUptime);
console.log(userInfo);
console.log(otherInfo);