import Navbar from '../features/shared/components/Navbar.jsx'
import { Outlet, ScrollRestoration } from 'react-router'
import Footer from '../features/shared/components/Footer.jsx'

const AppLayout = () => {
  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default AppLayout
