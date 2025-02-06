import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userExists } from "../redux/reducer/auth";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const dispatch = useDispatch();

  const loginWithToken = async ()=>{
    try{
      const url = process.env.REACT_APP_BACKEND_URL+'organization/login-with-token';
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${cookies.organization_access_token}`
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

  useEffect(()=>{
    if(!location?.state?.razorpay_payment_id){
      navigate('/');
    }
    else{
      loginWithToken();
    }
  }, []);

  return (
    <div className="w-[30rem] my-32 mx-auto">
      <div className="flex justify-center">
        <FaCheckCircle color="#0aa910" size="100" />
      </div>
      <div className="subscription-font text-4xl text-center font-bold mt-4 mb-2">Thank You!</div>
      <div className="subscription-font text-2xl text-center">Payment Successful</div>
      <div className="subscription-font text-center">Reference Id: {location?.state?.razorpay_payment_id}</div>
      <div className="text-center mt-4">
        <Link to="/">
          <button
            style={{
              background:
                "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
            }}
            className="subscription-font w-[20rem] border px-8 py-2 text-lg rounded-md text-white ease-in-out duration-500 hover:scale-105"
          >
            Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
