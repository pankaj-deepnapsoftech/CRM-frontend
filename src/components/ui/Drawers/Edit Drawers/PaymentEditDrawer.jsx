import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import Loading from "../../Loading";

const PaymentsEditDrawer = ({
  closeDrawerHandler,
  dataId: id,
  fetchAllPayments,
}) => {
  const [cookies] = useCookies();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [invoiceName, setInvoiceName] = useState();
  const [amount, setAmount] = useState();
  const [reference, setReference] = useState();
  const [description, setDescription] = useState();
  const [payment, setPayment] = useState();

  const paymentOptionsList = [
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "NEFT", label: "NEFT" },
    { value: "RTGS", label: "RTGS" },
    { value: "Cheque", label: "Cheque" },
  ];

  const editPaymentHandler = async (e) => {
    e.preventDefault();

    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    try {
      setLoading(true);
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "payment/edit-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          paymentId: id,
          amount: (+amount).toFixed(2),
          description,
          reference,
          mode: payment?.value,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      closeDrawerHandler();
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const fetchPaymentDetails = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "payment/payment-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          paymentId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setInvoiceName(data.payment?.invoice?.invoicename);
      setAmount(data.payment?.amount);
      setPayment({ value: data.payment?.mode, label: data.payment?.mode });
      setDescription(data.payment?.description);
      setReference(data.payment?.reference);

      setLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchPaymentDetails(id);
  }, []);

  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <div
          className="overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
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
            <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
              Payment for invoice #{invoiceName}
            </h2>

            <form onSubmit={editPaymentHandler} className="space-y-5">
              {/* Amount Input */}
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold" className="text-[#4B5563]">
                  Amount
                </FormLabel>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="Amount"
                  className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
                />
              </FormControl>

              {/* Payment Mode Select */}
              <div className="mt-2 mb-5">
                <label className="font-bold text-[#4B5563]">Mode</label>
                <Select
                  className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
                  options={paymentOptionsList}
                  placeholder="Select mode"
                  value={payment}
                  onChange={(d) => {
                    setPayment(d);
                  }}
                  isSearchable={true}
                />
              </div>

              {/* Description Input */}
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold" className="text-[#4B5563]">
                  Description
                </FormLabel>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  placeholder="Description"
                  className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
                />
              </FormControl>

              {/* Reference Input */}
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold" className="text-[#4B5563]">
                  Reference
                </FormLabel>
                <Input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  type="text"
                  placeholder="Reference"
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
      )}
    </>
  );
};

export default PaymentsEditDrawer;
