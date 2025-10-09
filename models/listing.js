const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingShema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
   url: String,
   filename: String,
  },
  price: Number,
  location: String,
  country: String,

  geometry: { lat: Number, lng: Number },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
   owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
   },
   category: {
    type: String,
    enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms"],
   },
});

listingShema.post("findOneAndDelete", async(listing) => {
  if(listing) {
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingShema);
module.exports = Listing;

