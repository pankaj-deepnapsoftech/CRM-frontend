import { NavLink } from "react-router-dom";
import { MdMenu, MdClose, MdSupportAgent, MdKeyboardArrowDown } from "react-icons/md";
import {
  MdOutlineSpeed,
  MdHeadphones,
  MdOutlinePeople,
  MdHomeWork,
  MdLeaderboard,
  MdLocalOffer,
  MdNewspaper,
  MdOutlinePayment,
  MdOutlineProductionQuantityLimits,
  MdOutlineCategory,
  MdAttachMoney,
} from "react-icons/md";
import { GrConfigure } from "react-icons/gr";
import { FaFileInvoice, FaFileLines, FaPeopleGroup } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { useSelector } from "react-redux";
import { IoSettingsSharp } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { checkAccess } from "../utils/checkAccess";
import { useState } from "react";

const SideNavigation = ({ isMenuOpen, setIsMenuOpen }) => {
  const { role, ...auth } = useSelector((state) => state.auth);
  const [showDMLeadsSubmenu, setShowDMLeadsSubmenu] = useState(false);

  return (
    <div className="px-3 py-3 w-[100vw] h-[100vh] md:h-auto fixed top-0 left-0 overflow-y-auto overflow-x-hidden bg-[#f9fafc] xl:relative">
      {isMenuOpen && (
        <div
          className="flex justify-end mr-5 text-lg"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdClose />
        </div>
      )}
      <ul className="text-sm font-bold overflow-x-hidden overflow-y-auto">
        <NavLink
          end={true}
          to=""
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <MdOutlineSpeed />
            </span>
            <span>Dashboard</span>
            {!checkAccess(auth, "dashboard")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="admins"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <FaPeopleGroup />
            </span>
            <span>Employees</span>
            {!checkAccess(auth, "admin")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="individuals"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <MdOutlinePeople />
            </span>
            <span>Individuals</span>
            {!checkAccess(auth, "people")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="corporates"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <MdHomeWork />
            </span>
            <span>Corporates</span>
            {!checkAccess(auth, "company")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="leads"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <MdLeaderboard />
            </span>
            <span>Leads</span>
            {!checkAccess(auth, "lead")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="assigned-leads"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <MdLeaderboard />
            </span>
            <span>Assigned Leads</span>
            {!checkAccess(auth, "lead")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <div
          onClick={() => setShowDMLeadsSubmenu((prev) => !prev)}
          className="cursor-pointer flex gap-x-12 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]"
        >
          <div className="flex gap-x-2">
            <span>
              <MdLeaderboard />
            </span>
            <span>DM Leads</span>
            {!checkAccess(auth, "lead")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </div>
          <MdKeyboardArrowDown />
        </div>
        {showDMLeadsSubmenu && (
          <div>
            <NavLink
              to="indiamart-leads"
              className={({ isActive }) =>
                isActive ? "text-[#1640d6]" : "text-black"
              }
              onClick={() => {
                isMenuOpen && setIsMenuOpen(false);
              }}
            >
              <li className="flex gap-x-2 pl-6 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                <span>Indiamart Leads</span>
                {!checkAccess(auth, "lead")?.isAllowed && (
                  <span className="mt-1">
                    <FaLock size="12" color="#b1b1b1" />
                  </span>
                )}
              </li>
            </NavLink>
            <NavLink
              to="justdial-leads"
              className={({ isActive }) =>
                isActive ? "text-[#1640d6]" : "text-black"
              }
              onClick={() => {
                isMenuOpen && setIsMenuOpen(false);
              }}
            >
              <li className="flex gap-x-2 pl-6 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                <span>JustDial Leads</span>
                {!checkAccess(auth, "lead")?.isAllowed && (
                  <span className="mt-1">
                    <FaLock size="12" color="#b1b1b1" />
                  </span>
                )}
              </li>
            </NavLink>
            <NavLink
              to="facebook-leads"
              className={({ isActive }) =>
                isActive ? "text-[#1640d6]" : "text-black"
              }
              onClick={() => {
                isMenuOpen && setIsMenuOpen(false);
              }}
            >
              <li className="flex gap-x-2 pl-6 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                <span>Facebook Leads</span>
                {!checkAccess(auth, "lead")?.isAllowed && (
                  <span className="mt-1">
                    <FaLock size="12" color="#b1b1b1" />
                  </span>
                )}
              </li>
            </NavLink>
            <NavLink
              to="instagram-leads"
              className={({ isActive }) =>
                isActive ? "text-[#1640d6]" : "text-black"
              }
              onClick={() => {
                isMenuOpen && setIsMenuOpen(false);
              }}
            >
              <li className="flex gap-x-2 pl-6 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                <span>Instagram Leads</span>
                {!checkAccess(auth, "lead")?.isAllowed && (
                  <span className="mt-1">
                    <FaLock size="12" color="#b1b1b1" />
                  </span>
                )}
              </li>
            </NavLink>
            <NavLink
              to="google-leads"
              className={({ isActive }) =>
                isActive ? "text-[#1640d6]" : "text-black"
              }
              onClick={() => {
                isMenuOpen && setIsMenuOpen(false);
              }}
            >
              <li className="flex gap-x-2 pl-6 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                <span>Google Leads</span>
                {!checkAccess(auth, "lead")?.isAllowed && (
                  <span className="mt-1">
                    <FaLock size="12" color="#b1b1b1" />
                  </span>
                )}
              </li>
            </NavLink>
          </div>
        )}

        <NavLink
          to="customers"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <MdHeadphones />
            </span>
            <span>Customers</span>
            {!checkAccess(auth, "customer")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="offers"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <MdLocalOffer />
            </span>
            <span>Offers</span>
            {!checkAccess(auth, "offer")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="invoices"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <FaFileInvoice />
            </span>
            <span>Invoices</span>
            {!checkAccess(auth, "invoice")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="proforma-invoices"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <FaFileLines />
            </span>
            <span>Proforma Invoices</span>
            {!checkAccess(auth, "proforma-invoice")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="payments"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <MdOutlinePayment />
            </span>
            <span>Payments</span>
            {!checkAccess(auth, "payment")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="products"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <MdOutlineProductionQuantityLimits />
            </span>
            <span>Products</span>
            {!checkAccess(auth, "product")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="products-category"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <MdOutlineCategory />
            </span>
            <span>Products Category</span>
            {!checkAccess(auth, "category")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="expenses"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <MdAttachMoney />
            </span>
            <span>Expenses</span>
            {!checkAccess(auth, "expense")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="expenses-category"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <MdOutlineCategory />
            </span>
            <span>Expenses Category</span>
            {!checkAccess(auth, "expense-category")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="report"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <TbReport />
            </span>
            <span>Report</span>
            {!checkAccess(auth, "report")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        {/* <NavLink
            to="support"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={() => {
              isMenuOpen && setIsMenuOpen(false);
            }}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdSupportAgent />
              </span>
              <span>Support</span>
              {!checkAccess(auth, 'support')?.isAllowed && <span className="mt-1"><FaLock size="12" color="#b1b1b1" /></span>}
            </li>
          </NavLink> */}

        {/* <NavLink
            to="assigned-support"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={() => {
              isMenuOpen && setIsMenuOpen(false);
            }}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdSupportAgent />
              </span>
              <span>Assigned Support</span>
              {!checkAccess(auth, 'support')?.isAllowed && <span className="mt-1"><FaLock size="12" color="#b1b1b1" /></span>}
            </li>
          </NavLink> */}

        <NavLink
          to="website-configuration"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <GrConfigure />
            </span>
            <span>CRM Configuration</span>
            {!checkAccess(auth, "website configuration")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>

        <NavLink
          to="settings"
          className={({ isActive }) =>
            isActive ? "text-[#1640d6]" : "text-black"
          }
          onClick={() => {
            isMenuOpen && setIsMenuOpen(false);
          }}
        >
          <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
            <span>
              <IoSettingsSharp />
            </span>
            <span>Settings</span>
            {!checkAccess(auth, "website configuration")?.isAllowed && (
              <span className="mt-1">
                <FaLock size="12" color="#b1b1b1" />
              </span>
            )}
          </li>
        </NavLink>
      </ul>
    </div>
  );
};

export default SideNavigation;
