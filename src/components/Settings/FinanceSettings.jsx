import { useState, useEffect } from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../ui/Loading";
import { useSelector } from "react-redux";
import { checkAccess } from "../../utils/checkAccess";

const FinanceSettings = () => {
  const [cookies] = useCookies();
  const [reload, setReload] = useState();
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [proformaInvoiceNumber, setproformaInvoiceNumber] = useState();
  const [offerNumber, setOfferNumber] = useState();
  const [paymentNumber, setPaymentNumber] = useState();

  const [updating, setUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {role, ...auth} = useSelector((state) => state.auth);
  const {isAllowed, msg} = checkAccess(auth, 'website configuration');

  const editSettingsHandler = async (e) => {
    e.preventDefault();

    const body = {
      last_invoice_number: invoiceNumber,
      last_proforma_invoice_number: proformaInvoiceNumber,
      last_offer_number: offerNumber,
      last_payment_number: paymentNumber
    };

    try {
      setUpdating(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "setting/edit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies?.access_token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      setReload((prev) => !prev);
    } catch (error) {
      toast.error(error.message);
    }
    finally{
      setUpdating(false);
    }
  };

  const getSettingsHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "setting/get",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setInvoiceNumber(data?.last_invoice_number);
      setproformaInvoiceNumber(data?.last_proforma_invoice_number);
      setOfferNumber(data?.last_offer_number);
      setPaymentNumber(data?.last_payment_number);
    } catch (error) {
      toast.error(error.message);
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(isAllowed){
      getSettingsHandler();
    }
  }, [reload]);

  return (
    <div>
      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
        Finance Settings
      </div>
      <h4 className="text-[#939393] text-sm md:text-base font-semibold items-center gap-y-1">
        Update company finance settings
      </h4>

      {isLoading && <Loading />}
      {!isLoading && <div className="mt-10">
        <form onSubmit={editSettingsHandler}>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Last Invoice Number :</FormLabel>
            <Input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              type="number"
            />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>
              Last Proforma Invoice Number :
            </FormLabel>
            <Input
              value={proformaInvoiceNumber}
              onChange={(e) => setproformaInvoiceNumber(e.target.value)}
              type="number"
            />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Last Offer Number :</FormLabel>
            <Input
              value={offerNumber}
              onChange={(e) => setOfferNumber(e.target.value)}
              type="number"
            />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Last Payment Number :</FormLabel>
            <Input
              value={paymentNumber}
              onChange={(e) => setPaymentNumber(e.target.value)}
              type="number"
            />
          </FormControl>

          <div className="flex justify-end">
            <Button
              isLoading={updating}
              type="submit"
              className="mt-1"
              color="white"
              backgroundColor="#1640d6"
            >
              Add
            </Button>
          </div>
        </form>
      </div>}
    </div>
  );
};

export default FinanceSettings;
