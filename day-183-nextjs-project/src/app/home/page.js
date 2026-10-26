import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute>
      <div>
        <h1>This is Home Page.</h1>
      </div>
    </ProtectedRoute>
  )
}

export default page;
