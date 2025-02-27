import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../../Loading";
import Select from "react-select";

const CustomersEditDrawer = ({
  dataId: id,
  closeDrawerHandler,
  fetchAllCustomers,
}) => {
  const [cookies] = useCookies();
  const [type, setType] = useState("");
  const [people, setPeople] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [peoples, setPeoples] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showSelectPeoples, setShowSelectPeoples] = useState(true);
  const [showSelectCompanies, setShowSelectCompanies] = useState(true);

  const [statusId, setStatusId] = useState();

  const statusOptions = [
    { value: "Deal Done", label: "Deal Done" },
    { value: "Proforma Invoice Sent", label: "Proforma Invoice Sent" },
    { value: "Invoice Sent", label: "Invoice Sent" },
    { value: "Payment Received", label: "Payment Received" },
  ];

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

  const fetchCustomerDetails = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "customer/customer-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          customerId: id,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (!data.success) {
        throw new Error(data.message);
      }

      setStatusId({ value: data.customer.status, label: data.customer.status });
      // setType(data.customer?.customerType);
      // setCompany(data.customer?.company);
      // setPeople(data.customer?.people);

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const editCustomersHandler = async (e) => {
    e.preventDefault();

    if (!statusId?.value) {
      toast.error("Status not selected");
      return;
    }

    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "customer/edit-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          customerId: id,
          status: statusId?.value,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      closeDrawerHandler();
      fetchAllCustomers();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
    getAllCompanies();
    getAllPeoples();
  }, []);

  useEffect(() => {
    setShowSelectPeoples(type === "People" ? true : false);
    setShowSelectCompanies(type === "Company" ? true : false);
    setPeople("");
    setCompany("");
  }, [type]);

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
        Customer
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-3xl bg-blue-200 font-bold py-5 text-center mb-8 border-y border-gray-200  rounded-md shadow-md">
          Edit Customer
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <form onSubmit={editCustomersHandler}>
            <div>
              <div className="mt-2 mb-5">
                <label className="font-bold">Status</label>
                <Select
                  className="rounded mt-2"
                  options={statusOptions}
                  placeholder="Select source"
                  value={statusId}
                  onChange={(d) => {
                    // setSourceLabel(d);
                    setStatusId(d);
                  }}
                  isSearchable={true}
                />
              </div>
            </div>
            {/* <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Type</FormLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Select type"
            >
              <option value="People">People</option>
              <option value="Company">Company</option>
            </Select>
          </FormControl>
          {(showSelectPeoples || type === "") && (
            <FormControl className="mt-2 mb-5">
              <FormLabel fontWeight="bold">People</FormLabel>
              <Select
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="Select person"
              >
                {peoples.map((people) => (
                  <option key={people._id} value={people._id}>
                    {people.firstname + " " + people.lastname}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
          {(showSelectCompanies || type === "") && (
            <FormControl className="mt-2 mb-5">
              <FormLabel fontWeight="bold">Company</FormLabel>
              <Select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Select company"
              >
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          )} */}
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

export default CustomersEditDrawer;
