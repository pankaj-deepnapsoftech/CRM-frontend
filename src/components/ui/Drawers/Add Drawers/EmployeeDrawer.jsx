import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { BiX } from "react-icons/bi";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const EmployeeDrawer = ({ fetchAllEmployees, closeDrawerHandler }) => {
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [designation, setDesignation] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [registering, setRegistering] = useState(false);

  const auth = useSelector((state) => state.auth);

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
          organizationEmail: auth.email,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(
        "Employee registration successful. OTP has been sent to the email id."
      );
      fetchAllEmployees();
      closeDrawerHandler();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div
      className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
      }}
    >
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
        <BiX onClick={closeDrawerHandler} size="26px" />
        Employee
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
          Add New Employee
        </h2>

        <form onSubmit={registerHandler} className="space-y-5">
          {/* Employee Name */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Name
            </FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter Name"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Employee Email */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Email
            </FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter Email"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Employee Phone */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Phone
            </FormLabel>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="number"
              placeholder="Enter Phone Number"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Employee Designation */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Designation
            </FormLabel>
            <Input
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              type="text"
              placeholder="Enter Designation"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Password Field with Toggle */}
          <FormControl className="mt-3 mb-5 relative" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Password
            </FormLabel>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
            {!showPassword ? (
              <IoEyeOffOutline
                onClick={() => setShowPassword(true)}
                size={20}
                className="absolute top-[42px] right-3 cursor-pointer"
              />
            ) : (
              <IoEyeOutline
                onClick={() => setShowPassword(false)}
                size={20}
                className="absolute top-[42px] right-3 cursor-pointer"
              />
            )}
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            className="mt-1 w-full py-3 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
           colorScheme="blue"
            isLoading={registering}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeDrawer;
