const mongoose = require('mongoose')

const foodPartnerSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    contactName:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    textAddress:{
        type: String,
        default: ''
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [lng, lat]
            default: [0, 0]
        }
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
},  {
        timestamps:true
    }
)

// 2dsphere index for geospatial queries
foodPartnerSchema.index({ location: '2dsphere' })

const foodPartnerModel = mongoose.model("foodPartner", foodPartnerSchema);

module.exports = foodPartnerModel