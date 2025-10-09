const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.listingCategory = async (req, res) => {
  const category = req.query.category; 
  let allListings = [];
  if (category) {
    allListings = await Listing.find({ category }); 
  }
  res.render("listings/category", { allListings, category });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner").populate("category");
   
  if (!listing) {
    req.flash("error", "Listing does not exists");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

module.exports.creatListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  if (newListing.location) {
    const locationQuery = encodeURIComponent(newListing.location);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${locationQuery}`
    );
    const data = await response.json();
    if (data.length > 0) {
      newListing.geometry = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    } else {
      console.log("Location not found, geometry not set");
    }
  }

  await newListing.save();
  req.flash("success", "New Listing created");
  res.redirect("/listings");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exists");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/h_300,w_250,c_fill"
  );

  res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing is Deleted");
  res.redirect("/listings");
};
