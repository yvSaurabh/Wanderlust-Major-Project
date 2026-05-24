const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../public/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

const setUploadedListingImage = (req, res, next) => {
    if (req.file) {
        req.body.listing = req.body.listing || {};
        req.body.listing.image = {
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`,
        };
    }

    next();
};

router.route("/")
     .get(wrapAsync(listingController.index))
     .post(
        isLoggedIn,
        upload.single("listing[imageFile]"),
        setUploadedListingImage,
        validateListing,
        wrapAsync(listingController.createListing)
     );
// new route to show form to create new listing
router.get("/new",isLoggedIn, wrapAsync(listingController.renderNewForm));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


  
// edit Route
router.get("/:id/edit",
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.editListing));



module.exports = router;
