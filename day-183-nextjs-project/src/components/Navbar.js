import Link from 'next/link'
import React from 'react'
import { ModeToggle } from './toggleTheme'

const Navbar = () => {
  return (
    <div className="flex justify-between px-8 py-4 items-center">
      <h1 className="text-xl font-bold">Winden</h1>
      <div className="flex gap-4 font-semibold">
        <Link href={"/home"}>Home</Link>
        <Link href={"/products"}>Products</Link>
      </div>
      <div> <ModeToggle /> </div>
    </div>
  )
}

export default Navbar;
