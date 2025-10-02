const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const CommentModel = require("../models/comment.model");
const RatingModel = require("../models/rating.model");

const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  const fileUpload = await storageService.uploadFile(req.file.buffer, uuid());
  console.log(fileUpload)
  const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUpload.url,
    foodPartner: req.foodPartner._id,
    price: req.body.price || 0,
    orderUrl: req.body.orderUrl,
    tags: req.body.tags || [],
    cuisine: req.body.cuisine,
  });
  res.status(201).json({
    Message: "food created successfully",
    food: foodItem,
    // foodPartnerId: req.foodPartner._id
  });
}

async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({});
  console.log(foodItems);
  res.status(200).json({
    message: "food items fetched successfully.",
    foodItems,
  });
}

async function getFoodItemsByPartner(req, res) {
  const { partnerId } = req.params;
  const foodItems = await foodModel.find({ foodPartner: partnerId });
  res.status(200).json({
    message: "food items fetched successfully.",
    foodItems,
  });
}

async function likeFood(req, res) {
  const foodId = req.body.foodId;
  const user = req.user;

  const isAlreadyLiked = await likeModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (isAlreadyLiked) {
    await likeModel.findByIdAndDelete(isAlreadyLiked._id);

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { likeCount: -1 },
    });

    return res.status(200).json({
      message: "food unliked successfully",
      like: false,
    });
  }

  const like = await likeModel.create({
    user: user._id,
    food: foodId,
  });

  await foodModel.findByIdAndUpdate(foodId, {
    $inc: { likeCount: 1 },
  });

  res.status(201).json({
    message: "food liked successfully",
    like: true,
  });
}

async function saveFood(req, res) {
  const foodId = req.body.foodId;
  const user = req.user;
  // check if already saved
  const isAlreadySaved = await saveModel.findOne({
    user: user._id,
    food: foodId,
  });
  if (isAlreadySaved) {
    await saveModel.findByIdAndDelete(isAlreadySaved._id);

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { saveCount: -1 },
    });

    return res.status(200).json({
      message: "food unsaved successfully",
      save: false,
    });
  }

  const save = await saveModel.create({
    user: user._id,
    food: foodId,
  });

  await foodModel.findByIdAndUpdate(foodId, {
    $inc: { saveCount: 1 },
  });

  res.status(201).json({
    message: "food saved successfully",
    save: true,
  });
}

async function getSavedFoods(req, res) {
  const user = req.user;
  const savedFoods = await saveModel.find({ user: user._id }).populate("food");
  if (!savedFoods || savedFoods.length === 0) {
    return res.status(404).json({
      message: "No saved foods found",
    });
  }
  res.status(200).json({
    message: "saved foods fetched successfully",
    savedFoods: savedFoods.map((item) => item.food), // Extract only the food items
  });
}

// Social: comments
async function addComment(req, res) {
  try {
    const user = req.user;
    const { foodId, text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: "comment text is required" });
    }
    
    if (!user || !user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    console.log('Adding comment by user:', user._id, 'for food:', foodId);
    
    const comment = await CommentModel.create({ user: user._id, food: foodId, text });
    res.status(201).json({ message: "comment added", comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function listComments(req, res) {
  try {
    const { foodId } = req.params;
    console.log('Fetching comments for food:', foodId);
    
    const comments = await CommentModel.find({ food: foodId }).populate("user", "fullName").sort({ createdAt: -1 });
    
    console.log('Comments found:', comments.length);
    comments.forEach(comment => {
      console.log('Comment by:', comment.user?.fullName || 'Unknown user');
    });
    
    res.status(200).json({ message: "comments fetched", comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Social: ratings
async function rateFood(req, res) {
  const user = req.user;
  const { foodId, stars } = req.body;
  if (!(stars >= 1 && stars <= 5)) {
    return res.status(400).json({ message: "stars must be between 1 and 5" });
  }
  // upsert user's rating
  const existing = await RatingModel.findOneAndUpdate(
    { user: user._id, food: foodId },
    { $set: { stars } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // recompute aggregates
  const agg = await RatingModel.aggregate([
    { $match: { food: new require('mongoose').Types.ObjectId(foodId) } },
    { $group: { _id: "$food", average: { $avg: "$stars" }, count: { $sum: 1 } } }
  ]);
  const average = agg.length ? agg[0].average : 0;
  const count = agg.length ? agg[0].count : 0;
  await foodModel.findByIdAndUpdate(foodId, { averageRating: average, ratingsCount: count });

  res.status(200).json({ message: "rating saved", rating: existing, average, count });
}

async function getRatingSummary(req, res) {
  const { foodId } = req.params;
  const food = await foodModel.findById(foodId).select("averageRating ratingsCount");
  res.status(200).json({ message: "rating summary", average: food?.averageRating || 0, count: food?.ratingsCount || 0 });
}

module.exports = {
  createFood,
  getFoodItems,
  getFoodItemsByPartner,
  likeFood,
  saveFood,
  getSavedFoods,
  addComment,
  listComments,
  rateFood,
  getRatingSummary,
};
