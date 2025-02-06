import React, { useState } from "react";
import Modal from "../ui/Modal";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "../../redux/reducer/auth";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const UserDetails = ({ hideModal }) => {
  const [cookies, _, removeCookie] = useCookies();
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    name,
    email,
    company,
    city,
    phone,
    employeeCount,
    subscribed,
    isSubscriptionEnded,
    account,
  } = useSelector((state) => state.subscription_auth);

  const dispatch = useDispatch();

  const logoutHandler = () => {
    setIsLoggingOut(true);
    if (cookies?.organization_access_token) {
      removeCookie("organization_access_token");
    }
    if (cookies?.access_token) {
      removeCookie("access_token");
    }
    dispatch(userNotExists());
    setIsLoggingOut(false);
    hideModal();
    toast.success("Logged out successfully");
    navigate('/')
  };

  const cancelSubscriptionHandler = async () => {
    try {
      setIsCancelling(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "razorpay/cancel-subscription",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.organization_access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      loginWithToken();
      navigate('/');
      hideModal();
    } catch (error) {
      toast.error(error.message);
    }
    finally{
      setIsCancelling(true);
    }
  };

  const loginWithToken = async ()=>{
    try{
      const url = process.env.REACT_APP_BACKEND_URL+'organization/login-with-token';
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${cookies.access_token}`
        }
      });
      const data = await response.json();
      if(!data.success){
        throw new Error(data.message);
      }
      // console.log(data)
      dispatch(userExists(data.organization));
    }
    catch(err){
      // toast.error(err.message);
    }
  }

  return (
    <Modal hideModal={hideModal}>
      <div className="flex items-center justify-start relative w-fit">
        <h1 className="subscription-font text-3xl font-medium text-[#262544] pt-5 px-5">
          Account Details
        </h1>
        <span className="subscription-font absolute -right-[4rem] -top-2  text-center uppercase mt-5 text-[10px] p-1 rounded-md bg-gray-100">
          {account?.account_type}
        </span>
      </div>
      <div className="w-max mx-auto lg:min-h-[20rem] h-auto overflow-auto">
        <div className="my-5">
          <div className="flex flex-col md:flex-row items-start flex-wrap md:items-center gap-2 md:gap-5 mb-2">
            <p className="subscription-font w-[15rem]">Name</p>
            <p className="subscription-font bg-[#d9d9d9] text-[#5c5c5c] py-1 px-5 rounded-sm w-[20rem]">
              {name}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start flex-wrap md:items-center gap-2 md:gap-5 mb-2">
            <p className="subscription-font w-[15rem]">Email</p>
            <p className="subscription-font bg-[#d9d9d9] text-[#5c5c5c] py-1 px-5 rounded-sm w-[20rem]">
              {email}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start flex-wrap md:items-center gap-2 md:gap-5 mb-2">
            <p className="subscription-font w-[15rem]">Phone no.</p>
            <p className="subscription-font bg-[#d9d9d9] text-[#5c5c5c] py-1 px-5 rounded-sm w-[20rem]">
              {phone}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start flex-wrap md:items-center gap-2 md:gap-5 mb-2">
            <p className="subscription-font w-[15rem]">Company</p>
            <p className="subscription-font bg-[#d9d9d9] text-[#5c5c5c] py-1 px-5 rounded-sm w-[20rem]">
              {company}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start flex-wrap md:items-center gap-2 md:gap-5 mb-2">
            <p className="subscription-font w-[15rem]">City</p>
            <p className="subscription-font bg-[#d9d9d9] text-[#5c5c5c] py-1 px-5 rounded-sm w-[20rem]">
              {city}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start flex-wrap md:items-center gap-2 md:gap-5 mb-2">
            <p className="subscription-font w-[15rem]">Number of Employees</p>
            <p className="subscription-font bg-[#d9d9d9] text-[#5c5c5c] py-1 px-5 rounded-sm w-[20rem]">
              {employeeCount}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start flex-wrap md:items-center gap-2 md:gap-5 mb-2">
            <p className="subscription-font w-[15rem]">Subscription status</p>
            <p className="subscription-font bg-[#d9d9d9] text-[#5c5c5c] py-1 px-5 rounded-sm w-[20rem]">
              {subscribed ? "Subscribed" : "Not yet subscribed"}
            </p>
          </div>
        </div>

        <div className="flex justify-end pb-5">
          <button
            onClick={hideModal}
            className="subscription-font border rounded-sm py-1 px-8 bg-[#2e2960] text-lg font-light text-white mr-2"
          >
            Close
          </button>
          <button
            disabled={isLoggingOut}
            onClick={logoutHandler}
            className="subscription-font border rounded-sm py-1 px-8 bg-[#db4747] text-lg font-light text-white mr-2 disabled:cursor-not-allowed disabled:bg-white disabled:text-[#db4747]"
          >
            {isLoggingOut ? 'Please wait...' : 'Logout'}
          </button>
          {subscribed && (
            <button
              disabled={isCancelling}
              onClick={cancelSubscriptionHandler}
              className="subscription-font border rounded-sm py-1 px-8 bg-[#db4747] text-lg font-light text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-[#db4747]"
            >
              {isCancelling ? 'Please wait...' : 'Cancel Subscription'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserDetails;
