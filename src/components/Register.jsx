import React, { useEffect, useId, useState } from "react";
import logo from "../assets/images/logo/logo.png";
import { FaCheck, FaStarOfLife } from "react-icons/fa";
import { BiLockAlt, BiUser } from "react-icons/bi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import { useCookies } from "react-cookie";
import { IoMdArrowBack } from "react-icons/io";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [organizationEmail, setOrganizationEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState();
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies();
  const [otp, setOtp] = useState();

  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [gettingOTP, setGettingOTP] = useState(false);
  const [gotOTP, setGotOTP] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerHandler = async (e) => {
    e.preventDefault();

    if (name.length > 50) {
      toast.error("Name field must be less than 50 characters");
      return;
    }
    if (phone.length > 10) {
      toast.error("Phone no. field must be 10 digits long");
      return;
    }

    setRegistering(true);
    try {
      if (email.length === 0 || password.length === 0 || name.length === 0) {
        throw new Error("Please fill all the details!");
      }

      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
          designation,
          organizationEmail,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      setIsRegistered(true);
      setCanResend(false);
      setSecondsLeft(60);

      // dispatch(
      //   userExists({
      //     id: data.user.id,
      //     email: data.user.email,
      //     name: data.user.name,
      //     role: data.user.role,
      //     allowedroutes: data.user.allowedroutes,
      //   })
      // );
      // setCookie("access_token", data.access_token);

      // toast.success("Registered successfully!");
      // navigate("/crm");
    } catch (err) {
      toast.error(err.message);
    }
    setRegistering(false);
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
      setSecondsLeft(60);
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
      setIsOTPVerified(true);
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleResend = () => {
    getOTPHandler();
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
    // loginWithAccessToken();
  }, []);

  return (
    <div className="w-full min-h-[100vh] flex">
      <div className="hidden xl:flex bg-[#e3e3e3] h-[100vh] w-[50%] flex-col justify-center items-center">
        <div className="mb-5">
          <Link to="/"><img className="w-[200px]" src={logo}></img></Link>
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

      <div className="h-[100vh] w-full xl:w-[50%] flex flex-col items-center justify-center">
        {!isRegistered && (
          <div className="w-[80%] md:w-[60%]">
            <h1 className="text-4xl text-black font-bold border-b pb-5">
              Sign Up
            </h1>

            <form onSubmit={registerHandler} className="mt-4 w-[100%]">
              <div className="flex flex-col items-start">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  <span>
                    <FaStarOfLife size="6px" color="red" />
                  </span>
                  Company Email
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[18px] left-[7px] text-base">
                    <BiUser />
                  </div>
                  <input
                    value={organizationEmail}
                    required={true}
                    onChange={(e) => setOrganizationEmail(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9]  hover:border-[#1640d6] cursor-pointer"
                    type="text"
                    placeholder="Company Email"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col items-start">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  <span>
                    <FaStarOfLife size="6px" color="red" />
                  </span>
                  Name
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[18px] left-[7px] text-base">
                    <BiUser />
                  </div>
                  <input
                    value={name}
                    required={true}
                    onChange={(e) => setName(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border  mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                    type="text"
                    placeholder="Name"
                  />
                </div>
              </div>
              <div className="flex mt-4 flex-col items-start">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  <span>
                    <FaStarOfLife size="6px" color="red" />
                  </span>
                  Phone
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[18px] left-[7px] text-base">
                    <BiUser />
                  </div>
                  <input
                    value={phone}
                    required={true}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9]  hover:border-[#1640d6] cursor-pointer"
                    type="number"
                    placeholder="Phone"
                  />
                </div>
              </div>
              <div className="flex mt-4 flex-col items-start">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  <span>
                    <FaStarOfLife size="6px" color="red" />
                  </span>
                  Designation
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[18px] left-[7px] text-base">
                    <MdOutlineAdminPanelSettings />
                  </div>
                  <input
                    value={designation}
                    required={true}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9]  hover:border-[#1640d6] cursor-pointer"
                    type="text"
                    placeholder="Designation"
                  />
                </div>
              </div>
              <div className="flex mt-4 flex-col items-start">
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
                    required={true}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9] hover:border-[#1640d6] cursor-pointer"
                    type="email"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col items-start font-bold text-sm">
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
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9]  hover:border-[#1640d6] cursor-pointer"
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
                  <Link to="/login">Already have an account?</Link>
                </div>
                {/* <div className="text-[#1640d6]">Forgot Password</div> */}
              </div>

              <button
                style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
                className="w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
              >
                {registering ? "Signing up..." : "Sign Up"}
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
        )}

        {isRegistered && !isOTPVerified && (
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
                    onChange={(e) => {
                      if (e.target.value.length > 4) {
                        toast.error("OTP field must be 4 digits long");
                        return;
                      }
                      setOtp(e.target.value);
                    }}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9] hover:border-[#1640d6] cursor-pointer"
                    type="text"
                    placeholder="OTP"
                  />
                  {gotOTP && (
                    <div className="my-2">
                      OTP sent to <strong>{email}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-x-1">
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
        )}
      </div>
    </div>
  );
};

export default Register;
