import Navbar from '../features/shared/components/Navbar.jsx'
import { Outlet } from 'react-router'
import Footer from '../features/shared/components/Footer.jsx'

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default AppLayout
