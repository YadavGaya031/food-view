import { useEffect } from 'react'
import { addToCart, clearCart } from '../lib/ordersApi'

export default function CartListener({ onChange }) {
  useEffect(() => {
    const handler = async (e) => {
      const { foodId } = e.detail || {}
      if (!foodId) return
      try {
        const cart = await addToCart(foodId, 1)
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }))
        window.dispatchEvent(new Event('open-cart'))
        onChange && onChange(cart)
      } catch (err) {
        if (err?.response?.status === 401) {
          window.location.href = '/user/login'
          return
        }
        if (err?.response?.status === 400 && /another partner/i.test(err?.response?.data?.message || '')) {
          const proceed = window.confirm('Your cart has items from another partner. Clear cart and add this item?')
          if (proceed) {
            await clearCart()
            const cart = await addToCart(foodId, 1)
            window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }))
            window.dispatchEvent(new Event('open-cart'))
            onChange && onChange(cart)
          }
          return
        }
        console.error('Add to cart failed', err)
        alert('Could not add to cart. Please try again.')
      }
    }
    window.addEventListener('add-to-cart', handler)
    return () => window.removeEventListener('add-to-cart', handler)
  }, [onChange])
  return null
}


