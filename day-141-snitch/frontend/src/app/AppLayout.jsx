import React from 'react'
import Navbar from '../features/shared/components/Navbar'
import { Outlet } from 'react-router'

const AppLayout = () => {
  return (
    <>
        <Navbar />
        <Outlet />
    </>
  )
}

export default AppLayout
