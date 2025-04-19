const mongoose = require("mongoose");
const reviews = require("./reviews");
const {Schema } = mongoose;
const { ref } = require("joi");
const Review = require("./reviews.js");
let listingSchema = new mongoose.Schema({
   title:{
    type: String,
    required: true
   },
   description: String,
   image:{
    url:String,
    filename:String,
   },
   price: Number,
   location: String,
   country: String,
   reviews:[
      {
         type : Schema.Types.ObjectId,
         ref: "Review"
      }
   ],
   owner:{
      type: Schema.Types.ObjectId,
      ref:"User"
   },
   geometry:{
      type: {
         type: String, // Don't do `{ location: { type: String } }`
         enum: ['Point'], // 'location.type' must be 'Point'
         required: true
       },
       coordinates: {
         type: [Number],
         required: true
       },
      
   },
   category:{
      type:String,
      enum:["Trending","Rooms","Iconic Cities","Mountains","Castels","Amazing Pools","Camping","Farms","Arctic","Domes","Boats"]
   }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
   if(listing)
   await Review.deleteMany({_id:{$in:listing.reviews}});
})
let Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;