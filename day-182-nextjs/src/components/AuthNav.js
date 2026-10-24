import Link from 'next/link'
import React from 'react'

const AuthNav = () => {
  return (
    <div className="flex gap-5">
        <Link href={"/authlayout/login"}>Login</Link>
        <Link href={"/authlayout/register"}>Register</Link>
    </div>
  )
}

export default AuthNav
