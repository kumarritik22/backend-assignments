import React from 'react'

const page = async ({ params }) => {

  const { id } = await params;  

  return (
    <div>
      <h1>This is Dynamic Routing in Next.js - { id } </h1>
    </div>
  )
}

export default page
