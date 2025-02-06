import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { closeAddCompaniesDrawer } from "../../../../redux/reducers/misc";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const CompaniesDrawer = ({ fetchAllCompanies, closeDrawerHandler }) => {
  const [peoples, setPeoples] = useState([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [cookies] = useCookies();

  const dispatch = useDispatch();

  const addCompanyHandler = async (e) => {
    e.preventDefault();

    if (phone.length > 10) {
      toast.error("Phone no. must be 10 digits long");
      return;
    }

    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "company/create-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          companyname: name,
          email: email,
          contact: contact,
          phone: phone,
          website: website,
          gst_no: gstNo,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      closeDrawerHandler();
      fetchAllCompanies();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getAllPeoples = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "people/all-persons", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setPeoples(data.people);
    } catch (err) {
      toast(err.message);
    }
  };

  useEffect(() => {
    getAllPeoples();
  }, []);

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
        Corporate
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
          Add New Corporate
        </h2>

        <form onSubmit={addCompanyHandler} className="space-y-5">
          {/* Company Name */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Name
            </FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter Company Name"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Contact */}
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Contact
            </FormLabel>
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              type="text"
              placeholder="Enter Contact Name"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
            {/* Uncomment the below select component if you plan to add contact selection */}
            {/* <Select value={contactId} onChange={(e) => setContactId(e.target.value)} placeholder="Select Contact">
        {peoples.map((people) => (
          <option key={people._id} value={people._id}>
            {people.firstname + ' ' + people.lastname}
          </option>
        ))}
      </Select> */}
          </FormControl>

          {/* Phone */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Phone
            </FormLabel>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="number"
              className="no-scroll mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Phone Number"
            />
          </FormControl>

          {/* Email */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Email
            </FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter Email Address"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Website */}
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Website
            </FormLabel>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Enter Website URL"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* GST No. */}
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              GST No.
            </FormLabel>
            <Input
              value={gstNo}
              onChange={(e) => setGstNo(e.target.value)}
              placeholder="Enter GST No."
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            className="mt-1 w-full py-3 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
            colorScheme="blue"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompaniesDrawer;
