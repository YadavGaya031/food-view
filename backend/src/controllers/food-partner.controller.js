const foodPartnerModel = require("../models/foodPartner.model");
const foodModel = require("../models/food.model");

async function getFoodPartnerById(req, res){
    try {
        const foodPartnerId = req.params.id;
        const foodPartner = await foodPartnerModel.findById(foodPartnerId);
        
        if(!foodPartner){
            return res.status(404).json({
                message: "food partner not found"
            })
        }
        
        const fooditemsByFoodPartner = await foodModel.find({foodPartner: foodPartnerId});
        
        res.status(200).json({
            message: "food partner fetched successfully",
            foodPartner: {
                ...foodPartner.toObject(),
                foodItems: fooditemsByFoodPartner
            }
        })
    } catch (error) {
        console.error('Error in getFoodPartnerById:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function updateLocation(req, res) {
    const partner = req.foodPartner;
    const { lat, lng } = req.body;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
        return res.status(400).json({ message: "lat and lng must be numbers" });
    }
    const updated = await foodPartnerModel.findByIdAndUpdate(partner._id, {
        location: { type: 'Point', coordinates: [lng, lat] }
    }, { new: true });
    res.status(200).json({ message: "location updated", partner: updated });
}

async function nearbyPartners(req, res) {
    const { lat, lng, radiusMeters = 5000 } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({ message: "lat and lng are required" });
    }
    const partners = await foodPartnerModel.find({
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                $maxDistance: parseInt(radiusMeters)
            }
        }
    });
    res.status(200).json({ message: "nearby partners", partners });
}

async function searchPartnersByText(req, res) {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "search query is required" });
        }
        
        const partners = await foodPartnerModel.find({
            $or: [
                { fullName: { $regex: query, $options: 'i' } },
                { address: { $regex: query, $options: 'i' } }
            ]
        });
        
        res.status(200).json({ message: "partners found", partners });
    } catch (error) {
        console.error('Error in searchPartnersByText:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function testConnection(req, res) {
    try {
        const count = await foodPartnerModel.countDocuments();
        res.status(200).json({ 
            message: "Database connection successful", 
            totalPartners: count,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Database connection test failed:', error);
        res.status(500).json({ 
            message: "Database connection failed", 
            error: error.message 
        });
    }
}

module.exports = {
    getFoodPartnerById,
    updateLocation,
    nearbyPartners,
    searchPartnersByText,
    testConnection
}