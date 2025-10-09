// updateOldListings.js
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const axios = require("axios");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Sleep function to avoid API rate limits
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateListings() {
  try {
    // Find listings with missing or incomplete geometry
    const listings = await Listing.find({
      $or: [
        { geometry: { $exists: false } },
        { "geometry.lat": { $exists: false } },
        { "geometry.lng": { $exists: false } }
      ]
    });

    console.log(`Found ${listings.length} listings to update...`);

    for (let listing of listings) {
      if (!listing.location || !listing.country) {
        console.log(`Skipping: ${listing.title} (missing location or country)`);
        continue;
      }

      try {
        // Query Nominatim API
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: `${listing.location}, ${listing.country}`, // more precise
            format: "json",
            limit: 1
          },
          headers: {
            "User-Agent": "WanderlustApp/1.0 (your-email@example.com)"
          },
          timeout: 5000 // optional, 5 sec timeout
        });

        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          listing.geometry = { lat: parseFloat(lat), lng: parseFloat(lon) };
          await listing.save();
          console.log(`Updated: ${listing.title} → (${lat}, ${lon})`);
        } else {
          console.log(`No coordinates found for: ${listing.title}`);
        }

        // Wait 1.2 seconds before next request to avoid rate-limiting
        await sleep(1200);

      } catch (err) {
        console.error(`Error geocoding ${listing.title}: ${err.message}`);
      }
    }

    console.log("All listings updated!");
    mongoose.connection.close();

  } catch (err) {
    console.error("Error updating listings:", err);
    mongoose.connection.close();
  }
}

// Run the update
updateListings();
