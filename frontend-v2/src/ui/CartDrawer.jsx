import React, { useEffect, useState } from 'react'
import { getCart, updateCartItem, removeCartItem, clearCart, createOrder } from '../lib/ordersApi'

export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const [cart, setCart] = useState({ items: [], subtotal: 0, taxPercent: 7, taxAmount: 0, total: 0 })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try { setCart(await getCart()) } catch (e) {}
  }
  useEffect(() => { load() }, [])
  useEffect(() => {
    const onUpdated = (e) => setCart(e.detail?.cart || cart)
    const onOpen = () => setOpen(true)
    window.addEventListener('cart-updated', onUpdated)
    window.addEventListener('open-cart', onOpen)
    return () => {
      window.removeEventListener('cart-updated', onUpdated)
      window.removeEventListener('open-cart', onOpen)
    }
  }, [cart])

  const inc = async (id, q) => {
    try { setCart(await updateCartItem(id, q)) } catch (e) { if (e?.response?.status === 401) window.location.href = '/user/login' }
  }
  const del = async (id) => {
    try { setCart(await removeCartItem(id)) } catch (e) { if (e?.response?.status === 401) window.location.href = '/user/login' }
  }
  const clear = async () => { await clearCart(); load() }

  const checkout = async () => {
    setLoading(true)
    try {
      const { order, razorpayOrder, keyId } = await createOrder()
      const options = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Food View',
        description: 'Order payment',
        order_id: razorpayOrder.id,
        handler: function () {
          // rely on webhook; simple thank you
          alert('Payment initiated. We will confirm shortly!')
          clear()
        },
        theme: { color: '#0ea5e9' }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      if (e?.response?.status === 401) window.location.href = '/user/login'
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-24 right-4 z-60 rounded-full bg-blue-600 text-white px-4 py-3 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30">Cart ({cart.items?.length || 0})</button>
      {open && (
        <div className="fixed inset-0 z-60 flex">
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative h-full w-[92vw] sm:w-[420px] bg-slate-950 text-slate-100 shadow-2xl border-l border-slate-800">
            <div className="sticky top-0 z-10 p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/95 backdrop-blur">
              <h3 className="text-lg font-semibold tracking-tight">Your Cart</h3>
              <button onClick={() => setOpen(false)} className="rounded-lg border border-slate-700 px-2 py-1 hover:bg-slate-900">Close</button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-200px)]">
              {cart.items?.map((it) => (
                <div key={it._id} className="flex items-center justify-between rounded-xl border border-slate-800 p-3 bg-slate-900/60">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate max-w-[12rem]">{it.name}</div>
                    <div className="text-xs text-slate-400">₹ {it.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => inc(it._id, Math.max(1, (it.quantity || 1) - 1))} className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-700 hover:bg-slate-900">-</button>
                    <span className="w-6 text-center">{it.quantity}</span>
                    <button onClick={() => inc(it._id, (it.quantity || 1) + 1)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-700 hover:bg-slate-900">+</button>
                    <button onClick={() => del(it._id)} className="ml-2 h-8 px-3 inline-flex items-center justify-center rounded-lg border border-red-700 text-red-400 hover:bg-red-950/30">Remove</button>
                  </div>
                </div>
              ))}
              {(!cart.items || cart.items.length === 0) && (
                <div className="text-sm text-slate-400">Your cart is empty.</div>
              )}
            </div>
            <div className="sticky bottom-0 p-4 pb-6 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
              <div className="text-sm flex justify-between"><span>Subtotal</span><span>₹ {cart.subtotal?.toFixed?.(2) || '0.00'}</span></div>
              <div className="text-sm flex justify-between"><span>Tax ({cart.taxPercent || 7}%)</span><span>₹ {cart.taxAmount?.toFixed?.(2) || '0.00'}</span></div>
              <div className="text-base font-semibold flex justify-between mt-1"><span>Total</span><span>₹ {cart.total?.toFixed?.(2) || '0.00'}</span></div>
              <div className="mt-3 flex gap-2">
                <button onClick={clear} className="rounded-xl border border-slate-700 px-3 py-2 hover:bg-slate-900">Clear</button>
                <button onClick={checkout} disabled={loading || (cart.items?.length || 0) === 0} className="rounded-xl bg-blue-600 px-3 py-2 text-white disabled:opacity-50 hover:brightness-110">{loading ? 'Processing…' : 'Pay with Razorpay'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


