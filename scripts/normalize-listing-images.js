const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { normalizeListingImage } = require("../utils/image.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);

  const listings = await Listing.find({});
  let updatedCount = 0;

  for (const listing of listings) {
    const normalizedImage = normalizeListingImage(listing.image);

    const changed =
      !listing.image ||
      listing.image.url !== normalizedImage.url ||
      listing.image.filename !== normalizedImage.filename;

    if (!changed) {
      continue;
    }

    listing.image = normalizedImage;
    await listing.save();
    updatedCount += 1;
  }

  console.log(`Normalized ${updatedCount} listing image records.`);
  await mongoose.connection.close();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.connection.close();
  process.exit(1);
});
