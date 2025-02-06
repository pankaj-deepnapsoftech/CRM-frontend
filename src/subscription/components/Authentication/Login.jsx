import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { userExists } from "../../redux/reducer/auth";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({
  email,
  setEmail,
  password,
  setPassword,
  hideModal,
  setCanResend,
  setSecondsLeft,
  setRegistered,
  setIsRegistering,
  setForgetPassword,
  setOtpVerfication,
}) => {
  const [cookies, setCookie] = useCookies();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email.trim().length === 0 || password.trim().length === 0) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const url = process.env.REACT_APP_BACKEND_URL + "organization/login";
      const response = await fetch(url, {
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
        if (data?.verified === false) {
          setPassword("");
          getOTPHandler();
          setRegistered(true);
          setIsRegistering(false);
          setOtpVerfication(true);
          return;
        }
        throw new Error(data.message);
      }
      hideModal();
      setCookie("organization_access_token", data.organization_access_token, {
        maxAge: 60 * 60 * 24,
      });
      setCookie("access_token", data.admin_access_token, {
        maxAge: 60 * 60 * 24,
      });
      dispatch(userExists(data.organization));
      navigate("/crm");
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getOTPHandler = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await fetch(baseUrl + "organization/get-otp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.organization_access_token}`,
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
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="text-center flex-1 py-10 flex flex-col items-center justify-center">
      <h1 className="subscription-font text-[#24243e] text-4xl mb-10">Login</h1>

      <form className="space-y-3" onSubmit={handleLogin}>
        <div className="relative w-[20rem] mx-auto">
          <div className="absolute top-[10px] left-3">
            <MdEmail color="#a3a3a3" size={25} />
          </div>
          <input
            className="subscription-font font-light outline-none px-10 py-[10px] rounded-sm bg-[#e3e3e3] w-[20rem]"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          ></input>
        </div>
        <div className="relative w-[20rem] mx-auto">
          <FaLock
            color="#a3a3a3"
            size={20}
            className="absolute top-[10px] left-3"
          />
          <input
            className="subscription-font font-light outline-none px-10 py-[10px] rounded-sm bg-[#e3e3e3] w-[20rem]"
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          ></input>
          {!showPassword ? (
            <FaEyeSlash
              onClick={() => setShowPassword(true)}
              color="#a3a3a3"
              size={20}
              className="absolute top-[10px] right-3"
            />
          ) : (
            <FaEye
              onClick={() => setShowPassword(false)}
              color="#a3a3a3"
              size={20}
              className="absolute top-[10px] right-3"
            />
          )}
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(false);
              setRegistered(false);
              setForgetPassword(true);
            }}
            className="subscription-font w-[12rem] lg:w-[12rem] py-1 lg:py-2 text-lg border border-[#2e2a5b] text-white bg-[#2e2a5b] rounded-full font-light hover:bg-white hover:text-[#2e2a5b] ease-in-out duration-300 mr-2"
          >
            Forget Password?
          </button>
          <button className="subscription-font w-[8rem] lg:w-[8rem] py-1 lg:py-2 text-lg border border-[#2e2a5b] text-white bg-[#2e2a5b] rounded-full font-light hover:bg-white hover:text-[#2e2a5b] ease-in-out duration-300">
            Login
          </button>
        </div>

        <div className="">
          <p
            onClick={() => setIsRegistering(true)}
            className="subscription-font text-[#3c88ff] hover:underline cursor-pointer"
          >
            Don't have an account?
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
