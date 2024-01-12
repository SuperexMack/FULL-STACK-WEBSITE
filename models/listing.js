const mongoose = require("mongoose") // using this we had acquired the mongoose
const Schema = mongoose.Schema


const listSchema = new Schema({

title:{

type : String,
required : true

},

description:String,

image:{

type : String,
default : "https://unsplash.com/photos/a-man-standing-on-top-of-a-roof-in-the-snow-m7yVul9-AbA",
set:(v) => v === ""?"https://unsplash.com/photos/a-man-standing-on-top-of-a-roof-in-the-snow-m7yVul9-AbA":v,


},

price : {


type : Number,
min: 0


},
location : String,
country :String,

owner:{

type: Schema.Types.ObjectId,
ref: "User"



}




})


const List = mongoose.model("List" , listSchema)

module.exports = List


