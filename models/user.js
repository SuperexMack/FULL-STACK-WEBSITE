const mongoose = require("mongoose") // using this we had acquired the mongoose
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({

email:{

type: String,
required : true,


}



})


userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User" , userSchema)







// passport-local-mongoose ye hamesha aapko eak username pahele se he deta hai , and also it will give a hashing , means hashing password

// passport-local-mongoose will addd a username  , hashed password and a salt value by itself















