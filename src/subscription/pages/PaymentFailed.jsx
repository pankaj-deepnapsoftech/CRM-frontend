import { Link } from "react-router-dom";
import { IoMdCloseCircle } from "react-icons/io";

const PaymentFailed = () => {
  return (
    <div className='w-[30rem] my-32 mx-auto'>
        <div className="flex justify-center">
            <IoMdCloseCircle color="#ff2c2c" size="100" />
        </div>
        <div className="subscription-font text-4xl text-center font-bold mt-4 mb-2">Please, Try Again!</div>
        <div className="subscription-font text-2xl text-center">Payment Failed</div>
        <div className="text-center mt-4">
            <Link to="/"><button style={{background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)'}} className='subscription-font w-[20rem] border px-8 py-2 text-lg rounded-md text-white ease-in-out duration-500 hover:scale-105'>Home</button></Link>
        </div>
    </div>
  )
}

export default PaymentFailed