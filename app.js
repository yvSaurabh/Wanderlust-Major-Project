const express = require("express");
const app  = express();
const mongoose = require("mongoose");
const path = require("path");

const Mongo_URL = 'mongodb://127.0.0.1:27017/Wanderlust';
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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

app.get("/", (req, res)=>{
    res.send("Hi, I am root");
});
// index route to show all listings
app.get("/listings", async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index",{allListings});
});

// new route to show form to create new listing
app.get("/listings/new", (req,res)=>{
    res.render("listings/new");

});
//show route
app.get("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show",{listing});
});
    
// create route to add new listing to DB
app.post("/listings", async(req, res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});
   
// edit Route
app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

// Update Route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);
    res.redirect("/listings");
});


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

app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
});