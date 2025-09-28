const foodPartnerModel = require("../models/foodPartner.model");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

async function authFoodPartnerMiddleware(req, res, next) {
  const token = req.cookies.token;
  console.log("Food Partner Auth Middleware Token:", token); // <- add this
  if (!token) {
    return res.status(401).json({
      message: "unauthorized access",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const foodPartner = await foodPartnerModel.findById(decoded.id);

    if (!foodPartner) {
      return res.status(401).json({
        message: "food partner not found !",
      });
    }

    req.foodPartner = foodPartner;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}

async function authUserMiddleWare(req, res, next) {
  const token = req.cookies.token;
  console.log("Auth Middleware Token:", token); // <- add this
  if (!token) {
    return res.status(401).json({
      message: "Please Login First",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await UserModel.findById(decoded.id);
     if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    console.log("Authenticated User:", user); // <- add this
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}

module.exports = {
  authFoodPartnerMiddleware,
  authUserMiddleWare,
};
