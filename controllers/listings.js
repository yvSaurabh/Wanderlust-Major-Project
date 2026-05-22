const Listing = require("../models/listing");
const { normalizeListingImage } = require("../utils/image.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res)=>{
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
};

module.exports.createListing = async(req, res)=>{
        req.body.listing.image = normalizeListingImage(req.body.listing.image);
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New listing created successfully!");
        res.redirect("/listings");
    };

 module.exports.editListing = async (req, res)=>{
    res.render("listings/edit.ejs",{listing: req.listing});
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    req.body.listing.image = normalizeListingImage(req.body.listing.image);
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};
