import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
// import { FaBuilding, FaLocationArrow, FaUser } from "react-icons/fa";
// import { MdEmail, MdVerifiedUser } from "react-icons/md";
// import { FaSquarePhone, FaUserGroup } from "react-icons/fa6";
// import { FaLock } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";
// import { userExists } from "../../redux/reducer/auth";
// import { useCookies } from "react-cookie";
import ForgetPassword from "./ForgetPassword";
import Register from "./Register";
import Login from "./Login";
import OTPVeification from "./OTPVeification";
import { RxCross2 } from "react-icons/rx";

const Authentication = ({ hideModal }) => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [otpVeification, setOtpVerfication] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');

  return (
    <div>
      <Modal hideModal={hideModal}>
        <div className="flex lg:min-h-[35rem] lg:h-auto">
          <div onClick={hideModal} className="absolute top-4 right-6 z-10 border-[2px] border-[#2a2851] rounded-full hover:scale-105">
            <RxCross2 color="#2a2851" size={24} />
          </div>
          {isRegistering && (
            <div
              className="hidden lg:flex w-[30rem] h-[inherit] justify-center items-center"
              style={{
                background:
                  "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
              }}
            >
              <div className="text-center px-5">
                <h1 className="subscription-font text-white text-3xl font-light my-3">
                  Welcome Back!
                </h1>
                <p className="subscription-font text-white font-light mt-8 mb-6">
                  Login to access comprehensive CRM solution designed to help
                  businesses streamline their customer management processes.
                </p>
                <button
                  onClick={() => {
                    setIsRegistering(false);
                    setForgetPassword(false);
                    setRegistered(false);
                    setOtpVerfication(false);
                  }}
                  className="subscription-font text-white text-lg font-light border rounded-full px-10 py-3 w-[15rem] ease-in-out duration-300 hover:scale-105"
                >
                  Login
                </button>
              </div>
            </div>
          )}
          {!isRegistering && (
            <div
              className="hidden lg:flex w-[30rem] h-[inherit] justify-center items-center"
              style={{
                background:
                  "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
              }}
            >
              <div className="text-center px-5">
                <h1 className="subscription-font text-white text-3xl font-light my-3">
                  New Here!
                </h1>
                <p className="subscription-font text-white font-light mt-8 mb-6">
                  Create a account to comprehensive CRM solution designed to
                  help businesses streamline their customer management processes
                </p>
                <button
                  onClick={() => {
                    setIsRegistering(true);
                    setForgetPassword(false);
                    setRegistered(false);
                    setOtpVerfication(false);
                  }}
                  className="subscription-font text-white text-lg font-light border rounded-full px-10 py-3 w-[15rem] ease-in-out duration-300 hover:scale-105"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}
          {isRegistering && (
            <Register
              name={name}
              email={email}
              password={password}
              phone={phone}
              city={city}
              employeeCount={employeeCount}
              company={company}
              setName={setName}
              setEmail={setEmail}
              setPassword={setPassword}
              setPhone={setPhone}
              setCity={setCity}
              setEmployeeCount={setEmployeeCount}
              setCompany={setCompany}
              isRegistering={isRegistering}
              registered={registered}
              // handleChange={handleChange}
              setIsRegistering={setIsRegistering}
              setRegistered={setRegistered}
              setOtpVerfication={setOtpVerfication}
            />
          )}
          {!isRegistering && !forgetPassword && !otpVeification && (
            <Login
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              hideModal={hideModal}
              setCanResend={setCanResend}
              setSecondsLeft={setSecondsLeft}
              setRegistered={setRegistered}
              setIsRegistering={setIsRegistering}
              setForgetPassword={setForgetPassword}
              setOtpVerfication={setOtpVerfication}
            />
          )}
          {!isRegistering && !registered && !otpVeification && forgetPassword && <ForgetPassword />}
          {!isRegistering && otpVeification && !forgetPassword && <OTPVeification email={email} setIsRegistering={setIsRegistering} setOtpVerfication={setOtpVerfication} setForgetPassword={setForgetPassword} setEmail={setEmail} />}
        </div>
      </Modal>
    </div>
  );
};

export default Authentication;
