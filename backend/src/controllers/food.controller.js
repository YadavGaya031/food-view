const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");

const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  const fileUpload = await storageService.uploadFile(req.file.buffer, uuid());
  console.log(fileUpload)
  const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUpload.url,
    foodPartner: req.foodPartner._id,
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
    like,
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
    save,
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

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSavedFoods,
};
