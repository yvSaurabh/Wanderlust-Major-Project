const DEFAULT_LISTING_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

const normalizeListingImage = (image = {}) => {
  if (typeof image === "string") {
    return {
      filename: "listingimage",
      url: normalizeImageUrl(image),
    };
  }

  return {
    filename: image.filename || "listingimage",
    url: normalizeImageUrl(image.url),
  };
};

const normalizeImageUrl = (url) => {
  if (!url || typeof url !== "string") {
    return DEFAULT_LISTING_IMAGE;
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return DEFAULT_LISTING_IMAGE;
  }

  return trimmedUrl;
};

module.exports = {
  DEFAULT_LISTING_IMAGE,
  normalizeImageUrl,
  normalizeListingImage,
};
