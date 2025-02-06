import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdEmail, MdVerifiedUser } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gotOtp, setGotOtp] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [resetToken, setResetToken] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const getOTPHandler = async (e) => {
    e.preventDefault();

    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await fetch(baseUrl + "organization/get-otp", {
        method: "POST",
        headers: {
          //   Authorization: `Bearer ${cookies?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      setCanResend(false);
      setSecondsLeft(30);
      setGotOtp(true);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getResetPasswordTokenHandler = async (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error("Invalid OTP");
      return;
    }

    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(
        baseUrl + "organization/password-reset-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // authorization: `Bearer ${cookies?.access_token}`,
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      setIsOTPVerified(true);
      setResetToken(data.resetToken);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    if (password.length < 5) {
      toast.error("Password should be 5 characters long");
      return;
    }
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await fetch(baseUrl + "organization/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          email,
          newPassword: password,
          resetToken,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      navigate(0);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (!canResend) {
      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [canResend]);

  return (
    <div className="text-center flex-1 py-10 flex flex-col items-center justify-center">
      <h1 className="subscription-font text-[#24243e] text-4xl mb-10">Reset Password</h1>

      {!gotOtp && (
        <form onSubmit={getOTPHandler} className="space-y-3">
          <div className="relative w-[20rem] mx-auto">
            <div className="absolute top-[10px] left-3">
              <MdEmail color="#a3a3a3" size={20} />
            </div>
            <input
              className="subscription-font w-full font-light outline-none px-10 py-[10px] rounded-sm bg-[#e3e3e3]"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            ></input>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="subscription-font w-[8rem] mb-2 lg:mb-0 lg:w-[8rem] py-1 lg:py-2 text-lg border border-[#2e2a5b] text-white bg-[#2e2a5b] rounded-full font-light hover:bg-white hover:text-[#2e2a5b] ease-in-out duration-300 mr-2"
            >
              Get OTP
            </button>
          </div>
        </form>
      )}

      {gotOtp && !isOTPVerified && (
        <form onSubmit={getResetPasswordTokenHandler} className="space-y-3">
          <div className="relative w-[20rem] mx-auto">
            <div className="absolute top-[10px] left-3">
              <MdVerifiedUser color="#a3a3a3" size={20} />
            </div>
            <input
              className="subscription-font w-full font-light outline-none px-10 py-[10px] rounded-sm bg-[#e3e3e3]"
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              required
            ></input>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="subscription-font w-[8rem] mb-2 lg:mb-0 lg:w-[8rem] py-1 lg:py-2 text-lg border border-[#2e2a5b] text-white bg-[#2e2a5b] rounded-full font-light hover:bg-white hover:text-[#2e2a5b] ease-in-out duration-300 mr-2"
            >
              Verify OTP
            </button>
            <button
              type="button"
              disabled={!canResend}
              className="subscription-font w-[12rem] lg:w-[12rem] py-1 lg:py-2 text-lg border border-[#2e2a5b] text-white bg-[#2e2a5b] rounded-full font-light hover:bg-white hover:text-[#2e2a5b] ease-in-out duration-300 disabled:border-[#b7b6b6] disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
              onClick={getOTPHandler}
            >
              Resend OTP ({secondsLeft})
            </button>
          </div>
        </form>
      )}

      {isOTPVerified && (
        <form onSubmit={resetPasswordHandler} className="space-y-3">
          <div className="relative w-[20rem] mx-auto">
            <div className="absolute top-[10px] left-3">
              <FaLock color="#a3a3a3" size={20} />
            </div>
            <input
              className="subscription-font w-full font-light outline-none px-10 py-[10px] rounded-sm bg-[#e3e3e3]"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            ></input>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="subscription-font w-[14rem] mb-2 lg:mb-0 lg:w-[14rem] py-1 lg:py-2 text-lg border border-[#2e2a5b] text-white bg-[#2e2a5b] rounded-full font-light hover:bg-white hover:text-[#2e2a5b] ease-in-out duration-300 mr-2"
            >
              Reset Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgetPassword;
