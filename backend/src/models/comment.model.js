const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

const CommentModel = mongoose.model("comment", commentSchema);
module.exports = CommentModel;


