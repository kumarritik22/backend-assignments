import { useState } from 'react'
import { useParams } from 'react-router'
import { useProduct } from '../hooks/useProduct'
import { useEffect } from 'react'

const SellerProductDetails = () => {

    const [product, setProduct] = useState(null)

    const {productId} = useParams()

    const {handleGetProductById} = useProduct()

    async function fetchProductDetails() {
        const data = await handleGetProductById(productId)
        setProduct(data)
    }

    useEffect(() => {
      fetchProductDetails()
    }, [productId])

    console.log(product);
    

  return (
    <div>
      SellerProductDetails
    </div>
  )
}

export default SellerProductDetails
