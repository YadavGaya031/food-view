const Cart = require('../models/cart.model')
const Order = require('../models/order.model')
const Food = require('../models/food.model')
const Razorpay = require('razorpay')
const crypto = require('crypto')

const TAX_PERCENT = 7

function getRazorpayInstance() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

async function recalcCart(cart) {
  let subtotal = 0
  for (const item of cart.items) {
    const food = await Food.findById(item.food)
    if (!food) throw new Error('Food not found in cart recalculation')
    item.name = food.name
    item.price = food.price || 0
    subtotal += item.price * item.quantity
  }
  cart.subtotal = subtotal
  cart.taxPercent = TAX_PERCENT
  cart.taxAmount = Math.round((subtotal * TAX_PERCENT) * 100) / 100 / 100 * 100 // keep to 2 decimals
  cart.taxAmount = +(subtotal * (TAX_PERCENT / 100)).toFixed(2)
  cart.total = +(subtotal + cart.taxAmount).toFixed(2)
}

// CART
async function getCart(req, res) {
  const cart = await Cart.findOne({ user: req.user._id })
  return res.status(200).json({ cart: cart || { items: [], subtotal: 0, taxPercent: TAX_PERCENT, taxAmount: 0, total: 0 } })
}

async function addItem(req, res) {
  const { foodId, quantity = 1 } = req.body
  const food = await Food.findById(foodId)
  if (!food) return res.status(404).json({ message: 'food not found' })
  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [], partner: food.foodPartner })
  if (cart.partner && String(cart.partner) !== String(food.foodPartner)) {
    return res.status(400).json({ message: 'Cart contains items from another partner. Please checkout or clear cart.' })
  }
  cart.partner = food.foodPartner
  const existing = cart.items.find(i => String(i.food) === String(foodId))
  if (existing) existing.quantity += quantity
  else cart.items.push({ food: food._id, partner: food.foodPartner, name: food.name, price: food.price || 0, quantity })
  await recalcCart(cart)
  await cart.save()
  res.status(200).json({ cart })
}

async function updateItem(req, res) {
  const { itemId, quantity } = req.body
  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return res.status(404).json({ message: 'cart not found' })
  const item = cart.items.id(itemId)
  if (!item) return res.status(404).json({ message: 'item not found' })
  item.quantity = Math.max(1, quantity)
  await recalcCart(cart)
  await cart.save()
  res.status(200).json({ cart })
}

async function removeItem(req, res) {
  const { itemId } = req.params
  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return res.status(404).json({ message: 'cart not found' })
  cart.items.id(itemId)?.deleteOne()
  if (cart.items.length === 0) cart.partner = undefined
  await recalcCart(cart)
  await cart.save()
  res.status(200).json({ cart })
}

async function clearCart(req, res) {
  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return res.status(200).json({ message: 'cleared' })
  cart.items = []
  cart.partner = undefined
  await recalcCart(cart)
  await cart.save()
  res.status(200).json({ message: 'cleared' })
}

// ORDERS
async function createOrder(req, res) {
  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'cart empty' })
  await recalcCart(cart)
  await cart.save()

  const orderDoc = await Order.create({
    user: req.user._id,
    partner: cart.partner,
    items: cart.items.map(i => ({ food: i.food, name: i.name, price: i.price, quantity: i.quantity })),
    subtotal: cart.subtotal,
    taxPercent: cart.taxPercent,
    taxAmount: cart.taxAmount,
    total: cart.total,
    currency: 'INR',
    status: 'PENDING'
  })

  const razorpay = getRazorpayInstance()
  const rpOrder = await razorpay.orders.create({
    amount: Math.round(orderDoc.total * 100),
    currency: 'INR',
    receipt: String(orderDoc._id)
  })
  orderDoc.razorpay_order_id = rpOrder.id
  await orderDoc.save()

  res.status(201).json({ order: orderDoc, razorpayOrder: rpOrder, keyId: process.env.RAZORPAY_KEY_ID })
}

async function webhook(req, res) {
  const signature = req.headers['x-razorpay-signature']
  const body = JSON.stringify(req.body)
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(body).digest('hex')
  if (signature !== expected) return res.status(400).json({ message: 'invalid signature' })

  const event = req.body
  if (event.event === 'payment.captured') {
    const rpOrderId = event.payload.payment.entity.order_id
    const paymentId = event.payload.payment.entity.id
    const order = await Order.findOne({ razorpay_order_id: rpOrderId })
    if (order) {
      order.status = 'PAID'
      order.razorpay_payment_id = paymentId
      await order.save()
    }
  }
  res.status(200).json({ status: 'ok' })
}

async function myOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.status(200).json({ orders })
}

async function partnerOrders(req, res) {
  const orders = await Order.find({ partner: req.foodPartner._id }).sort({ createdAt: -1 })
  res.status(200).json({ orders })
}

async function updateStatus(req, res) {
  const { id } = req.params
  const { status } = req.body
  const allowed = ['CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']
  if (!allowed.includes(status)) return res.status(400).json({ message: 'invalid status' })
  const order = await Order.findOne({ _id: id, partner: req.foodPartner._id })
  if (!order) return res.status(404).json({ message: 'order not found' })
  order.status = status
  await order.save()
  res.status(200).json({ order })
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart, createOrder, webhook, myOrders, partnerOrders, updateStatus }


