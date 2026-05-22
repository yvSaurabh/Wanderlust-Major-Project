const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

router.put(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    validateReview,
    wrapAsync(reviewController.updateReview)
);

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

router.post(
    "/:reviewId/update",
    isLoggedIn,
    isReviewAuthor,
    validateReview,
    wrapAsync(reviewController.updateReview)
);

router.post(
    "/:reviewId/delete",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;
