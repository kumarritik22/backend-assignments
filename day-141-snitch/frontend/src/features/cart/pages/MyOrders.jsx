import { useEffect } from "react"
import { useCart } from "../hooks/useCart.js"
import { useState } from "react"

const MyOrders = () => {

    const { handleGetUserOrders } = useCart()

    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [Error, setError] = useState("")

    const fetchOrders = async () => {
      try {
        const data = await handleGetUserOrders()
        if (data.success) {
          setOrders(data.orders)
        }
      } catch (error) {
        setError("Unable to fetch orders.")
      } finally {
        setIsLoading(false)
      }
    }

    useEffect(() => {
      fetchOrders()
    }, [])
    

  return (
    <div>
      MyOrders
    </div>
  )
}

export default MyOrders
