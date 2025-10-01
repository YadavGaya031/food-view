const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodPartner.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }

    if (!process.env.SECRET_KEY) {
      console.error('SECRET_KEY environment variable is not set');
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({
        message: "email already exists.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      fullName,
      email,
      password: hashPassword,
    });

    await user.save();

    console.log('User registered successfully:', user.email);

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "user registered successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (!process.env.SECRET_KEY) {
      console.error('SECRET_KEY environment variable is not set');
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY
    );

    res.cookie("token", token, {
      httpOnly: true, // Not accessible via JS (more secure)
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in prod
      sameSite: "none", // Allows sending cookies on same-site and top-level cross-site navigations
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration (optional)
    });

    res.status(200).json({
      message: "user logged in successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "logged out successfully",
  });
}

async function registerFoodPartner(req, res) {
  const { fullName, email, password, phone, address, contactName } = req.body;

  const isEmailExists = await foodPartnerModel.findOne({ email });

  if (isEmailExists) {
    return res.status(400).json({
      message: "Food partner account already exists.",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const foodPartner = await foodPartnerModel.create({
    fullName,
    email,
    password: hashPassword,
    phone,
    address,
    contactName,
  });

  const token = jwt.sign(
    {
      id: foodPartner._id,
    },
    process.env.SECRET_KEY
  );

  res.cookie("token", token);

  console.log("food partner created:", foodPartner);
  res.status(201).json({
    message: "Food partner registered successfully",
    foodPartner: {
      _id: foodPartner._id,
      name: foodPartner.fullName,
      email: foodPartner.email,
    },
  });
}

async function loginFoodPartner(req, res) {
  const { email, password } = req.body;

  const foodPartner = await foodPartnerModel.findOne({ email });

  if (!foodPartner) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: foodPartner._id,
    },
    process.env.SECRET_KEY
  );

  res.cookie("token", token, {
    httpOnly: true, // Not accessible via JS (more secure)
    secure: true, // Only send over HTTPS in prod
    sameSite: "none", // Allows sending cookies on same-site and top-level cross-site navigations
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiration (optional)
  });

  res.status(200).json({
    message: "food partner logged in successfully.",
    foodPartner: {
      _id: foodPartner._id,
      fullName: foodPartner.fullName,
      email: foodPartner.email,
    },
  });
}

// async function logoutFoodPartner(req, res) {
//   res.clearCookie("token");
//   res.status(200).json({
//     message: "logged out successfully",
//   });
// }

module.exports = {
  registerUser,
  loginUser,
  logout,
  registerFoodPartner,
  loginFoodPartner,
  // logoutFoodPartner,
};
