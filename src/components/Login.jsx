import React, { useEffect, useId, useState } from "react";
import logo from "../assets/images/logo/logo.png";
import { FaCheck, FaStarOfLife } from "react-icons/fa";
import { BiLockAlt, BiTrophy, BiUser } from "react-icons/bi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import { Cookies, useCookies } from "react-cookie";
import { IoMdArrowBack } from "react-icons/io";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies();
  const [forgotPassword, setForgotPassword] = useState(false);
  const [gettingOTP, setGettingOTP] = useState(false);
  const [gotOTP, setGotOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOTP, setVerifyingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resetToken, setResetToken] = useState();
  const [resettingPassword, setResettingPassword] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const [userVerified, setIsUserVerified] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      if (email.length === 0 || password.length === 0) {
        throw new Error("Please fill all the details!");
      }

      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        if (data.verified !== undefined && !data.verified) {
          setCanResend(false);
          setSecondsLeft(30);
          setIsUserVerified(false);
        }
        throw new Error(data.message);
      }

      dispatch(
        userExists({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          allowedroutes: data.user.allowedroutes,
        })
      );
      setCookie("access_token", data.access_token);
      setCookie("allowedroutes", data.user.allowedroutes);

      toast.success("Logged in successfully!");
      navigate("/crm");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const loginWithAccessToken = async () => {
    const baseURL = process.env.REACT_APP_BACKEND_URL;

    if (cookies.access_token === undefined) {
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
          account: data.user.account,
        })
      );
      toast.success(data.message);
      navigate("/crm");
    } catch (err) {
      // toast.error(err.message);
    }
  };

  const getOTPHandler = async () => {
    setGettingOTP(true);
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await fetch(baseUrl + "auth/get-otp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
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
      setGotOTP(true);
    } catch (err) {
      toast.error(err.message);
    }
    setGettingOTP(false);
  };

  const otpVerificationHandler = async (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error("Invalid OTP");
      return;
    }

    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "auth/password-reset-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      setOtpVerified(true);
      setResetToken(data.resetToken);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    setResettingPassword(true);

    if (password.length < 5) {
      toast.error("Password should be 5 characters long");
      return;
    }
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await fetch(baseUrl + "auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
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
    setResettingPassword(false);
  };

  const registerVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error("Invalid OTP");
      return;
    }

    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "auth/register-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          email,
          otp,
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

  const handleResend = () => {
    getOTPHandler();
    // setCanResend(false);
    // setSecondsLeft(30);
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

  useEffect(() => {
    loginWithAccessToken();
  }, []);

  return (
    <div className="w-full min-h-[100vh] flex">
      <div className="hidden xl:flex bg-[#e3e3e3] h-[100vh] w-[50%] flex-col justify-center items-center">
        <div className="mb-5">
          <Link to="/">
            <img className="w-[200px]" src={logo}></img>
          </Link>
        </div>
        <div>
          <h1 className="mb-5 text-2xl font-bold text-[#4f5d75]">
            Manage Your Company With:
          </h1>

          <div className="text-sm text-[#4f5d75] font-bold">
            <div className="mb-4 leading-7">
              <p className="flex items-center gap-x-2">
                <FaCheck />
                Run In One Tool
              </p>
              <p className="ml-6">Run And Scale Your Erp Crm Apps</p>
            </div>
            <div className="leading-7">
              <p className="flex items-center gap-x-2">
                <FaCheck />
                Easily Add And Manage Your Services
              </p>
              <p className="ml-6">
                It Brings Together Your Invoice Clients And Leads
              </p>
            </div>
          </div>
        </div>
      </div>

      {!forgotPassword && userVerified && (
        <div className="h-[100vh] w-full xl:w-[50%] flex flex-col items-center justify-center">
          <div className="w-[80%] md:w-[60%]">
            <h1 className="text-4xl text-black font-bold border-b pb-5">
              Sign In
            </h1>

            <form onSubmit={loginHandler} className="mt-4 w-[100%]">
              <div className="flex flex-col items-start">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  <span>
                    <FaStarOfLife size="6px" color="red" />
                  </span>
                  Email
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[18px] left-[7px] text-base">
                    <BiUser />
                  </div>
                  <input
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                    type="email"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col items-start text-sm">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  <span>
                    <FaStarOfLife size="6px" color="red" />
                  </span>
                  Password
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[20px] left-[7px] text-base">
                    <BiLockAlt />
                  </div>
                  <input
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  {!showPassword ? (
                    <IoEyeOffOutline
                      onClick={() => setShowPassword(true)}
                      size={20}
                      className="absolute top-[20px] right-3"
                    />
                  ) : (
                    <IoEyeOutline
                      onClick={() => setShowPassword(false)}
                      size={20}
                      className="absolute top-[20px] right-3"
                    />
                  )}
                </div>
              </div>
              <div className="my-6 flex items-center justify-between font-bold text-sm">
                <div className="text-[#1640d6]">
                  <Link to="/register">Don't have an account?</Link>
                </div>
                <div
                  className="text-[#1640d6] cursor-pointer"
                  onClick={() => setForgotPassword(true)}
                >
                  Forgot Password
                </div>
              </div>

              <button
                style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
                className="w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold"
              >
                Log In
              </button>
              <Link to="/">
                <button
                  type="button"
                  style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
                  className="mt-2 w-[100%] rounded-lg text-[#1640d6] border border-[#1640d6] bg-white py-2 font-bold"
                >
                  Go Back to Website
                </button>
              </Link>
            </form>
          </div>
        </div>
      )}

      {forgotPassword && !gotOTP && (
        <div className="h-[100vh] w-full xl:w-[50%] flex flex-col items-center justify-center">
          <div className="w-[80%] md:w-[60%]">
            <h1 className="flex gap-x-1 text-4xl text-black font-bold border-b pb-5">
              <IoMdArrowBack onClick={() => navigate(0)} />
              Reset Password
            </h1>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                getOTPHandler();
              }}
              className="mt-4 w-[100%]"
            >
              <div className="flex flex-col items-start">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  <span>
                    <FaStarOfLife size="6px" color="red" />
                  </span>
                  Email
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[18px] left-[7px] text-base">
                    <BiUser />
                  </div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>
              </div>
              {/* <div className="text-[#1640d6] mt-2">
              <Link to='/'>Go back to Login page</Link>
              </div> */}

              <button
                disabled={gettingOTP}
                style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
                className="mt-4 w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
              >
                {gettingOTP ? "Sending OTP..." : "Get OTP"}
              </button>
            </form>
          </div>
        </div>
      )}

      {!userVerified && (
        <div className="h-[100vh] w-full xl:w-[50%] flex flex-col items-center justify-center">
          <div className="w-[80%] md:w-[60%]">
            <h1 className="flex gap-x-1 text-4xl text-black font-bold border-b pb-5">
              <IoMdArrowBack onClick={() => navigate(0)} />
              OTP Verification
            </h1>

            <form onSubmit={registerVerify} className="mt-4 w-[100%]">
              <div className="flex flex-col items-start">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  <span>
                    <FaStarOfLife size="6px" color="red" />
                  </span>
                  OTP
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[18px] left-[7px] text-base">
                    <BiUser />
                  </div>
                  <input
                    value={otp}
                    required
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                    type="text"
                    placeholder="OTP"
                  />
                </div>
              </div>
              {/* <div className="text-[#1640d6] mt-2">
              <Link to='/'>Go back to Login page</Link>
              </div> */}
              <div className="flex items-center gap-x-1">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
                  className="mt-4 w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
                >
                  {canResend ? "Resend OTP" : `Resend (${secondsLeft}s)`}
                </button>
                <button
                  disabled={verifyingOTP}
                  style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
                  className="mt-4 w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
                >
                  {verifyingOTP ? "Verifying OTP..." : "Verify OTP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {forgotPassword && gotOTP && !otpVerified && (
        <div className="h-[100vh] w-full xl:w-[50%] flex flex-col items-center justify-center">
          <div className="w-[80%] md:w-[60%]">
            <h1 className="flex gap-x-1 text-4xl text-black font-bold border-b pb-5">
              <IoMdArrowBack onClick={() => navigate(0)} />
              OTP Verification
            </h1>

            <form onSubmit={otpVerificationHandler} className="mt-4 w-[100%]">
              <div className="flex flex-col items-start">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  <span>
                    <FaStarOfLife size="6px" color="red" />
                  </span>
                  OTP
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[18px] left-[7px] text-base">
                    <BiUser />
                  </div>
                  <input
                    value={otp}
                    required
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                    type="text"
                    placeholder="OTP"
                  />
                </div>
              </div>
              {/* <div className="text-[#1640d6] mt-2">
              <Link to='/'>Go back to Login page</Link>
              </div> */}
              <div className="flex items-center gap-x-1">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
                  className="mt-4 w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
                >
                  {canResend ? "Resend OTP" : `Resend (${secondsLeft}s)`}
                </button>
                <button
                  disabled={verifyingOTP}
                  style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
                  className="mt-4 w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
                >
                  {verifyingOTP ? "Verifying OTP..." : "Verify OTP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {forgotPassword && gotOTP && otpVerified && (
        <div className="h-[100vh] w-full xl:w-[50%] flex flex-col items-center justify-center">
          <div className="w-[80%] md:w-[60%]">
            <h1 className="flex gap-x-1 text-4xl text-black font-bold border-b pb-5">
              <IoMdArrowBack onClick={() => navigate(0)} />
              Set New Password
            </h1>

            <form onSubmit={resetPasswordHandler} className="mt-4 w-[100%]">
              <div className="flex flex-col items-start">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  <span>
                    <FaStarOfLife size="6px" color="red" />
                  </span>
                  New Password
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[18px] left-[7px] text-base">
                    <BiUser />
                  </div>
                  <input
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  {!showPassword ? (
                    <IoEyeOffOutline
                      onClick={() => setShowPassword(true)}
                      size={20}
                      className="absolute top-[20px] right-3"
                    />
                  ) : (
                    <IoEyeOutline
                      onClick={() => setShowPassword(false)}
                      size={20}
                      className="absolute top-[20px] right-3"
                    />
                  )}
                </div>
              </div>
              {/* <div className="text-[#1640d6] mt-2">
              <Link to='/'>Go back to Login page</Link>
              </div> */}

              <button
                disabled={resettingPassword}
                style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
                className="mt-4 w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
              >
                {resettingPassword ? "Resetting password..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
