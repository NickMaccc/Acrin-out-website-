import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = `${action.payload.id}-${action.payload.size}-${action.payload.color}`
      const existing = state.items.find((i) => i.cartKey === key)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.cartKey === key ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, cartKey: key, qty: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.cartKey !== action.payload) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.cartKey === action.payload.cartKey
            ? { ...i, qty: Math.max(1, action.payload.qty) }
            : i
        ),
      }
    case 'CLEAR_CART':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem = (product, size, color) =>
    dispatch({ type: 'ADD_ITEM', payload: { ...product, size, color } })

  const removeItem = (cartKey) =>
    dispatch({ type: 'REMOVE_ITEM', payload: cartKey })

  const updateQty = (cartKey, qty) =>
    dispatch({ type: 'UPDATE_QTY', payload: { cartKey, qty } })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
