const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");


// index route to show all listings
router.get("/", wrapAsync(listingController.index));

// new route to show form to create new listing
router.get("/new",isLoggedIn, wrapAsync(listingController.renderNewForm));

//show route
router.get("/:id", 
    wrapAsync(
    listingController.showListing
));

// create route to add new listing to DB
router.post("/", 
    isLoggedIn,
    validateListing,
    wrapAsync(
        listingController.createListing)
    
);
   
// edit Route
router.get("/:id/edit",
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.editListing));

// Update Route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
