import { useSelector } from "react-redux";
import { Link, NavLink, Outlet } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import {
  FaBuilding,
  FaFileImage,
  FaFilePdf,
  FaMoneyCheck,
} from "react-icons/fa";
import { checkAccess } from "../../utils/checkAccess";

const Settings = () => {
  const { role, ...auth } = useSelector((state) => state.auth);
  const { isAllowed, msg } = checkAccess(auth, "website configuration");

  return (
    <>
      {!isAllowed && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#ff6f6f] flex gap-x-2">
          {msg}
          {auth?.isTrial && !auth?.isTrialEnded && (
            <div className="-mt-1">
              <Link to="/pricing">
                <button className="text-base border border-[#d61616] rounded-md px-5 py-1 bg-[#d61616] text-white font-medium hover:bg-white hover:text-[#d61616] ease-in-out duration-300">
                  {auth?.account?.trial_started || auth?.isSubscriptionEnded
                    ? "Upgrade"
                    : "Activate Free Trial"}
                </button>
              </Link>
            </div>
          )}
          {((auth?.isSubscribed && auth?.isSubscriptionEnded) ||
            (auth?.isTrial && auth?.isTrialEnded)) && (
            <div className="-mt-1">
              <Link to="/pricing">
                <button className="text-base border border-[#d61616] rounded-md px-5 py-1 bg-[#d61616] text-white font-medium hover:bg-white hover:text-[#d61616] ease-in-out duration-300">
                  Pay Now
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {isAllowed && (
        <div>
          <div className="flex flex-col-reverse md:flex-row gap-2">
            <div
              className="flex-1 border-[1px] px-5 py-8 md:px-9 rounded"
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
            >
              <Outlet />
            </div>
            <div
              className="flex gap-2 flex-col border rounded px-2 py-1 border-[1px] px-5 py-8 md:px-9 rounded"
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
            >
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 mb-2">
                Settings
              </div>

              <NavLink
                end={true}
                className={({ isActive }) =>
                  isActive ? "text-[#1640d6]" : "text-black"
                }
                to=""
              >
                <li className="font-bold flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                  <IoSettingsSharp />
                  Account Settings
                </li>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-[#1640d6]" : "text-black"
                }
                to="company-settings"
              >
                <li className="font-bold flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                  <FaBuilding />
                  Company Settings
                </li>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-[#1640d6]" : "text-black"
                }
                to="company-logo"
              >
                <li className="font-bold flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                  <FaFileImage />
                  Company Logo
                </li>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-[#1640d6]" : "text-black"
                }
                to="pdf-settings"
              >
                <li className="font-bold flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                  <FaFilePdf />
                  PDF Settings
                </li>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-[#1640d6]" : "text-black"
                }
                to="finance-settings"
              >
                <li className="font-bold flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                  <FaMoneyCheck />
                  Finance Settings
                </li>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
