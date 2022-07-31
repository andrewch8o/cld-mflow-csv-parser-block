const csv = require("./handler")




csv.csv({url:"https://res.cloudinary.com/yakir/raw/upload/v1613954402/j9jzmzci3ym1faahu2x2.csv"}).then (r=> {
    console.log(r)
}).catch(e => {
    console.log(e)
})

