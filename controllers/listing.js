
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: maptoken });
module.exports.index = async (req,res)=>{
 
     const searchQuery = req.query.search;
     let listings;
   
     if (searchQuery) {
       listings = await Listing.find({
         location: { $regex: searchQuery, $options: 'i' }
       });
     } else {
       listings = await Listing.find({});
     }
   
     res.render("listing/index.ejs", { allListings: listings });
   
    
   }
   module.exports.new = (req,res)=>{
     
        res.render("listing/new.ejs");
      }
      module.exports.create = async (req,res,next)=>{
     let response= await  geocodingClient.forwardGeocode({
          query: req.body.listing.location,
          limit: 2
        })
          .send();
        
        
          
        let url = req.file.path;
        let filename = req.file.filename;
      
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        newListing.geometry = response.body.features[0].geometry;
        
         let savedlisting = await newListing.save();
         console.log(savedlisting);
         req.flash("success","New listing created");
         res.redirect("/listings");
        }
        module.exports.show =async(req,res)=>{
            let {id} = req.params;
            const listing = await Listing.findById(id)
            .populate({
             path:"reviews",
             populate:{
               path:"author",
             },
             })
             .populate("owner");
            if(!listing){
             req.flash("error","Listing you requested for does not exist");
             res.redirect("/listings");
            }
           
            res.render("listing/show.ejs",{listing});
          }
    module.exports.edit = async(req,res)=>{
         let {id} = req.params;
         const listing = await Listing.findById(id);
         if(!listing){
          req.flash("error","Listing you requested for does not exist");
          res.redirect("/listings");
         }
         let originalImageUrl = listing.image.url;
         originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
          res.render("listing/edit.ejs",{listing,originalImageUrl});
       }
       module.exports.update = async(req,res)=>{
       
         if(!req.body.listing){
           throw new ExpressError(400,"send valid data for listing");
          }
         let {id} = req.params;
        let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
        //  let listing = await Listing.findById(id);
        if(typeof req.file !== "undefined"){
         let url = req.file.path;
         let filename = req.file.filename;
         listing.image = {url,filename};
         await listing.save();
        }
        
         req.flash("success","Listing updated");
         res.redirect(`/listings/${id}`);
       }
       module.exports.delete = async(req,res)=>{
        let {id} = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success","Listing deleted");
        res.redirect("/listings");
      }