const express = require("express");
const foodPartnerController = require("../controllers/food-partner.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// partner updates own location
router.post(
  "/me/location",
  authMiddleware.authFoodPartnerMiddleware,
  foodPartnerController.updateLocation
);

// public nearby partners
router.get(
  "/nearby/search",
  authMiddleware.authUserMiddleWare,
  foodPartnerController.nearbyPartners
);

// public text-based search
router.get(
  "/search",
  foodPartnerController.searchPartnersByText
);

// test database connection
router.get(
  "/test",
  foodPartnerController.testConnection
);

// This must come AFTER all specific routes
router.get(
  "/:id",
  foodPartnerController.getFoodPartnerById
);

module.exports = router;
