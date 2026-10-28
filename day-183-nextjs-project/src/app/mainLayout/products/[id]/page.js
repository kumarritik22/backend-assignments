import React from 'react'

const page = async ({ params }) => {

    const { id } = await params;

    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const productDetails = await res.json();

  return (
      <div>
        <h1>{productDetails.title}</h1>
      </div>
  )
}

export default page;
