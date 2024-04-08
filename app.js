const express = require("express");
const app = express();
const mongoose = require("mongoose");
const List = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const WrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema}  = require("./schema.js")
const session = require("express-session")
const cookie = require("cookies")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")
const {isloggedin} = require("./middleware.js")

const userRouter = require("./router/userRouter.js")

const port = 8080;

// post credit scene

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderworld";

main()
.then(()=>{

console.log("connection set-up");

})

.catch((err)=>{

console.log(err);

})


async function main(){

mongoose.connect(MONGO_URL);


}


app.set("view engine" , "ejs" );
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))//use to convert post request to put request or delete request
app.engine("ejs" , ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

const sessionOptions = {

secret : "mysupersecretcode",
resave : false,
saveUninitialized : true,

cookie: { 


expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
maxAge : 7 * 24 * 60 * 60 * 1000,
httpOnly : true

}



}

app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session()) // iske help se ham session create karte hain matlab , eak user alag alag pages mai jayega tab bhi wo eak session mana jayega
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser()) // serializeUser() iska kaam hota hai user ka sara data ka record rakhna when he login 
passport.deserializeUser(User.deserializeUser()) //deserializeUser() iska kaam hota hai user ka sara data ka record hta dena  when  he login-out

.

app.get("/" , (req,res)=>{
res.send("your server had been set up");

})

// from here we had created a middleware

app.use((req,res,next)=>{

res.locals.success = req.flash("success")
res.locals.error = req.flash("error")
res.locals.currUser = req.user
next()


})

// app.get("/demouser" , async(req,res)=>{

// let fakeUser = new User({ // here user is the the database jiske aandar user ki info store hogi

// email : "apnabhi@getMaxListeners.com",
// username : "M Walker"

// })

// let registeredUser = await User.register(fakeUser , "06062003") // now User ka jo ye register method hai ye User database ke aandar hamari info jo ki fakeUser mai like gayi hai usko save kar dega with password 06062003
// res.send(registeredUser)


// })

app.get("/listings" , wrapAsync(async (req,res)=>{

const allListings = await List.find({}) // using this we had finded all the database items
res.render("./listings/index.ejs" , {allListings});


})
)

// creating a new route


app.get("/listings/new" , isloggedin, wrapAsync(async(req,res)=>{


await res.render("./listings/new.ejs")

      

}))
    


app.get("/listings/:id" ,wrapAsync(async(req,res)=>{

let {id} = req.params;
const listing = await List.findById(id).populate("owner");

if(!listing){

req.flash("error" , "Listing you requested for do not exist")
res.redirect("/listings")


}

console.log(listing)

res.render("./listings/show.ejs" , {listing});


})

)

// creating a route for post request

app.post("/listings" , isloggedin , wrapAsync (async(req,res,next)=>{

let result = listingSchema.validate(req.body)
// console.log(result)

if(result.error){

throw new ExpressError(400 , result.error)

}

let newListing = new List(req.body.listing)
await newListing.save()
req.flash("success" , "New Listing is created")
res.redirect("/listings")


})


)

// editing our route


app.get("/listing/:id/edit" , isloggedin , wrapAsync(async(req,res)=>{

let {id} = req.params;
const listing = await List.findById(id);

if(!listing){

req.flash("error" , "Listing you requested for do not exist")
res.redirect("/listings")
    
    
}

res.render("./listings/edit.ejs", {listing})


})

)

// update route

app.put("/listings/:id" , isloggedin ,  wrapAsync(async(req,res)=>{

let {id} = req.params
await List.findByIdAndUpdate(id , {...req.body.listing})
req.flash("success" , "New Listing is updated")
res.redirect("/listings")



})
)

// delete the post

app.delete("/listings/:id" , isloggedin ,  wrapAsync(async(req,res)=>{


let {id} = req.params;
await List.findByIdAndDelete(id)
req.flash("success" , "New Listing is deleted")
res.redirect("/listings")

})


)


// app.get("/testListing" , async (req,res)=>{

// let samplelisting = new List({

// title: "My villa",
// description : "Welcome to my villa",
// price : 200,
// location : "Los-Angeles",
// country : "USA"

// })

// await samplelisting.save()
// console.log("sample was saved")
// res.send("successfully testing")

// })


app.use("/" , userRouter)



app.all("*",(req,res,next)=>{


next(new ExpressError(404 , "Page Not Found"))


})


// now we are going to set a error handling middleware which will help to handle backend errors

app.use((err,req,res,next)=>{


let {statusCode=500 , message="something went wrong"} = err;

res.status(statusCode).render("error.ejs" , {message})

// res.status(statusCode).send(message)



})


app.listen(port , (req,res)=>{

console.log(`your server had been set up at the port number ${port}`);

})







