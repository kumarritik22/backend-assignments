import ProtectedRoute from '@/components/ProtectedRoute';
import React from 'react'

const page = async ({ params }) => {

    const { id } = await params;

    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const productDetails = await res.json();

  return (
    <ProtectedRoute>
      <div>
        <h1>{productDetails.title}</h1>
      </div>
    </ProtectedRoute>
  )
}

export default page;
