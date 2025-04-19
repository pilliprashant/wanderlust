
const express = require("express");
const app = express();
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");//.. because relative
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const session = require("express-session");
const methodOverride = require('method-override');
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });
app.use(methodOverride('_method'));


 
router
.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingcontroller.create));

 //new route
 router.get("/new",isLoggedIn,listingcontroller.new);
router
.route("/:id")
.get(wrapAsync(listingcontroller.show))
.put(upload.single('listing[image]'),isLoggedIn,isOwner,validateListing,wrapAsync(listingcontroller.update))
.delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.delete));
 //edit route
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.edit));








//callbacks for these routes are in controllers folder
//index route
// router.get("/",wrapAsync(listingcontroller.index));
   
   //create route
//    router.post("/",validateListing,isLoggedIn,wrapAsync(listingcontroller.create));
   //show route
//    router.get("/:id",wrapAsync(listingcontroller.show));
  
   //update route
//    router.put("/:id",validateListing,isLoggedIn,isOwner,wrapAsync(listingcontroller.update));
   //delete route
//    router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingcontroller.delete));
  
   //index route
// router.get("/",wrapAsync(async (req,res)=>{
//   const allListings = await Listing.find({});
//    res.render("listing/index.ejs",{allListings});
//  }));
module.exports = router;