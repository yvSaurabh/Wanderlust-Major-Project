const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

const setUploadedListingImage = (req, res, next) => {
    if (req.file) {
        req.body.listing = req.body.listing || {};
        req.body.listing.image = {
            filename: req.file.filename,
            url: req.file.path,
        };
    }

    next();
};

router.route("/")
     .get(wrapAsync(listingController.index))
     .post(
        isLoggedIn,
        upload.single("listing[image]"),
        setUploadedListingImage,
        validateListing,
        wrapAsync(listingController.createListing)
     );
// new route to show form to create new listing
router.get("/new",isLoggedIn, wrapAsync(listingController.renderNewForm));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,
     isOwner, 
     upload.single("listing[image]"),
     setUploadedListingImage,
     validateListing, 
     wrapAsync(listingController.updateListing))
.delete(isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.deleteListing));


  
// edit Route
router.get("/:id/edit",
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.editListing));



module.exports = router;
