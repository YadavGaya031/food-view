const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.middleware')
const orders = require('../controllers/orders.controller')

// cart
router.get('/cart', auth.authUserMiddleWare, orders.getCart)
router.post('/cart/items', auth.authUserMiddleWare, orders.addItem)
router.patch('/cart/items', auth.authUserMiddleWare, orders.updateItem)
router.delete('/cart/items/:itemId', auth.authUserMiddleWare, orders.removeItem)
router.delete('/cart', auth.authUserMiddleWare, orders.clearCart)

// orders
router.post('/', auth.authUserMiddleWare, orders.createOrder)
router.get('/me', auth.authUserMiddleWare, orders.myOrders)

// partner board
router.get('/partner/me', auth.authFoodPartnerMiddleware, orders.partnerOrders)
router.patch('/:id/status', auth.authFoodPartnerMiddleware, orders.updateStatus)

// webhook
router.post('/payments/razorpay/webhook', express.raw({ type: '*/*' }), orders.webhook)

module.exports = router


