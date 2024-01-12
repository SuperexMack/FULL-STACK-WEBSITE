// WrapAsync ka use same catch aur try jaisa hota hai but ye usse jayada aache se kaam karta hai

module.exports = (fn) =>{

return (req,res,next) =>{

fn(req,res,next).catch(next)


}



}




















