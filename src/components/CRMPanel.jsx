import { Outlet, useNavigate } from "react-router-dom";
import SideNavigation from "./SideNavigation";
import Header from "./Header";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import { MdMenu, MdClose } from "react-icons/md";

const CRMPanel = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = useSelector(state => state.auth);

  const loginWithAccessToken = async () => {
    const baseURL = process.env.REACT_APP_BACKEND_URL;

    if (cookies?.access_token === undefined) {
      return;
    }

    try {
      const response = await fetch(baseURL + "auth/login-with-access-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      dispatch(
        userExists({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          allowedroutes: data.user.allowedroutes,
          isTrial: data.user.isTrial,
          isTrialEnded: data.user.isTrialEnded,
          isSubscribed: data.user.isSubscribed,
          isSubscriptionEnded: data.user.isSubscriptionEnded,
          account: data.user.account
        })
      );
    } catch (err) {
      // toast.error(err.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (cookies.access_token === undefined) {
      navigate("/login");
    } else {
      loginWithAccessToken();
    }
  }, []);

  return (
    <div className="bg-[#f9fafc] min-h-[100vh] w-full px-4 py-3 realtive overflow-hidden relative" style={{ boxShadow: "0 0 20px 3px #96beee26" }}>
      <Header />

      {auth.role !== 'Super Admin' && auth.allowedroutes.length === 0 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#ff6f6f]">
          You do not have access to any of the routes. Contact your Super Admin for further action.
        </div>}
      {(auth.role === 'Super Admin' || auth.allowedroutes.length > 0) &&
      <div className="flex h-[89vh] overflow-auto">
        <div className="z-20 bg-[#f9fafc] absolute top-[95px] left-10 block xl:hidden overflow-x-hidden overflow-y-auto" style={{overflowY: isMenuOpen ? 'auto' : 'hidden'}}>
          {!isMenuOpen && <div className="text-lg bg-[#1640d6] text-white py-1 px-2 text-white text-3xl rounded-md" onClick={()=>setIsMenuOpen(true)}><MdMenu /></div>}

          {isMenuOpen && (
            <div>
              <SideNavigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            </div>
          )}
        </div>
        <div className="hidden xl:block overflow-x-hidden overflow-y-auto w-[230px]">
          <SideNavigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
        <div className="flex-1 mt-[22px] px-1 py-5 md:px-10 md:py-3 overflow-auto">
          <Outlet />
        </div>
      </div>}

    </div>
  );
};

export default CRMPanel;
