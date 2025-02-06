import {useState, useEffect} from "react";
import { Button, FormControl, FormLabel, Textarea } from "@chakra-ui/react";
import { useCookies } from "react-cookie";
import {toast} from 'react-toastify';
import Loading from "../ui/Loading";
import { useSelector } from "react-redux";
import { checkAccess } from "../../utils/checkAccess";

const PDFSetting = () => {
  const [cookies] = useCookies();
  const [reload, setReload] = useState(false);
  const [invoiceFooter, setInvoiceFooter] = useState();
  const [proformaInvoiceFooter, setProformaInvoiceFooter] = useState();
  const [offerFooter, setOfferFooter] = useState();

  const [updating, setUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {role, ...auth} = useSelector((state) => state.auth);
  const {isAllowed, msg} = checkAccess(auth, 'website configuration');

  const editSettingsHandler = async (e) => {
    e.preventDefault();

    const body = {
      invoice_pdf_footer: invoiceFooter,
      proforma_invoice_pdf_footer: proformaInvoiceFooter,
      offer_pdf_footer: offerFooter
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
    } finally{
      setUpdating(false);
    }
  };

  
  const getSettingsHandler = async ()=>{
    try {
      setIsLoading(true);
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'setting/get', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });
      const data = await response.json();
      if(!data.success){
        throw new Error(data.message);
      }
      setInvoiceFooter(data?.invoice_pdf_footer);
      setProformaInvoiceFooter(data?.proforma_invoice_pdf_footer);
      setOfferFooter(data?.offer_pdf_footer);
    } catch (error) {
      toast.error(error.message);
    } finally{
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    if(isAllowed){
      getSettingsHandler();
    }
  }, [reload])

  return (
    <div>
      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
        PDF Settings
      </div>
      <h4 className="text-[#939393] text-sm md:text-base font-semibold items-center gap-y-1">
        Update your PDF settings
      </h4>

      {isLoading && <Loading />}
      {!isLoading && <div className="mt-10">
        <form onSubmit={editSettingsHandler}>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Invoice PDF Footer :</FormLabel>
            <Textarea value={invoiceFooter} onChange={(e)=>setInvoiceFooter(e.target.value)} />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>
              Proforma Invoice PDF Footer :
            </FormLabel>
            <Textarea value={proformaInvoiceFooter} onChange={(e)=>setProformaInvoiceFooter(e.target.value)} />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Offer PDF Footer :</FormLabel>
            <Textarea value={offerFooter} onChange={(e)=>setOfferFooter(e.target.value)} />
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

export default PDFSetting;
