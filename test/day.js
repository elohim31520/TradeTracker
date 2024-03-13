const dayjs = require("dayjs")

let time = dayjs("Aug-23-23 08:55AM".split(":")[0]).format("YYYY-MM-DD")
console.log(time);
console.log(typeof time)