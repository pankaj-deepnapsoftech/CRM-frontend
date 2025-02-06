import React from "react";
import { FcCheckmark } from "react-icons/fc";
import { GrClose } from "react-icons/gr";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useCookies } from "react-cookie";

export const RequsetSupport = async (name, mobile, employeeCount) => {
  const description = `I want to know about One Time Payment Plan of CRM Software for ${employeeCount} employees`;
  const purpose = "purchase";
  const dataTosend = { description, purpose, name, mobile };
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SUPPORT_URL}support/create-support`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...dataTosend,
        }),
      }
    );
    const resp = await response.json();
    if (!resp.success) {
      throw new Error(resp.error);
    }

    toast.success(resp.message);
  } catch (error) {
    toast.error("Something Went Wrong!");
  }
};

export const activateTrialHandler = async (access_token) => {
  try {
    const url =
      process.env.REACT_APP_BACKEND_URL + "organization/trial-account";
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    toast.success(data.message);
    window.location.reload();
  } catch (error) {
    toast.error(error.message);
  }
};

const Pricing = ({ showAuthenticationMenu, setShowAuthenticationMenu }) => {
  const {
    name,
    phone: mobile,
    employeeCount,
    id,
    account,
  } = useSelector((state) => state.subscription_auth);
  const [cookies] = useCookies();

  return (
    <>
      <ToastContainer />
      <div className="mt-36">
        <div className="mb-10">
          <h1 className="subscription-font text-4xl font-medium text-[#262544] text-center mb-1">
            Pricing
          </h1>
          <p className="subscription-font mx-auto text-center font-light w-[90%] md:w-[40rem]">
            Choose the perfect plan for your needs! Our pricing options are
            designed to fit everyone, from individuals to large organizations.
            Whether you're just starting out or looking for advanced solutions,
            we have a plan to help you succeed. Explore the features included in
            each plan and find the right fit for you today!
          </p>
        </div>

        <div className="pricing w-full px-5 md:px-0 md:h-auto mb-20">
          <div className="my-10 flex flex-col flex-wrap md:flex-row justify-center gap-10 w-full px-4">
            {/*  */}
            <div className="bg-white border trial-plan min-w-[25rem]">
              <div className="px-5 py-10 text-white bg-gray-400">
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
                <li className="subscription-font subscription-font flex gap-2 items-center">
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
                    onClick={() => activateTrialHandler(cookies?.organization_access_token)}
                    className="subscription-font w-full py-2 border border-gray-400 rounded-md text-lg bg-gray-400 text-white hover:bg-transparent ease-in-out duration-300 hover:text-gray-400 disabled:cursor-not-allowed"
                    disabled={account?.trial_started}
                  >
                    {account?.trial_started
                      ? "Trial Plan Activated"
                      : "Try Now"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAuthenticationMenu(true)}
                    className="subscription-font w-full py-2 border border-gray-400 rounded-md text-lg bg-gray-400 text-white hover:bg-transparent ease-in-out duration-300 hover:text-gray-400"
                  >
                    Login to Try Now
                  </button>
                )}
              </div>
            </div>
            {/*  */}
            <div className="bg-white border economical-plan min-w-[25rem]">
              <div className="px-5 py-10 text-white bg-[#ff4c4c]">
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
                    <button
                      className="subscription-font w-full py-2 border border-[#ff4c4c] rounded-md text-lg bg-[#ff4c4c] text-white hover:bg-transparent ease-in-out duration-300 hover:text-[#ff4c4c] disabled:cursor-not-allowed"
                      disabled={
                        account?.account_type === "subscription" &&
                        account?.account_status === "active"
                      }
                    >
                      {account?.account_type === "subscription" &&
                      account?.account_status === "active"
                        ? "Subscribed"
                        : "Subscribe Now"}
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowAuthenticationMenu(true)}
                    className="subscription-font w-full py-2 border border-[#ff4c4c] rounded-md text-lg bg-[#ff4c4c] text-white hover:bg-transparent ease-in-out duration-300 hover:text-[#ff4c4c]"
                  >
                    Login to Subscribe
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white border best-plan min-w-[25rem]">
              <div className="px-5 py-10 text-white bg-[#428d1b]">
                <div className="subscription-font text-3xl font-medium text-center">
                  Custom/-
                </div>
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
                  <button
                    onClick={() => RequsetSupport(name, mobile, employeeCount)}
                    className="subscription-font w-full py-2 border border-[#428d1b] rounded-md text-lg bg-[#428d1b] text-white hover:bg-transparent ease-in-out duration-300 hover:text-[#428d1b]"
                  >
                    Buy Now
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAuthenticationMenu(true)}
                    className="subscription-font w-full py-2 border border-[#428d1b] rounded-md text-lg bg-[#428d1b] text-white hover:bg-transparent ease-in-out duration-300 hover:text-[#428d1b]"
                  >
                    Login To Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
