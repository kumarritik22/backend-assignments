import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

const Layout = ({ children }) => {
  return (
    <>
      <ProtectedRoute>
        <Navbar />
        {children}
      </ProtectedRoute>
    </>
  );
};

export default Layout;