import { FcCheckmark } from "react-icons/fc";
import { GrClose } from "react-icons/gr";
import { activateTrialHandler, RequsetSupport } from "../../pages/Pricing";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const Pricing = ({showAuthenticationMenu, setShowAuthenticationMenu}) => {
  const {
    name,
    phone: mobile,
    employeeCount,
    id,
    account,
  } = useSelector((state) => state.subscription_auth);
  const user = useSelector((state) => state.subscription_auth);
  const [cookies] = useCookies();

  return (
    <div className="my-8 px-10">
      <h1 className="subscription-font text-3xl font-medium text-[#262544] text-center">
        Pricing Plans
      </h1>

      <div className="mt-10 flex flex-col md:flex-row justify-center gap-10 w-full">
        {/* free user tier */}
        <div className="bg-white border">
          <div
            style={{
              background:
                "linear-gradient(to right, rgb(15, 12, 41), rgb(48, 43, 99), rgb(36, 36, 62))",
            }}
            className="px-5 py-10 text-white"
          >
            <div className="subscription-font text-3xl font-medium text-center">FREE</div>
            <div className="subscription-font text-lg font-light text-center">
              Free Trial for 7 days
            </div>
          </div>
          <ul className="leading-8 font-light py-5 px-5">
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Employee Access Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Lead Mangement and Assignation
            </li>
            <li className="subscription-font flex gap-2 items-center ">
              <GrClose className="text-red-500" />
              Customer Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <GrClose className="text-red-500" />
              Offer Management and PDF Generation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <GrClose className="text-red-500" />
              Invoice Management and PDF Generation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <GrClose className="text-red-500" />
              Proforma Invoice Management and PDF Generation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <GrClose className="text-red-500" />
              Payment Management and PDF Generation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Product Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <GrClose className="text-red-500" />
              Expense Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <GrClose className="text-red-500" />
              Support Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <GrClose className="text-red-500" />
              Yearly Reports
            </li>
            <li className="subscription-font flex gap-2 items-center ">
              <GrClose className="text-red-500" />
              Lifetime Access
            </li>
          </ul>
          <div className="px-2 py-2">
            {id ? (
              <button
                onClick={() => activateTrialHandler(cookies?.access_token)}
                className="subscription-font w-full py-2  rounded-md text-lg  text-white border hover:bg-transparent ease-in-out duration-300 hover:text-gray-400 bg-gray-400 disabled:cursor-not-allowed" disabled={account?.trial_started}
              >
                {account?.trial_started
                  ? "Trial Plan Activated"
                  : "Try Now"}
              </button>
            ) : (
              <Link to="/">
                <button onClick={()=>setShowAuthenticationMenu(true)} className="subscription-font w-full py-2  rounded-md text-lg  text-white border hover:bg-transparent ease-in-out duration-300 hover:text-gray-400 bg-gray-400">
                  Login to Try Now
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white border">
          <div
            style={{
              background:
                "linear-gradient(to right, rgb(15, 12, 41), rgb(48, 43, 99), rgb(36, 36, 62))",
            }}
            className="px-5 py-10 text-white"
          >
            <div className="subscription-font text-3xl font-medium text-center">₹ 1000/-</div>
            <div className="subscription-font text-lg font-light text-center">
              Per User Billed Monthly
            </div>
          </div>
          <ul className="leading-8 font-light py-5 px-5">
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Employee Access Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Lead Mangement and Assignation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Customer Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Offer Management and PDF Generation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Invoice Management and PDF Generation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Proforma Invoice Management and PDF Generation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Payment Management and PDF Generation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Product Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Expense Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Support Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Yearly Reports
            </li>
            <li className="subscription-font flex gap-2 items-center ">
              <GrClose className="text-red-500" />
              Lifetime Access
            </li>
          </ul>
          <div className="px-2 py-2">
            {id ? (
              <Link to="/checkout">
                <button className="subscription-font w-full py-2 border border-[#ff4c4c] rounded-md text-lg bg-[#ff4c4c] text-white hover:bg-transparent ease-in-out duration-300 hover:text-[#ff4c4c] disabled:cursor-not-allowed" disabled={account?.account_type === 'subscription' && account?.account_status === 'active'}>
                  {account?.account_type === 'subscription' && account?.account_status === 'active' ? 'Subscribed' : 'Subscribe Now'}
                </button>
              </Link>
            ) : (
              <Link to="/">
                <button onClick={()=>setShowAuthenticationMenu(true)} className="subscription-font w-full py-2 border border-[#ff4c4c] rounded-md text-lg bg-[#ff4c4c] text-white hover:bg-transparent ease-in-out duration-300 hover:text-[#ff4c4c]">
                  Login to Subscribe Now
                </button>
              </Link>
            )}
          </div>
        </div>
        <div className="bg-white border">
          <div
            style={{
              background:
                "linear-gradient(to right, rgb(15, 12, 41), rgb(48, 43, 99), rgb(36, 36, 62))",
            }}
            className="subscription-font px-5 py-10 text-white"
          >
            <div className="subscription-font text-3xl font-medium text-center">Custom/-</div>
            <div className="subscription-font text-lg font-light text-center">
              One Time Payment
            </div>
          </div>
          <ul className="leading-8 font-light py-5 px-5">
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Employee Access Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Lead Mangement and Assignation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Customer Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Offer Management and PDF Generation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Invoice Management and PDF Generation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Proforma Invoice Management and PDF Generation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Payment Management and PDF Generation
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Product Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Expense Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Support Management
            </li>
            <li className="subscription-font flex gap-2 items-center">
              <FcCheckmark />
              Yearly Reports
            </li>
            <li className="subscription-font flex gap-2 items-center ">
              <FcCheckmark />
              Lifetime Access
            </li>
          </ul>
          <div className="px-2 py-2">
            {id ? (
              <Link>
                <button
                  onClick={() => RequsetSupport(name, mobile, employeeCount)}
                  className="subscription-font w-full py-2 border border-[#428d1b] rounded-md text-lg bg-[#428d1b] text-white hover:bg-transparent ease-in-out duration-300 hover:text-[#428d1b]"
                >
                  Buy Now
                </button>
              </Link>
            ) : (
              <Link to="/">
                <button onClick={()=>setShowAuthenticationMenu(true)} className="subscription-font w-full py-2 border border-[#428d1b] rounded-md text-lg bg-[#428d1b] text-white hover:bg-transparent ease-in-out duration-300 hover:text-[#428d1b]">
                  Login To Buy Now
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
