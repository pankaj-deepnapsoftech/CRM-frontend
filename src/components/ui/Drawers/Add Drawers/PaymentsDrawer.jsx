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
        throw new Error(data.message);
      }
      setLoading(false);
      toast.success(data.message);
      closeDrawerHandler();
      getAllInvoices();
    } catch (err) {
      toast.error(err.message);
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
        throw new Error(data.message);
      }

      setDetails({
        invoicename: data.invoice.invoicename,
        total: data.invoice.total,
        subtotal: data.invoice.subtotal,
        status: data.invoice.status,
        phone: data.invoice?.customer.people
          ? data.invoice.customer.people.phone
          : data.invoice?.customer.company.phone,
        email: data.invoice?.customer.people
          ? data.invoice.customer.people.email
          : data.invoice?.customer.company.email,
        customertype: data.invoice.customer?.people
          ? "Individual"
          : "Corporate",
        customer: data.invoice.customer?.people
          ? data.invoice.customer?.people.firstname +
            " " +
            (data.invoice.customer?.people.lastname || '')
          : data.invoice.customer?.company.companyname,
        taxamount: data.invoice?.tax[0].taxamount,
        taxname: data.invoice?.tax[0].taxname,
        taxpercentage: data.invoice?.tax[0].taxpercentage,
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
          className="overflow-auto overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
          }}
        >
          <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
            <BiX onClick={closeDrawerHandler} size="26px" />
            Payment
          </h1>

          <div className="mt-8 px-5">
            <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
              Payment for invoice #{details?.invoicename}
            </h2>
            <div>
              <div className="mt-2 mb-2 font-bold flex gap-x-2">
                <p>Customer Name :</p>
                <p className="font-normal">{details?.customer}</p>
              </div>
              <div className="mt-2 mb-2 font-bold flex gap-x-2">
                <p>Phone :</p>
                <p className="font-normal">{details?.phone}</p>
              </div>
              <div className="mt-2 mb-2 font-bold flex gap-x-2">
                <p>Email :</p>
                <p className="font-normal">{details?.email}</p>
              </div>
              <div className="mt-2 mb-2 font-bold flex gap-x-2">
                <p>Payment status :</p>
                <p className="font-normal">{details?.paymentstatus}</p>
              </div>
              <div className="mt-2 mb-2 font-bold flex gap-x-2">
                <p>Subtotal :</p>
                <p className="font-normal">&#8377;{details?.subtotal}</p>
              </div>
              <div className="mt-2 mb-2 font-bold flex gap-x-2">
                <p>Tax :</p>
                <p className="font-normal">{details?.taxname}</p>
              </div>
              <div className="mt-2 mb-2 font-bold flex gap-x-2">
                <p>Tax Amount :</p>
                <p className="font-normal">&#8377;{details?.taxamount}</p>
              </div>
              <div className="mt-2 mb-2 font-bold flex gap-x-2">
                <p>Total :</p>
                <p className="font-normal">&#8377;{details?.total}</p>
              </div>
              <div className="mt-2 mb-2 font-bold flex gap-x-2">
                <p>Paid :</p>
                <p className="font-normal">&#8377;{details?.paid}</p>
              </div>
              <div className="mt-2 mb-2 font-bold flex gap-x-2">
                <p>Balance :</p>
                <p className="font-normal">&#8377;{details?.balance}</p>
              </div>
            </div>

            {details?.balance > 0  && <form onSubmit={addPaymentHandler}>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Amount</FormLabel>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="Amount"
                />
              </FormControl>
              <div className="mt-2 mb-5">
                <label className="font-bold">Mode</label>
                <Select
                  className="rounded mt-2"
                  options={paymentOptionsList}
                  placeholder="Select mode"
                  value={payment}
                  onChange={(d) => {
                    setPayment(d);
                  }}
                  isSearchable={true}
                />
              </div>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">Description</FormLabel>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  placeholder="Description"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">Reference</FormLabel>
                <Input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  type="text"
                  placeholder="Reference"
                />
              </FormControl>

              <Button
                type="submit"
                className="mt-1"
                color="white"
                backgroundColor="#1640d6"
              >
                Submit
              </Button>
            </form>}
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentsDrawer;
