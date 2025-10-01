import api from './api'

export const getCart = () => api.get('/api/orders/cart').then(r => r.data.cart)
export const addToCart = (foodId, quantity = 1) => api.post('/api/orders/cart/items', { foodId, quantity }).then(r => r.data.cart)
export const updateCartItem = (itemId, quantity) => api.patch('/api/orders/cart/items', { itemId, quantity }).then(r => r.data.cart)
export const removeCartItem = (itemId) => api.delete(`/api/orders/cart/items/${itemId}`).then(r => r.data.cart)
export const clearCart = () => api.delete('/api/orders/cart')

export const createOrder = () => api.post('/api/orders').then(r => r.data)
export const getMyOrders = () => api.get('/api/orders/me').then(r => r.data.orders)


