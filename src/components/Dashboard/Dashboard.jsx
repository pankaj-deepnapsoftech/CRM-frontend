import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Divider,
  Text,
} from "@chakra-ui/react";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import Loading from "../ui/Loading";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaChevronUp, FaChevronDown, FaWhatsapp } from "react-icons/fa6";
import { MdKeyboardArrowRight, MdOutlineSms } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { checkAccess } from "../../utils/checkAccess";
import { RiUserStarLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { TbUsersGroup } from "react-icons/tb";
import Cards from "./Cards";
import PieChart from "./PieChart";
import ListCard from "./ListCard";
import List2 from "./List2";
import { FaSms } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  const { role, ...auth } = useSelector((state) => state.auth);
  const { isAllowed, msg } = checkAccess(auth, "dashboard");
  const [cookies] = useCookies();
  const today = new Date();
  const [startDate, setStartDate] = useState(
    new Date(`${today.getMonth() + 1}/02/${today.getFullYear()}`)
      .toISOString()
      .substring(0, 10)
  );
  const [endDate, setEndDate] = useState(today.toISOString().substring(0, 10));

  const [employeeEmail, setEmployeeEmail] = useState();

  const durationOptionsList = [
    { value: "This month", label: "This month" },
    { value: "Last 3 months", label: "Last 3 months" },
    { value: "Last 6 months", label: "Last 6 months" },
    { value: "This Year", label: "This Year" },
  ];
  const [selectedDuration, setSelectedDuration] = useState({
    value: "This month",
    label: "This month",
  });

  const [invoiceStatus, setInvoiceStatus] = useState([]);
  const [proformaInvoiceStatus, setProformaInvoiceStatus] = useState([]);
  const [offerStatus, setOfferStatus] = useState([]);
  const [totalInvoiceStatus, setTotalInvoiceStatus] = useState(0);
  const [totalInvoicePaymentStatus, setTotalInvoicePaymentStatus] = useState(0);
  const [totalProformaInvoice, setTotalProformaInvoice] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);

  const [totalOffer, setTotalOffer] = useState(0);

  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [totalUnpaidInvoiceAmount, setTotalUnpaidInvoiceAmount] = useState(0);
  const [totalProformaInvoiceAmount, setTotalProformaInvoiceAmount] =
    useState(0);
  const [totalOfferAmount, setTotalOfferAmount] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPeople, setTotalPeople] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [followupLeads, setFollowupLeads] = useState(0);
  const [completedLeads, setCompletedLeads] = useState(0);
  const [cancelledLeads, setCancelledLeads] = useState(0);

  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [productDropdown, setProductDropdown] = useState(false);
  const [followupDropdown, setFollowupDropdown] = useState(false);

  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalProformaInvoices, setTotalProformaInvoices] = useState(0);
  const [totalOffers, setTotalOffers] = useState(0);
  const [totalUnpaidInvoices, setTotalUnpaidInvoices] = useState(0);
    const [smsData, setSmsData] = useState([]);
    const [emailData, setEmailData] = useState([]);
    const [whatsappData, setWhatsappData] = useState([]);
    const [totalSms, setTotalSms] = useState(0);
    const [totalEmail, setTotalEmail] = useState(0);
    const [totalWhatsapp, setTotalWhatsapp] = useState(0);

  const progressStyles = {
    draft: {
      bg: "#6a6a6a",
    },
    pending: {
      bg: "#f17f7f",
    },
    sent: {
      bg: "#41ad5e",
    },
    unpaid: {
      bg: "#f17f7f",
    },
    declined: {
      bg: "#6a6a6a",
    },
    "partially paid": {
      bg: "#ff8b46",
    },
    paid: {
      bg: "#41ad5e",
    },
    accepted: {
      bg: "#41ad5e",
    },
  };

  const fetchInvoiceStats = async (from, to) => {
    try {
      const response = await fetch(baseUrl + "dashboard/invoice-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          fromDate: from,
          toDate: to,
          employee: employeeEmail ? employeeEmail : undefined,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setInvoiceStatus(data.invoices);
      setTotalInvoiceStatus(data.totalInvoiceStatus);
      setTotalInvoicePaymentStatus(data.totalInvoiceStatus);
      setTotalInvoices(data.totalInvoices);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchProformaInvoiceStats = async (from, to) => {
    try {
      const response = await fetch(
        baseUrl + "dashboard/proforma-invoice-summary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies?.access_token}`,
          },
          body: JSON.stringify({
            fromDate: from,
            toDate: to,
            employee: employeeEmail ? employeeEmail : undefined,
          }),
        }
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setProformaInvoiceStatus(data.proformaInvoices);
      setTotalProformaInvoice(data.totalProformaInvoices);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchOfferStats = async (from, to) => {
    try {
      const response = await fetch(baseUrl + "dashboard/offer-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          fromDate: from,
          toDate: to,
          employee: employeeEmail ? employeeEmail : undefined,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setOfferStatus(data.offers);
      setTotalOffer(data.totalOffers);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchTotalCustomer = async (from, to) => {
    try {
      const response = await fetch(baseUrl + "dashboard/customer-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          fromDate: from,
          toDate: to,
          employee: employeeEmail ? employeeEmail : undefined,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setTotalCustomer(data.totalCustomers);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchAmountSummary = async (from, to) => {
    try {
      const response = await fetch(baseUrl + "dashboard/amount-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          fromDate: from,
          toDate: to,
          employee: employeeEmail ? employeeEmail : undefined,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setTotalInvoiceAmount(data.totalInvoiceAmount);
      setTotalUnpaidInvoiceAmount(data.totalUnpaidInvoiceAmount);
      setTotalProformaInvoiceAmount(data.totalProformaInvoiceAmount);
      setTotalOfferAmount(data.totalOfferAmount);

      setTotalInvoices(data.totalInvoices);
      setTotalUnpaidInvoices(data.totalUnpaidInvoices);
      setTotalOffers(data.totalOffers);
      setTotalProformaInvoices(data.totalProformaInvoices);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchSupportSummary = async (from, to) => {
    try {
      const response = await fetch(baseUrl + "dashboard/support-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          fromDate: from,
          toDate: to,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchProductStats = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "dashboard/product-summary",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setProducts(data.products);
      setCategories(data.categories);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchLeadStats = async (from, to) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "dashboard/leads-summary",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromDate: from,
            toDate: to,
            employee: employeeEmail ? employeeEmail : undefined,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setFollowupLeads(data.leads["Follow Up"]);
      setCompletedLeads(data.leads["Completed"]);
      setCancelledLeads(data.leads["Cancelled"]);
      setTotalLeads(data.totalLeads);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchEmployeeStats = async (from, to) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "dashboard/employee-summary",
        {
          method: "Get",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setTotalEmployees(data.totalEmployees);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchPeopleStats = async (from, to) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "dashboard/people-summary",
        {
          method: "Get",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setTotalPeople(data.totalPeople);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchCompanyStats = async (from, to) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "dashboard/company-summary",
        {
          method: "Get",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setTotalCompanies(data.totalCompanies);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchAllData = async (from, to) => {
    setInvoiceStatus([]);
    setProformaInvoiceStatus([]);
    setOfferStatus([]);
    setTotalInvoiceAmount(0);
    setTotalCustomer(0);
    setTotalInvoicePaymentStatus(0);
    setTotalProformaInvoiceAmount(0);
    setTotalOfferAmount(0);
    setTotalUnpaidInvoiceAmount(0);
    setTotalInvoices(0);
    setTotalOffers(0);
    setTotalProformaInvoices(0);
    setTotalLeads(0);
    setFollowupLeads(0);
    setCancelledLeads(0);
    setCompletedLeads(0);
    setTotalOffer(0);
    setTotalUnpaidInvoiceAmount(0);
    setTotalOfferAmount(0);
    setProducts(0);
    setTotalEmployees(0);
    setTotalPeople(0);
    setTotalCompanies(0);

    fetchInvoiceStats(from, to);
    fetchProformaInvoiceStats(from, to);
    fetchOfferStats(from, to);
    fetchTotalCustomer(from, to);
    fetchAmountSummary(from, to);
    // fetchFollowUpStats(from, to);
    fetchProductStats();
    fetchLeadStats(from, to);
    fetchSupportSummary(from, to);
    fetchEmployeeStats();
    fetchPeopleStats();
    fetchCompanyStats();
  };

  const filterBasedOnDate = async () => {
    const start = startDate.split("-");
    const end = endDate.split("-");

    let fromDate = moment().set({
      date: start[2],
      month: start[1] - 1,
      year: start[0],
      hour: 0,
      minutes: 0,
      seconds: 0,
    })._d;
    let toDate = moment().set({
      date: end[2],
      month: end[1] - 1,
      year: end[0],
      hour: 23,
      minutes: 59,
      seconds: 59,
    })._d;

    fetchAllData(fromDate, toDate);

    countMessagesByDateRange(fromDate, toDate);
    countTotalEmailSentByRange(fromDate, toDate);
    countTotalWhatsappSentByRange(fromDate, toDate);
  };

  const filterBasedOnDuration = async () => {
    let fromDate;
    let toDate;

    switch (selectedDuration?.value) {
      case "This month":
        toDate = new Date();
        fromDate = moment().set({
          date: 1,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        })._d;
        break;
      case "Last 3 months":
        toDate = new Date();
        fromDate = moment()
          .subtract(3, "months")
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })._d;
        break;
      case "Last 6 months":
        toDate = new Date();
        fromDate = moment()
          .subtract(6, "months")
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })._d;
        break;
      default:
        toDate = new Date();
        fromDate = moment()
          .subtract(1, "year")
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })._d;
        break;
    }

    fetchAllData(fromDate, toDate);
  };

  useEffect(() => {
    if (isAllowed) {
      filterBasedOnDuration();
    }
  }, []);


  const fetchBulkSms = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}sms/get-bulk-sms/`,
      {
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      }
    );

    setSmsData(res.data.logs);
  };

  const fetchBulkEmail = async() => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}people/get-bulk-mail`,
      {
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      }
    );

    setEmailData(res.data.data);
  }

  const fetchBulkWhatsapp = async() => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}people/get-bulk-whatsapp`,
      {
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      }
    );

    setWhatsappData(res.data.data);
  }
  useEffect(() => {
    fetchBulkSms();
    fetchBulkEmail();
    fetchBulkWhatsapp();
  }, []);

  useEffect(() => {
      setTotalSms(countTotalMessages());
      setTotalEmail(emailData.length);
      setTotalWhatsapp(whatsappData.length);
    }, [smsData, emailData, whatsappData]);
  


  const countTotalMessages = () => {
    return smsData.reduce((count, data) => count + data.mobiles.length, 0);
  };

  const countMessagesByDateRange = (fromDate, toDate) => {
    const startDate = new Date(fromDate).toISOString().split('T')[0];
    const endDate = new Date(toDate).toISOString().split('T')[0];
  
    const filteredData = smsData.filter((data) => {
      const messageDate = new Date(data.timestamp).toISOString().split('T')[0];
      return messageDate >= startDate && messageDate <= endDate;
    });
    setTotalSms(filteredData.reduce((count, data) => count + data.mobiles.length, 0));
  };

  const countTotalEmailSentByRange = (fromDate, toDate) => {
    const startDate = new Date(fromDate).toISOString().split('T')[0];
    const endDate = new Date(toDate).toISOString().split('T')[0];
  
    const filteredData = emailData.filter((data) => {
      const messageDate = new Date(data.emailSentDate).toISOString().split('T')[0];
      return messageDate >= startDate && messageDate <= endDate;
    });
    setTotalEmail(filteredData.length);
  };

  const countTotalWhatsappSentByRange = (fromDate, toDate) => {
    const startDate = new Date(fromDate).toISOString().split('T')[0];
    const endDate = new Date(toDate).toISOString().split('T')[0];
  
    const filteredData = whatsappData.filter((data) => {
      const messageDate = new Date(data.whatsappSentDate).toISOString().split('T')[0];
      return messageDate >= startDate && messageDate <= endDate;
    });
    setTotalWhatsapp(filteredData.length);
  };
  



  return (
    <>
      {!isAllowed && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#ff6f6f] flex gap-x-2">
          {/* {!isSubscribed ? 'Subscribe to unlock!' : 'You do not have access to this route. Contact your Super Admin for further action.'} */}
          {msg}
          {((auth?.isSubscribed && auth?.isSubscriptionEnded) ||
            (auth?.isTrial && auth?.isTrialEnded)) && (
            <div className="-mt-1">
              <Link to="/pricing">
                <button className="text-base border border-[#d61616] rounded-md px-5 py-1 bg-[#d61616] text-white font-medium hover:bg-white hover:text-[#d61616] ease-in-out duration-300">
                  Pay Now
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {isAllowed && (
        <div>
          <div className="flex flex-wrap gap-x-2 justify-between">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                filterBasedOnDate();
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-x-2 gap-y-4 sm:gap-y-0 items-center w-full"
            >
              <FormControl>
                <FormLabel fontWeight="bold">From</FormLabel>
                <Input
                  backgroundColor="white"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                  placeholder="Date"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold">To</FormLabel>
                <Input
                  backgroundColor="white"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  type="date"
                  placeholder="Date"
                  min={startDate}
                />
              </FormControl>
              <Button
                type="submit"
                className="mt-4 sm:mt-7 w-1/2"
                color="white"
                colorScheme="blue"
              >
                Apply
              </Button>
            </form>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                filterBasedOnDuration();
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4 sm:gap-y-0 items-center w-full"
            >
              <div className="mt-2 mb-5 pt-2">
                <label className="font-bold">Duration</label>
                <Select
                  className="rounded mt-2"
                  options={durationOptionsList}
                  placeholder="Select duration"
                  value={selectedDuration}
                  onChange={(d) => {
                    setSelectedDuration(d);
                  }}
                  isSearchable={true}
                />
              </div>
              <Button
                type="submit"
                className="mt-4 sm:mt-7 w-1/3"
                color="white"
                colorScheme="blue"
              >
                Apply
              </Button>
            </form>
          </div>

          {role === "Super Admin" && (
            <div className="mb-4">
              <h1 className="mb-1 font-bold">Analyze Employee Performance</h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  filterBasedOnDate();
                }}
                className="flex flex-wrap gap-2"
              >
                <FormControl className="w-full sm:w-64">
                  <Input
                    backgroundColor="white"
                    value={employeeEmail || ""}
                    onChange={(e) => setEmployeeEmail(e.target.value)}
                    type="email"
                    placeholder="Type Employee's Email-id"
                  />
                </FormControl>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Button
                    type="submit"
                    color="white"
                    className="w-full sm:w-40"
                    colorScheme="blue"
                  >
                    Apply
                  </Button>
                  <Button
                    type="submit"
                    color="white"
                    className="w-full sm:w-40"
                    colorScheme="orange"
                    onClick={() => setEmployeeEmail("")}
                  >
                    Admin Dashboard
                  </Button>
                </div>
              </form>
            </div>
          )}
          <Divider className="my-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-2">
            <Link to="admins">
              <Cards
                label="Total Employees"
                content={totalEmployees}
                bg="from-indigo-500 to-purple-500"
                Icon={RiUserStarLine}
                iconColor="text-indigo-500"
              />
            </Link>

            <Link to="individuals">
              <Cards
                label=" Total Individuals"
                content={totalPeople}
                bg="from-orange-400 to-orange-600"
                Icon={TbUsersGroup}
                iconColor="text-orange-700"
              />
            </Link>

            <Link to="corporates">
              <Cards
                label="Total Corporates"
                content={totalCompanies}
                bg="from-green-400 to-green-600"
                Icon={RiUserStarLine}
                iconColor="text-green-700"
              />
            </Link>

          
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-y-2 gap-x-2">
          <Link to="leads">
              <Cards
                label="Total Bulk SMS"
                content={totalSms}
                bg="from-cyan-500 to-cyan-700"
                Icon={MdOutlineSms}
                iconColor="text-cyan-500"
              />
            </Link>
            <Link to="leads">
              <Cards
                label="Total Whatsapp"
                content={totalWhatsapp}
                bg="from-rose-400 to-rose-500"
                Icon={FaWhatsapp}
                iconColor="text-rose-500"
              />
            </Link>
            <Link to="leads">
              <Cards
                label="Total Email"
                content={totalEmail}
                bg="from-slate-400 to-slate-500"
                Icon={AiOutlineMail  }
                iconColor="text-slate-500"
              />
            </Link>
          </div>

       
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PieChart
              totalLeads={totalLeads}
              canceledLeads={cancelledLeads}
              completedLeads={completedLeads}
              followupLeads={followupLeads}
            />

            {/* List Card */}
            <div className="col-span-1">
              <ListCard
                totalOffers={totalOffers}
                OfferAmount={totalOfferAmount.toFixed(2)}
                totalInvoices={totalInvoices}
                InvoiceAmount={totalInvoiceAmount.toFixed(2)}
                totalProformaInvoices={totalProformaInvoices}
                ProformaInvoiceAmount={totalProformaInvoiceAmount.toFixed(2)}
                totalUnpaidInvoices={totalUnpaidInvoices}
                UnpaidInvoiceAmount={totalUnpaidInvoiceAmount.toFixed(2)}
                products={products.length}
              />
            </div>
          </div>

          

        </div>
      )}
    </>
  );
};

export default Dashboard;
