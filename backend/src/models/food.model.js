const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    video:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    foodPartner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner"
    },
    // Commerce fields
    price: {
        type: Number,
        default: 0
    },
    orderUrl: {
        type: String
    },
    // Discovery fields
    tags: [{ type: String }],
    cuisine: { type: String },
    likeCount:{
        type: Number,
        default: 0
    },
    saveCount:{
        type: Number,
        default: 0
    },
    // Ratings aggregates (denormalized for fast reads)
    averageRating: {
        type: Number,
        default: 0
    },
    ratingsCount: {
        type: Number,
        default: 0
    }
})

const foodModel = mongoose.model("food", foodSchema)
module.exports = foodModel