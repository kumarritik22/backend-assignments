import Link from 'next/link'
import React from 'react'

const MainNav = () => {
  return (
    <div className="flex gap-5">
      <Link href={"/mainlayout/home"}>Home</Link>
      <Link href={"/mainlayout/about"}>About</Link>
      <Link href={"/mainlayout/contact"}>Contact</Link>
    </div>
  )
}

export default MainNav
