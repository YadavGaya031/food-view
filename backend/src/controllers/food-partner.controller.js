const foodPartnerModel = require("../models/foodPartner.model");
const foodModel = require("../models/food.model");

async function getFoodPartnerById(req, res){
    const foodPartnerId = req.params.id;
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);
    const fooditemsByFoodPartner = await foodModel.find({foodPartner: foodPartnerId});
    foodPartner.foodItems = fooditemsByFoodPartner;

    if(!foodPartner){
        return res.status(404).json({
            message: "food partner not found"
        })
    }
    res.status(200).json({
        message: "food partner fetched successfully",
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: fooditemsByFoodPartner
        }
    })
}

module.exports = {
    getFoodPartnerById
}