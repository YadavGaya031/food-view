const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: true
    },
    stars: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
}, { timestamps: true })

ratingSchema.index({ user: 1, food: 1 }, { unique: true })

const RatingModel = mongoose.model("rating", ratingSchema);
module.exports = RatingModel;


