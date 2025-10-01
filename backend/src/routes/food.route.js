const express = require("express");
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/create-food",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single('video'),
  foodController.createFood
);

// Public feed
router.get("/", foodController.getFoodItems);

// Public feed by partner
router.get("/partner/:partnerId", foodController.getFoodItemsByPartner);

router.post(
  "/like",
  authMiddleware.authUserMiddleWare,
  foodController.likeFood
);

router.post("/save", authMiddleware.authUserMiddleWare, foodController.saveFood);

router.get("/save", authMiddleware.authUserMiddleWare, foodController.getSavedFoods);

// comments
router.post("/comment", authMiddleware.authUserMiddleWare, foodController.addComment);
// Public comments listing
router.get("/:foodId/comments", foodController.listComments);

// ratings
router.post("/rate", authMiddleware.authUserMiddleWare, foodController.rateFood);
// Public rating summary
router.get("/:foodId/rating", foodController.getRatingSummary);

module.exports = router;
