const mongoose = require("mongoose")
const initdata = require("./data.js")
const List = require("../models/listing.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderworld"

main()
.then(()=>{

console.log("connection set-up")

})

.catch((err)=>{

console.log(err)

})


async function main(){

await mongoose.connect(MONGO_URL)


}


const initDB = async()=>{

await List.deleteMany({})
initdata.data = initdata.data.map((obj) =>({...obj , owner:"659561aa09ae05f5e9449480"}))
await List.insertMany(initdata.data)

console.log("data was initalize")


}

initDB()
































