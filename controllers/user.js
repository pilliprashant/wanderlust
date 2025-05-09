const User = require("../models/user.js");
module.exports.renderSignup = (req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup = async(req,res,next)=>{
    try{
        let {username,email,password} = req.body;
       const newUser =  new User({email,username});
       const registereduser =  await  User.register(newUser,password);
       req.login(registereduser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","user was registered successfully");
        res.redirect("/listings");
       });
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}
module.exports.renderLogin = (req,res)=>{
   res.render("users/login.ejs");
}
module.exports.login = async(req,res)=>{
    req.flash("success","welcome back to wanderlust!You are logged in!");
    redirectUrl = res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
  }

  module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","you are logged out now!");
      res.redirect("/listings");
    });
  }