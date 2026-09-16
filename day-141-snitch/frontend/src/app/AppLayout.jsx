import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Navbar from '../features/shared/components/Navbar.jsx'
import Footer from '../features/shared/components/Footer.jsx'

const AppLayout = () => {
  
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default AppLayout