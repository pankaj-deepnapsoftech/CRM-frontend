import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const { name, email, phone, employeeCount } = useSelector(
    (state) => state.subscription_auth
  );
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const [razorpayKey, setRazorpayKey] = useState();
  const [amount, setAmount] = useState(0);

  const getRazorpayKey = async () => {
    try {
      setIsLoading(true);
      const url = process.env.REACT_APP_BACKEND_URL + "razorpay/key";
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${cookies?.organization_access_token}`,
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setRazorpayKey(data.razorpay_key_id);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscriptionHandler = async () => {
    const data = {
      plan_id: process.env.REACT_APP_SUBSCRIPTION_PLAN_ID,
      total_count: 0,
      quantity: employeeCount,
      customer_notify: 1,
    };

    try {
      setIsLoading(true);
      const url =
        process.env.REACT_APP_BACKEND_URL + "razorpay/create-subscription";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.organization_access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      // setSubscriptionId(result.subscription_id);
      subscribeHandler(result.subscription_id);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const paymentVerificationHandler = async (response) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      response;

    // console.log(response);

    try {
      const url =
        process.env.REACT_APP_BACKEND_URL + "razorpay/payment-verification";

      // Send the payment details to your server
      const verificationResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.organization_access_token}`,
        },
        body: JSON.stringify({
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
          razorpay_signature: razorpay_signature,
        }),
      });

      const result = await verificationResponse.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);
      navigate("/payment-success", {
        state: { razorpay_payment_id: result.razorpay_payment_id },
      });
    } catch (err) {
      toast.error(err.message);
      navigate("/payment-failed");
    }
  };

  const subscribeHandler = async (subscriptionId) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: amount,
      currency: "INR",
      name: "Deepnap Softech",
      description: "Test Transaction",
      image:
        "https://cdn.pixabay.com/photo/2014/04/03/11/47/avatar-312160_1280.png",
      subscription_id: subscriptionId,
      handler: paymentVerificationHandler,
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    const razorpay = window.Razorpay(options);
    razorpay.open();
  };

  const fetchPlanDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL + "razorpay/plan-details"}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies?.organization_access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan_id: process.env.REACT_APP_SUBSCRIPTION_PLAN_ID,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setAmount(data?.plan?.item?.amount / 100);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cookies?.organization_access_token) {
      fetchPlanDetails();
      getRazorpayKey();
    } else if (!cookies?.organization_access_token || !name) {
      navigate("/");
    }
  }, []);

  return (
    <div className="my-32 mx-auto p-4 w-[90%] md:w-[50rem]">
      <h1 className="subscription-font text-[#24243e] mb-4 text-4xl text-center">
        Checkout
      </h1>
      <div className="h-auto flex flex-col items-center border shadow-md rounded-md overflow-hidden w-full">
        <h1
          style={{
            background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
          }}
          className="subscription-font h-12 w-full text-white text-xl py-3 px-4"
        >
          Economical-Plan ₹{(employeeCount * amount).toFixed(2) || 0}/-
        </h1>
        <div className="flex-col text-center flex items-center justify-center">
          <span className="subscription-font w-1/2 leading-6 pt-6">
            Subscribe to Economical-Plan and get access to all the amazing
            features of this plan
          </span>
          <div className="border-t border-[#a5a5a5] w-[70%] md:w-[40rem] mt-3 pt-1 flex flex-col items-end">
            <span className="subscription-font text-xl py-2">
              {" "}
              ₹{amount.toFixed(2)}/- Per user
            </span>
            <span className="subscription-font text-xl py-2">
              {" "}
              {employeeCount} User x ₹{amount.toFixed(2)}/- Per user
            </span>
            <div className="border-t border-[#a5a5a5] w-[70%] md:w-[40rem] flex justify-end">
              <span className="subscription-font text-xl font-bold py-2">
                {" "}
                = ₹{((employeeCount || 0) * amount).toFixed(2)}/- Only
              </span>
            </div>
          </div>
        </div>

        <div className=" w-[30rem] px-2 gap-2 py-2 flex">
          <button
            disabled={isLoading || !razorpayKey || amount === 0}
            onClick={createSubscriptionHandler}
            className="subscription-font w-full py-2 border border-[#ff4c4c] rounded-md text-lg bg-[#ff4c4c] text-white hover:bg-transparent ease-in-out duration-300 hover:text-[#ff4c4c] disabled:cursor-not-allowed disabled:bg-white disabled:text-[#ff4c4c]"
          >
            {!isLoading && razorpayKey
              ? "Proceed To Pay"
              : !razorpayKey || amount === 0
              ? "Please wait..."
              : "Processing..."}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
