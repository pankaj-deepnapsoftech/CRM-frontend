import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import {useEffect, useState} from "react";
import { toast } from "react-toastify";
import {useCookies} from 'react-cookie';
import Loading from "../ui/Loading";
import { useSelector } from "react-redux";
import { checkAccess } from "../../utils/checkAccess";

const CompanySettings = () => {
  const [cookies] = useCookies();
  const {role, ...auth} = useSelector((state) => state.auth);
  const {isAllowed, msg} = checkAccess(auth, 'website configuration');

  const [reload, setReload] = useState(false);

  const [companyName, setCompanyName] = useState();
  const [companyAddress, setCompanyAddress] = useState();
  const [companyState, setCompanyState] = useState();
  const [companyCountry, setCompanyCountry] = useState();
  const [companyEmail, setCompanyEmail] = useState();
  const [companyPhone, setCompanyPhone] = useState();
  const [companyWebsite, setCompanyWebsite] = useState();
  const [companyGstNumber, setCompanyGstNumber] = useState();

  const [updating, setUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const editSettingsHandler = async (e) => {
    e.preventDefault();

    const body = {
      company_name: companyName,
      company_address: companyAddress,
      company_state: companyState,
      company_country: companyCountry,
      company_email: companyEmail,
      company_phone: companyPhone,
      company_website: companyWebsite,
      company_gst_number: companyGstNumber,
    }

    try {
      setUpdating(true);
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'setting/edit', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies?.access_token}`
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if(!data.success){
        throw new Error(data.message);
      }
      toast.success(data.message);
      setReload(prev => !prev);
    } catch (error) {
      toast.error(error.message);
    }
    finally{
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
      setCompanyName(data?.company_name);
      setCompanyAddress(data?.company_address);
      setCompanyState(data?.company_state);
      setCompanyCountry(data?.company_country);
      setCompanyEmail(data?.company_email);
      setCompanyPhone(data?.company_phone);
      setCompanyWebsite(data?.company_website);
      setCompanyGstNumber(data?.company_gst_number);
    } catch (error) {
      toast.error(error.message);
    }
    finally{
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
        Company Settings
      </div>
      <h4 className="text-[#939393] text-sm md:text-base font-semibold items-center gap-y-1">
        Update your company information
      </h4>

      {isLoading && <Loading />}
      {!isLoading && <div className="mt-10">
        <form onSubmit={editSettingsHandler}>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Company Name :</FormLabel>
            <Input value={companyName} onChange={(e)=>setCompanyName(e.target.value)} type="text" />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Company Address :</FormLabel>
            <Input value={companyAddress} onChange={(e)=>setCompanyAddress(e.target.value)} type="text" />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Company State :</FormLabel>
            <Input value={companyState} onChange={(e)=>setCompanyState(e.target.value)} type="text" />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Company Country :</FormLabel>
            <Input value={companyCountry} onChange={(e)=>setCompanyCountry(e.target.value)} type="text" />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Company Email :</FormLabel>
            <Input value={companyEmail} onChange={(e)=>setCompanyEmail(e.target.value)} type="email" />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Company Phone :</FormLabel>
            <Input value={companyPhone} onChange={(e)=>setCompanyPhone(e.target.value)} type="tel" />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Company Website :</FormLabel>
            <Input value={companyWebsite} onChange={(e)=>setCompanyWebsite(e.target.value)} type="text" />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Company GST Number :</FormLabel>
            <Input value={companyGstNumber} onChange={(e)=>setCompanyGstNumber(e.target.value)} type="text" />
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

export default CompanySettings;
