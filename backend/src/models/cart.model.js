const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'food', required: true },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'foodPartner', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1, min: 1 }
}, { _id: true })

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'foodPartner' },
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0 },
    taxPercent: { type: Number, default: 7 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('cart', cartSchema)


