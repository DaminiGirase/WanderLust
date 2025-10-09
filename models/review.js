const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

// const del = async() => {
//     await Review.deleteMany({_id: {$in: ['68ceec89fe7da5b3b9419188']}})
// };

// del();