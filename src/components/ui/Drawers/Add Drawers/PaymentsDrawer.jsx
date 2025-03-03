import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import Loading from "../../Loading";

const PaymentsDrawer = ({ closeDrawerHandler, dataId: invoiceId, getAllInvoices }) => {
  const [cookies] = useCookies();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState();
  const [reference, setReference] = useState();
  const [description, setDescription] = useState();
  const [payment, setPayment] = useState();
  const [details, setDetails] = useState({});

  const paymentOptionsList = [
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "NEFT", label: "NEFT" },
    { value: "RTGS", label: "RTGS" },
    { value: "Cheque", label: "Cheque" },
  ];

  const addPaymentHandler = async (e) => {
    e.preventDefault();

    if(amount <= 0){
      toast.error('Amount must be greater than 0');
      return;
    }
    
    try {
      setLoading(true);
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "payment/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          invoiceId,
          amount: +amount,
          description,
          reference,
          mode: payment?.value,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data?.message);
      }
      setLoading(false);
      toast.success(data?.message);
      closeDrawerHandler();
      getAllInvoices();
    } catch (err) {
      toast.error(err?.message);
    }
    finally{
      setLoading(false);
    }
  };

  const getInvoiceDetails = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "invoice/invoice-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          invoiceId: invoiceId,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data?.message);
      }

      setDetails({
        invoicename: data.invoice?.invoicename,
        total: data.invoice?.total,
        subtotal: data.invoice?.subtotal,
        status: data.invoice?.status,
        phone: data.invoice?.customer?.people
          ? data.invoice.customer?.people?.phone
          : data.invoice?.customer?.company?.phone,
        email: data.invoice?.customer?.people
          ? data.invoice.customer?.people?.email
          : data.invoice?.customer?.company?.email,
        customertype: data.invoice?.customer?.people
          ? "Individual"
          : "Corporate",
        customer: data.invoice?.customer?.people
          ? data.invoice.customer?.people?.firstname +
            " " +
            (data.invoice.customer?.people?.lastname || '')
          : data.invoice.customer?.company?.companyname,
        taxamount: data.invoice?.tax[0]?.taxamount,
        taxname: data.invoice?.tax[0]?.taxname,
        taxpercentage: data.invoice?.tax[0]?.taxpercentage,
        paymentstatus: data.invoice?.paymentstatus,
        paid: data.invoice?.paid,
        balance: data.invoice?.balance,
      });

      setLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getInvoiceDetails();
  }, []);

  return (
    <>
    {loading && <Loading />}
    {!loading && (
      <div
        className="overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-6 px-4"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 6px 16px 0px, rgba(0, 0, 0, 0.1) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
          borderRadius: '8px',
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-2xl font-bold text-gray-700 py-4 border-b-2 border-gray-200">
          <BiX onClick={closeDrawerHandler} size="26px" />
          <span>Payment</span>
        </h1>
  
        <div className="mt-8 px-5">
          <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
            Payment for invoice #{details?.invoicename}
          </h2>
  
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-bold">Customer Name:</p>
              <p className="font-normal text-gray-600">{details?.customer}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Phone:</p>
              <p className="font-normal text-gray-600">{details?.phone}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Email:</p>
              <p className="font-normal text-gray-600">{details?.email}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Payment status:</p>
              <p className="font-normal text-gray-600">{details?.paymentstatus}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Subtotal:</p>
              <p className="font-normal text-gray-600">&#8377;{details?.subtotal}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Tax:</p>
              <p className="font-normal text-gray-600">{details?.taxname}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Tax Amount:</p>
              <p className="font-normal text-gray-600">&#8377;{details?.taxamount}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Total:</p>
              <p className="font-normal text-gray-600">&#8377;{details?.total}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Paid:</p>
              <p className="font-normal text-gray-600">&#8377;{details?.paid}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Balance:</p>
              <p className="font-normal text-gray-600">&#8377;{details?.balance}</p>
            </div>
          </div>
  
          {details?.balance > 0 && (
            <form onSubmit={addPaymentHandler} className="mt-6">
              <FormControl className="mb-6" isRequired>
                <FormLabel fontWeight="bold" className="text-gray-700">
                  Amount
                </FormLabel>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="Amount"
                  className="py-2 px-4 border rounded-lg shadow-sm w-full"
                />
              </FormControl>
  
              <div className="mt-2 mb-6">
                <label className="font-bold text-gray-700">Mode</label>
                <Select
                  className="rounded-lg mt-2 shadow-sm react-select-container"
                  options={paymentOptionsList}
                  placeholder="Select mode"
                  value={payment}
                  onChange={(d) => {
                    setPayment(d);
                  }}
                  isSearchable={true}
                />
              </div>
  
              <FormControl className="mb-6" isRequired>
                <FormLabel fontWeight="bold" className="text-gray-700">
                  Description
                </FormLabel>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  placeholder="Description"
                  className="py-2 px-4 border rounded-lg shadow-sm w-full"
                />
              </FormControl>
  
              <FormControl className="mb-6" isRequired>
                <FormLabel fontWeight="bold" className="text-gray-700">
                  Reference
                </FormLabel>
                <Input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  type="text"
                  placeholder="Reference"
                  className="py-2 px-4 border rounded-lg shadow-sm w-full"
                />
              </FormControl>
  
              <Button
                type="submit"
                className="mt-4 w-full py-2 bg-[#1640d6] text-white font-bold rounded-lg hover:bg-[#1236b1] transition"
              >
                Submit Payment
              </Button>
            </form>
          )}
        </div>
      </div>
    )}
  </>
  
  );
};

export default PaymentsDrawer;
