const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js");
const reviewcontroller = require("../controllers/review.js");

//reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewcontroller.createReview));
//delete review
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewcontroller.deleteReview));
module.exports = router;