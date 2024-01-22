import { Navbar } from 'components';
import { Outlet } from 'react-router-dom';

const WithNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default WithNavbar;
