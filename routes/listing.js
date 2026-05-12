const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { normalizeListingImage } = require("../utils/image.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");


// index route to show all listings
router.get("/", wrapAsync(listingController.index));

// new route to show form to create new listing
router.get("/new",isLoggedIn,wrapAsync(async(req,res)=>{
    console.log(req.user);
    
    res.render("listings/new");

}));
//show route
router.get("/:id", 
    wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

        if(!listing) {
            req.flash("error", "Listing you requested does not exist.");
            return res.redirect("/listings");
        }

        console.log(listing);
    res.render("listings/show",{listing});
}));

// create route to add new listing to DB
router.post("/", 
    isLoggedIn,
    validateListing,
    wrapAsync(async(req, res)=>{
        req.body.listing.image = normalizeListingImage(req.body.listing.image);
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New listing created successfully!");
        res.redirect("/listings");
    })
    
);
   
// edit Route
router.get("/:id/edit",
    isLoggedIn, 
    isOwner,
    wrapAsync(async (req, res)=>{
    res.render("listings/edit.ejs",{listing: req.listing});
}));

// update route
const updateListing = async (req, res) => {
    let {id} = req.params;
    req.body.listing.image = normalizeListingImage(req.body.listing.image);
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

// Update Route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(updateListing));

const deleteListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};

// Delete Route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(deleteListing));

router.post("/:id", 
    isLoggedIn,
    isOwner,
     wrapAsync(async (req, res, next) => {
    if (req.body._method === "PUT") {
        validateListing(req, res, () => {});
        return updateListing(req, res);
    }

    if (req.body._method === "DELETE") {
        return deleteListing(req, res);
    }

    return next(new ExpressError(405, "Method Not Allowed"));
}));

module.exports = router;
