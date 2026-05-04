const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
//const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {
        let listing = await Listing.findById(req.params.id);
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        console.log(newReview);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log("new review added");
        req.flash("success", "Review added successfully!");
        res.redirect(`/listings/${listing._id}`);
    })
);

const updateReview = async (req, res) => {
    isLoggedIn,
    isReviewAuthor,
    validateReview;
    let { id, reviewId } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { ...req.body.review },
        { runValidators: true, new: true }
    );

    if (!updatedReview) {
        throw new ExpressError(404, "Review not found");
    }

    req.flash("success", "Review updated successfully!");
    res.redirect(`/listings/${id}`);
};

const deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    isLoggedIn,
    idReviewAuthor,
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);
};

router.put("/:reviewId", isLoggedIn, isReviewAuthor, validateReview, wrapAsync(updateReview));
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));
router.post("/:reviewId/update", isLoggedIn, isReviewAuthor, validateReview, wrapAsync(updateReview));
router.post("/:reviewId/delete", isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));
router.post("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res, next) => {
    // Backward-compatible handler for older forms that post to /:reviewId
    if (req.body && req.body.review) {
        validateReview(req, res, () => {});
        return updateReview(req, res);
    }

    if (req.body && req.body._method === "DELETE") {
        return deleteReview(req, res);
    }

    return next(new ExpressError(405, "Method Not Allowed"));
}));

module.exports = router;
