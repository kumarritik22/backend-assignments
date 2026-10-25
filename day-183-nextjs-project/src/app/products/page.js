import React from 'react'

const page = async () => {

  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();

  console.log(products);

  return (
    <div>
      <h1>This is Product Page.</h1>
    </div>
  )
}

export default page
