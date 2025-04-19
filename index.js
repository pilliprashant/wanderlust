
if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}


const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const Joi = require('joi');
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");
app.engine("ejs",ejsMate);
const methodOverride = require("method-override");
const user = require("./models/user.js");
const dburl = process.env.ATLAS_DB_URL;

main()
.then(()=>{console.log("connection successful")})
.catch(err => console.log(err));
async function main() {
  
  await mongoose.connect(dburl);
}
const store = MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600
});
store.on("error",()=>{
  console.log("error in mongo store",err);
});
const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
  }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentuser = req.user;
  next();
});
app.get("/demouser",async(req,res)=>{
  let fakeuser = new User({
    email:"student@gmail.com",
    username:"delta-student"
  });
  const registereduser = await User.register(fakeuser,"helloworld");
  res.send(registereduser);
});

app.use(cookieParser("secretcode"));
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.listen(3000,()=>{
    console.log("listening on port 3000");
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
app.get("/getcookies",(req,res)=>{
  res.cookie("greet","hello");
  res.send("sent you some cookies");
});
app.get("/getsignedcookie",(req,res)=>{
  res.cookie("made-in","India",{signed:true});
  res.send("done");
});
app.get("/verify",(req,res)=>{
  res.send(req.signedCookies);
});
app.all("*",(req,res,next)=>{
  
  next(new ExpressError(404,"Page Not Found!"));
});
app.use((err,req,res,next)=>{
  let {statusCode=500,message = "something went wrong"} = err;
  
  res.status(statusCode).render("error.ejs",{message});
});
