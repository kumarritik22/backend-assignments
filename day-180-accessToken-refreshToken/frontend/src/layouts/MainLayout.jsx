import { Outlet } from 'react-router';

const MainLayout = () => {
  return (
    <div>
        <div>Navbar</div>
        <Outlet />
    </div>
  )
}

export default MainLayout;
