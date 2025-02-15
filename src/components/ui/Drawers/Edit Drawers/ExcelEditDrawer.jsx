import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Loading from "../../Loading";

const ExcelEditDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [companies, setCompanies] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const editPeopleHandler = async (e) => {
    e.preventDefault();

    if (phone.length > 10) {
      toast.error("Phone no. field must be 10 digits long");
      return;
    }

    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "people/edit-people", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          peopleId: id,
          firstname: firstname,
          lastname: lastname,
          email: email,
          companycompany: companyId,
          phone: phone,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      closeDrawerHandler();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchPeopleDetails = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "people/person-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          peopleId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setFirstname(data.person?.firstname);
      setLastname(data.person?.lastname);
      setCompanyId(data.person?.company);
      setPhone(data.person?.phone);
      setEmail(data.person?.email);

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      setIsLoading(false);
      toast.error(err.message);
    }
  };

  const getAllCompanies = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "company/all-companies", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setCompanies(data.companies);
    } catch (err) {
      toast(err.message);
    }
  };

  useEffect(() => {
    fetchPeopleDetails();
    getAllCompanies();
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
        Individuals
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
          Edit Individual
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <form onSubmit={editPeopleHandler} className="space-y-5">
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                First Name
              </FormLabel>
              <Input
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                type="text"
                placeholder="First Name"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Last Name
              </FormLabel>
              <Input
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                type="text"
                placeholder="Last Name"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            {/* Uncomment and adjust as needed */}
            {/* 
      <FormControl className="mt-3 mb-5">
        <FormLabel fontWeight="bold" className="text-[#4B5563]">
          Corporate
        </FormLabel>
        <Select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          placeholder="Select Corporate"
          className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.companyname}
            </option>
          ))}
        </Select>
      </FormControl>
      */}

            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Phone
              </FormLabel>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="number"
                placeholder="Phone"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 no-scrollbar"
              />
            </FormControl>

            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Email
              </FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            <Button
              type="submit"
              className="mt-1 w-full py-3 text-white font-bold rounded-lg"
              colorScheme="blue"
            >
              Submit
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ExcelEditDrawer;
