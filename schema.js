const Joi = require("joi");

const directImageUrlSchema = Joi.string()
    .allow("", null)
    .custom((value, helpers) => {
        if (!value) return value;

        try {
            const parsedUrl = new URL(value);

            if (
                parsedUrl.hostname === "unsplash.com" &&
                parsedUrl.pathname.startsWith("/photos/")
            ) {
                return helpers.error("string.directImageUrl");
            }
        } catch (err) {
            return helpers.error("string.uri");
        }

        return value;
    })
    .messages({
        "string.directImageUrl": "Please paste a direct image URL. Unsplash page links like unsplash.com/photos/... will not display inside listings.",
        "string.uri": "Please enter a valid image URL.",
    });

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: directImageUrlSchema,
            filename: Joi.string().allow("", null),
        }).required(),

    }).required(),
    _method: Joi.string().optional(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});
