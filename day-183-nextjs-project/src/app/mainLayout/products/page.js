import ProductCard from '@/components/ProductCard';
import React from 'react'

const page = async () => {

  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();

  return (
      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          return <ProductCard key={product.id} product={product} />
        })}
      </div>
  )
};

export default page;
