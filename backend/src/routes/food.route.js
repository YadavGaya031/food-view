const express = require("express");
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single('video'),
  foodController.createFood
);

router.get("/", authMiddleware.authUserMiddleWare, foodController.getFoodItems);

router.post(
  "/like",
  authMiddleware.authUserMiddleWare,
  foodController.likeFood
);

router.post("/save", authMiddleware.authUserMiddleWare, foodController.saveFood);

router.get("/save", authMiddleware.authUserMiddleWare, foodController.getSavedFoods);

module.exports = router;
