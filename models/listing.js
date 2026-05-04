const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const { DEFAULT_LISTING_IMAGE, normalizeImageUrl } = require("../utils/image.js");

const ListingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        filename: {
        type: String,
        default: "listingimage"
  },
    url: {
      type: String,
      default: DEFAULT_LISTING_IMAGE,
    set: (v) =>
      normalizeImageUrl(v)
   }
 },
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
});
ListingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({ _id : {$in: listing.reviews}  });
  }

});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
