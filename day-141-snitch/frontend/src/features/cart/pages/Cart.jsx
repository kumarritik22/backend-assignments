import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hooks/useCart'

const Cart = () => {

    const cartItems = useSelector(state => state.cart.items)

    const { handleGetCart } = useCart();

    useEffect(() => {
      handleGetCart();
    }, [])
    
    console.log(cartItems);

  return (
    <div>
      Cart
    </div>
  )
}

export default Cart
