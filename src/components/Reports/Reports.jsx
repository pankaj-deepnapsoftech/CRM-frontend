import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button, Input } from "@chakra-ui/react";
import Loading from "../ui/Loading";
import { checkAccess } from "../../utils/checkAccess";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const { role, ...auth } = useSelector((state) => state.auth);
  const { isAllowed, msg } = checkAccess(auth, "report");
  const [paymentStats, setPaymentStats] = useState(Array(12).fill(0));
  const [expenseStats, setExpenseStats] = useState(Array(12).fill(0));
  const [individualsStats, setIndividualsStats] = useState(Array(31).fill(0));
  const [corporatesStats, setCorporatesStats] = useState(Array(31).fill(0));
  const [leadsStats, setLeadsStats] = useState(Array(31).fill(0));
  const [followupLeadsStats, setFollowupLeadsStats] = useState(
    Array(31).fill(0)
  );
  const [cookies, setCookies] = useCookies();
  const [year, setYear] = useState(new Date().getFullYear());
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [totalUnpaidInvoiceAmount, setTotalUnpaidInvoiceAmount] = useState(0);
  const [totalProformaInvoiceAmount, setTotalProformaInvoiceAmount] =
    useState(0);
  const [totalOfferAmount, setTotalOfferAmount] = useState(0);

  const month = new Date().getMonth();
  const [individualsSelectedMonth, setIndividualsSelectedMonth] = useState({
    value: month + 1,
    label: months[month],
  });
  const [individualsSelectedYear, setIndividualsSelectedYear] = useState(
    new Date().getFullYear()
  );
  const [corporatesSelectedMonth, setCorporatesSelectedMonth] = useState({
    value: month + 1,
    label: months[month],
  });
  const [corporatesSelectedYear, setCorporatesSelectedYear] = useState(
    new Date().getFullYear()
  );
  const [leadsSelectedMonth, setLeadsSelectedMonth] = useState({
    value: month + 1,
    label: months[month],
  });
  const [leadsSelectedYear, setLeadsSelectedYear] = useState(
    new Date().getFullYear()
  );
  const [followupLeadsSelectedMonth, setFollowupLeadsSelectedMonth] = useState({
    value: month + 1,
    label: months[month],
  });
  const [followupLeadsSelectedYear, setFollowupLeadsSelectedYear] = useState(
    new Date().getFullYear()
  );


  const monthOptions = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" },
  ];

  const paymentOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Payment Report",
      },
    },
  };

  const expenseOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Expense Report",
      },
    },
  };

  const individualsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Individuals Report",
      },
    },
  };

  const corporatesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Corporates Report",
      },
    },
  };

  const leadsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Leads Report",
      },
    },
  };

  const followupLeadsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Follow Up Leads Report",
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateLabels = [];
  for (let i = 1; i <= 31; i++) {
    dateLabels.push(i.toString());
  }

  const paymentData = {
    labels,
    datasets: [
      {
        label: "Payment",
        data: paymentStats,
        backgroundColor: "#2389ff",
      },
    ],
  };

  const expenseData = {
    labels,
    datasets: [
      {
        label: "Expense",
        data: expenseStats,
        backgroundColor: "#ff6f6f",
      },
    ],
  };

  const individualsData = {
    labels: dateLabels,
    datasets: [
      {
        label: "Individuals",
        data: individualsStats,
        backgroundColor: "#41ad5e",
      },
    ],
  };

  const corporatesData = {
    labels: dateLabels,
    datasets: [
      {
        label: "Corporates",
        data: corporatesStats,
        backgroundColor: "#ff8b46",
      },
    ],
  };

  const leadsData = {
    labels: dateLabels,
    datasets: [
      {
        label: "Leads",
        data: leadsStats,
        backgroundColor: "#ff6f6f",
      },
    ],
  };

  const followupLeadsData = {
    labels: dateLabels,
    datasets: [
      {
        label: "Follow Up Leads",
        data: followupLeadsStats,
        backgroundColor: "#ff6f6f",
      },
    ],
  };

  const getPaymentReport = async () => {
    setPaymentStats(Array(12).fill(0));
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(baseUrl + "report/get-payment-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: new Date(`${year}-01-01 00:00:00`),
          to: new Date(`${year}-12-31 11:59:59`),
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      const results = Array(12).fill(0);
      data.payments.forEach((payment) => {
        results[+payment._id] = payment.total_amount;
      });
      setPaymentStats(results);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getExpenseReport = async () => {
    setPaymentStats(Array(12).fill(0));
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(baseUrl + "report/get-expense-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: new Date(`${year}-01-01 00:00:00`),
          to: new Date(`${year}-12-31 11:59:59`),
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      const results = Array(12).fill(0);
      data.expenses.forEach((expense) => {
        results[+expense._id] = expense.total_amount;
      });
      setExpenseStats(results);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getIndividualsReport = async () => {
    if (!individualsSelectedMonth || !individualsSelectedYear) {
      return;
    }
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(baseUrl + "report/get-individual-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${individualsSelectedMonth?.value}-01-${individualsSelectedYear}`,
          to: `${individualsSelectedMonth?.value}-${
            individualsSelectedMonth?.value === 8 ||
            individualsSelectedMonth?.value % 2 !== 0
              ? "31"
              : "30"
          }-${individualsSelectedYear}`,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setIndividualsStats(data.individuals);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getCorporatesReport = async () => {
    if (!corporatesSelectedMonth || !corporatesSelectedYear) {
      return;
    }
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(baseUrl + "report/get-corporate-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${corporatesSelectedMonth?.value}-01-${corporatesSelectedYear}`,
          to: `${corporatesSelectedMonth?.value}-${
            corporatesSelectedMonth?.value === 8 ||
            corporatesSelectedMonth?.value % 2 !== 0
              ? "31"
              : "30"
          }-${corporatesSelectedYear}`,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setCorporatesStats(data.corporates);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getLeadsReport = async () => {
    if (!leadsSelectedMonth || !leadsSelectedYear) {
      return;
    }
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(baseUrl + "report/get-lead-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${leadsSelectedMonth?.value}-01-${leadsSelectedYear}`,
          to: `${leadsSelectedMonth?.value}-${
            leadsSelectedMonth?.value === 8 ||
            leadsSelectedMonth?.value % 2 !== 0
              ? "31"
              : "30"
          }-${leadsSelectedYear}`,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setLeadsStats(data.leads);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getFollowupLeadsReport = async () => {
    if (!followupLeadsSelectedMonth || !followupLeadsSelectedYear) {
      return;
    }
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(
        baseUrl + "report/get-followup-lead-report",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `${followupLeadsSelectedMonth?.value}-01-${followupLeadsSelectedYear}`,
            to: `${followupLeadsSelectedMonth?.value}-${
              followupLeadsSelectedMonth?.value === 8 ||
              followupLeadsSelectedMonth?.value % 2 !== 0
                ? "31"
                : "30"
            }-${followupLeadsSelectedYear}`,
          }),
        }
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setFollowupLeadsStats(data.leads);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchAmountSummary = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(baseUrl + "dashboard/amount-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          fromDate: new Date(`${year}-01-01 00:00:00`),
          toDate: new Date(`${year}-12-31 11:59:59`),
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
    } catch (err) {
      toast.error(err.message);
    }
  };


  useEffect(() => {
    if (isAllowed) {
      getPaymentReport();
      getExpenseReport();
      fetchAmountSummary();
      getIndividualsReport();
      getCorporatesReport();
      getLeadsReport();
      getFollowupLeadsReport();
    }
  }, [year]);

  return (
    <>
      {!isAllowed && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#ff6f6f] flex gap-x-2">
          {msg}
          {auth?.isTrial && !auth?.isTrialEnded && (
            <div className="-mt-1">
              <Link to="/pricing">
                <button className="text-base border border-[#d61616] rounded-md px-5 py-1 bg-[#d61616] text-white font-medium hover:bg-white hover:text-[#d61616] ease-in-out duration-300">
                  {auth?.account?.trial_started || auth?.isSubscriptionEnded
                    ? "Upgrade"
                    : "Activate Free Trial"}
                </button>
              </Link>
            </div>
          )}
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
          <div>
            <div className="w-fit mt-2 mb-2 mr-0 ml-auto">
              <Input
                type="number"
                min="2000"
                max="2099"
                step="1"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-2">
            <div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="text-xl border-b pb-4 font-bold text-[#22075e]">
                Invoices
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                <span className="bg-[#0095ff] text-[#ffffff] rounded px-2 ml-1 py-1">
                  Rs {totalInvoiceAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="text-xl border-b font-bold pb-4 text-[#22075e]">
                Proforma Invoices
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                <span className="bg-[#41ad5e] text-[#ffffff] rounded px-2 ml-1 py-1">
                  Rs {totalProformaInvoiceAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="text-xl border-b font-bold pb-4 text-[#22075e]">
                Offers
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                <span className="bg-[#ff8b46] text-[#ffffff] rounded px-2 ml-1 py-1">
                  Rs {totalOfferAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="text-xl border-b pb-4 font-bold text-[#22075e]">
                Unpaid Invoices
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                <span className="bg-[#ff6565] text-[#ffffff] rounded px-2 ml-1 py-1">
                  Rs {totalUnpaidInvoiceAmount.toFixed(2)}
                </span>
              </div>
            </div>
            
          </div>

          <div>
            <div>
              <div className="flex justify-between items-center mt-10">
                <h1 className="text-2xl">Individuals Report</h1>
                <div className="flex gap-2">
                  <Select
                    className="w-[200px]"
                    options={monthOptions}
                    value={individualsSelectedMonth}
                    onChange={(e) => setIndividualsSelectedMonth(e)}
                  />
                  <Input
                    width={200}
                    type="number"
                    min="2000"
                    max="2099"
                    step="1"
                    value={individualsSelectedYear}
                    onChange={(e) => setIndividualsSelectedYear(e.target.value)}
                  />
                  <Button
                    fontSize={{ base: "14px", md: "14px" }}
                    paddingX={{ base: "10px", md: "12px" }}
                    paddingY={{ base: "0", md: "3px" }}
                    width={{ base: "-webkit-fill-available", md: 200 }}
                    onClick={getIndividualsReport}
                    color="white"
                    backgroundColor="#1640d6"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <Bar options={individualsOptions} data={individualsData} />
            </div>
            <div>
              <div className="flex justify-between items-center mt-10">
                <h1 className="text-2xl">Corporates Report</h1>
                <div className="flex gap-2">
                  <Select
                    className="w-[200px]"
                    options={monthOptions}
                    value={corporatesSelectedMonth}
                    onChange={(e) => setCorporatesSelectedMonth(e)}
                  />
                  <Input
                    width={200}
                    type="number"
                    min="2000"
                    max="2099"
                    step="1"
                    value={corporatesSelectedYear}
                    onChange={(e) => setCorporatesSelectedYear(e.target.value)}
                  />
                  <Button
                    fontSize={{ base: "14px", md: "14px" }}
                    paddingX={{ base: "10px", md: "12px" }}
                    paddingY={{ base: "0", md: "3px" }}
                    width={{ base: "-webkit-fill-available", md: 200 }}
                    onClick={getCorporatesReport}
                    color="white"
                    backgroundColor="#1640d6"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <Bar options={corporatesOptions} data={corporatesData} />
            </div>
            <div>
              <div className="flex justify-between items-center mt-10">
                <h1 className="text-2xl">Leads Report</h1>
                <div className="flex gap-2">
                  <Select
                    className="w-[200px]"
                    options={monthOptions}
                    value={leadsSelectedMonth}
                    onChange={(e) => setLeadsSelectedMonth(e)}
                  />
                  <Input
                    width={200}
                    type="number"
                    min="2000"
                    max="2099"
                    step="1"
                    value={leadsSelectedYear}
                    onChange={(e) => setLeadsSelectedYear(e.target.value)}
                  />
                  <Button
                    fontSize={{ base: "14px", md: "14px" }}
                    paddingX={{ base: "10px", md: "12px" }}
                    paddingY={{ base: "0", md: "3px" }}
                    width={{ base: "-webkit-fill-available", md: 200 }}
                    onClick={getLeadsReport}
                    color="white"
                    backgroundColor="#1640d6"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <Bar options={leadsOptions} data={leadsData} />
            </div>
            <div>
              <div className="flex justify-between items-center mt-10">
                <h1 className="text-2xl">Follow Up Leads Report</h1>
                <div className="flex gap-2">
                  <Select
                    className="w-[200px]"
                    options={monthOptions}
                    value={followupLeadsSelectedMonth}
                    onChange={(e) => setFollowupLeadsSelectedMonth(e)}
                  />
                  <Input
                    width={200}
                    type="number"
                    min="2000"
                    max="2099"
                    step="1"
                    value={followupLeadsSelectedYear}
                    onChange={(e) =>
                      setFollowupLeadsSelectedYear(e.target.value)
                    }
                  />
                  <Button
                    fontSize={{ base: "14px", md: "14px" }}
                    paddingX={{ base: "10px", md: "12px" }}
                    paddingY={{ base: "0", md: "3px" }}
                    width={{ base: "-webkit-fill-available", md: 200 }}
                    onClick={getFollowupLeadsReport}
                    color="white"
                    backgroundColor="#1640d6"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <Bar options={followupLeadsOptions} data={followupLeadsData} />
            </div>
            <div>
              <div className="flex justify-between items-center mt-10">
                <h1 className="text-2xl">Payment Report</h1>
                <div className="w-fit">
                  <Input
                    type="number"
                    min="2000"
                    max="2099"
                    step="1"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>

              <Bar options={paymentOptions} data={paymentData} />
            </div>
            <div>
              <div className="flex justify-between items-center mt-10">
                <h1 className="text-2xl">Expense Report</h1>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="2000"
                    max="2099"
                    step="1"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>

              <Bar options={expenseOptions} data={expenseData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reports;
