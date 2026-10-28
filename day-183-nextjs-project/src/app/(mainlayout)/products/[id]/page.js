import React from 'react'

const page = async ({ params }) => {

    const { id } = await params;

    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const productDetails = await res.json();

    if (!productDetails || !productDetails.id) {
      return (
        <div className="p-8 text-center">
          <h1 className="text-xl font-bold">Product not found.</h1>
        </div>
      )
    }

  return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">{productDetails.title}</h1>
      </div>
  )
}

export default page;
