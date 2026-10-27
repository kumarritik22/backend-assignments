import ProtectedRoute from '@/components/ProtectedRoute';
import React from 'react'

const page = async ({ params }) => {

    const { id } = await params;

  return (
    <ProtectedRoute>
      <div>
        <h1>This is the Product details page - {id}</h1>
      </div>
    </ProtectedRoute>
  )
}

export default page;
