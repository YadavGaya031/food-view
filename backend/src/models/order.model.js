const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'food', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
}, { _id: true })

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'foodPartner', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    taxPercent: { type: Number, default: 7 },
    taxAmount: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['PENDING', 'PAID', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('order', orderSchema)


