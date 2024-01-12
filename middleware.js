module.exports.isloggedin = (req,res,next)=>{



    if(!req.isAuthenticated()){

        // here we will save the redirect url 
        req.session.redirectUrl = req.originalUrl
        req.flash("error" , "you must be log-in to make a post")
        return res.redirect("/login")
        
        
        }

    next()

}



module.exports.saveRedirectUrl = (req,res,next)=>{

if(req.session.redirectUrl){

res.locals.redirectUrl = req.session.redirectUrl


}

next()

}

