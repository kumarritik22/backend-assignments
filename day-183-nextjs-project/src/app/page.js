import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {

  function rootPage() {
    redirect("/home")
  }

  return (
    <div>
      This is the Main Route.
    </div>
  )
}

export default page
