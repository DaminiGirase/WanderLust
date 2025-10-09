const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then((res) => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const categories = ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms"];

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj, index) => ({
    ...obj,
    owner: "68db548788927527864c703d",
    category: obj.category || categories[index % categories.length], 
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
