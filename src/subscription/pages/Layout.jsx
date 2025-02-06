import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducer/auth";

const Layout = ({ showAuthenticationMenu, setShowAuthenticationMenu }) => {
  const [cookies] = useCookies();
  const dispatch = useDispatch();

  const loginWithToken = async () => {
    try {
      const url =
        process.env.REACT_APP_BACKEND_URL + "organization/login-with-token";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.organization_access_token}`,
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      // console.log(data)
      dispatch(userExists(data.organization));
    } catch (err) {
      // toast.error(err.message);
    }
  };

  useEffect(() => {
    if (cookies?.organization_access_token) {
      loginWithToken();
    }
  }, []);
  return (
    <>
      <Header
        showAuthenticationMenu={showAuthenticationMenu}
        setShowAuthenticationMenu={setShowAuthenticationMenu}
      />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
