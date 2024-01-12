const express = require("express")
const router = express.Router()
const User = require("../models/user")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const flash = require("connect-flash")
const {saveRedirectUrl} = require("../middleware")

router.get("/signup" , (req,res)=>{


res.render("users/singnup.ejs")



})


router.post("/signup" , wrapAsync(async(req,res)=>{

try{

    let{username , password , email} = req.body
    const newUser = new User({email , username})
    const registerdUser = await User.register(newUser , password)
    console.log(registerdUser)
    
    req.login(registerdUser , (err)=>{

    if(err){

    return next(err)

    }

    req.flash("success" ,"Welcome to wonder-world")
    res.redirect("/listings")


    })


}

catch(e){

req.flash("error" , e.message)
res.redirect("/signup")


}


}))


router.get("/login" , wrapAsync(async(req,res)=>{

res.render("users/login.ejs")


}))


router.post("/login" , saveRedirectUrl ,passport.authenticate("local" , {failureRedirect:"/login" ,failureFlash:true}) , wrapAsync(async(req,res)=>{

req.flash("success" , "Welcome back to wonder-world")
res.redirect(res.locals.redirectUrl)


})
)




router.get("/logout", (req,res,next)=>{


req.logout((err)=>{

if(err){

return next(err)

}



req.flash("success" , "you are logged out now")
res.redirect("/listings")

})

})




module.exports = router

