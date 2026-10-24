import React from 'react'

const page = async () => {

    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();

    console.log(data);

  return (
    <div className='p-5'>
      <h1 className='mb-5'>Products are listed below:-</h1>

      <div>
        {
            data.map((elem) => {
                return <h1>{elem.title}</h1>
            })
        }
      </div>
    </div>
  )
}

export default page
