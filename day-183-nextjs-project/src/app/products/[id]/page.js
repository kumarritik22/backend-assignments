import React from 'react'

const page = async ({ params }) => {

    const { id } = await params;

  return (
    <div>
      <h1>This is the Product details page - {id}</h1>
    </div>
  )
}

export default page;
