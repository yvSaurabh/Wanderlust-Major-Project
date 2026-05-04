const express = require("express");
const app  = express();
const mongoose = require("mongoose");
const path = require("path");


const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");

const Mongo_URL = 'mongodb://127.0.0.1:27017/Wanderlust';


main()
.then(()=>{
    console.log("Connected to MongoDB");

})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(Mongo_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const sessionOptions = {
    secret: "mysupersecertcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true,
    },
};
app.get("/", (req, res)=>{
    res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



// const validateListing = (req, res, next)=>{
//     let{error} = listingSchema.validate(req.body);
    
//     if(error){
//         let errMsg = error.details.map(el=> el.message).join(", ");
//         throw new ExpressError(400, errMsg);
//     } else{
//             next();
//         }
    
// };
app.get("/demoUser", async(req, res)=>{
    let fakeUser = new User({
        email: "student@123gmail.com",
        username: "delta-student",

    });
    let registerUser = await User.register(fakeUser, "helloworld");
    res.send(registerUser);
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter );

// const validateReview = (req, res, next)=>{
//     let{error} = reviewSchema.validate(req.body);
//     
//     if(error){
//         let errMsg = error.details.map(el=> el.message).join(", ");
//         throw new ExpressError(400, errMsg);
//     } else{
//             next();
//         }
//     
// };



// // index route to show all listings
// app.get("/listings", wrapAsync(async(req,res)=>{
//    const allListings = await Listing.find({});
//    res.render("listings/index",{allListings});
// }));

// // new route to show form to create new listing
// app.get("/listings/new",wrapAsync(async(req,res)=>{
//     res.render("listings/new");

// }));
// //show route
// app.get("/listings/:id", 
//     wrapAsync(async(req, res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show",{listing});
// }));


    
// // create route to add new listing to DB
// app.post("/listings", 
//     validateListing,
//     wrapAsync(async(req, res, next)=>{
//         const result = listingSchema.validate(req.body);
//         console.log(result);
//         if(result.error){
//             throw new ExpressError(400, error);
//         }
//         req.body.listing.image = normalizeListingImage(req.body.listing.image);
//         const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
//     })
    
// );
   
// // edit Route
// app.get("/listings/:id/edit", wrapAsync(async (req, res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});
// }));

// const updateListing = async (req, res) => {
//     let {id} = req.params;
//     req.body.listing.image = normalizeListingImage(req.body.listing.image);
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/listings/${id}`);
// };

// // Update Route
// app.put("/listings/:id",
//     validateListing,
//     wrapAsync(updateListing));
// app.post("/listings/:id",
//     validateListing,
//     wrapAsync(updateListing));

// const deleteListing = async (req, res) => {
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log("Deleted Listing:", deletedListing);
//     res.redirect("/listings");
// };

// // Delete Route
// app.delete("/listings/:id", wrapAsync(deleteListing));
// app.post("/listings/:id", wrapAsync(deleteListing));

// //Review Routes
// app.post("/listings/:id/reviews", 
//     validateReview,
//     wrapAsync(async(req,res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//
//     listing.reviews.push(newReview);
//
//     await newReview.save();
//     await listing.save();
//
//     console.log("new review added");
//     res.redirect(`/listings/${listing._id}`);
// }));
// //delete review function
// const deleteReview = async (req, res) => {
//     let {id, reviewId} = req.params;
//
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//
//     res.redirect(`/listings/${id}`);
// };
//
// // delete review route
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(deleteReview));
// app.post("/listings/:id/reviews/:reviewId", wrapAsync(deleteReview));


// app.get("/testListing", async(req,res)=>{
//     let SampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute,Goa",
//         country: "India",
//     });
//      await SampleListing.save();
//      console.log("Sample was saved");
//      res.send("Successful testing");

// });

app.all(/(.*)/, (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("listings/errors.ejs",{message});
    //res.status(statusCode).send(message);
}
);

app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
});
