import { Button, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { closeAddCustomersDrawer } from "../../../../redux/reducers/misc";
import { useState, useEffect } from "react";
import {toast} from 'react-toastify';
import {useCookies} from 'react-cookie';

const CustomersDrawer = ({closeDrawerHandler, fetchAllCustomers}) => {
  const [cookies] = useCookies();
  const [type, setType] = useState('');
  const [people, setPeople] = useState('');
  const [company, setCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [peoples, setPeoples] = useState([]);

  const [showSelectPeoples, setShowSelectPeoples] = useState(true);
  const [showSelectCompanies, setShowSelectCompanies] = useState(true);

  const dispatch = useDispatch();

  const getAllCompanies = async ()=>{
    try{
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL+'company/all-companies', {
        method: "POST",
        headers: {
          "authorization": `Bearer ${cookies?.access_token}`
        }
      })

      const data = await response.json();

      if(!data.success){
        throw new Error(data.message);
      }

      setCompanies(data.companies);
    }
    catch(err){
      toast(err.message);
    }
  }

  const getAllPeoples = async ()=>{
    try{
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL+'people/all-persons', {
        method: "POST",
        headers: {
          "authorization": `Bearer ${cookies?.access_token}`
        }
      })

      const data = await response.json();

      if(!data.success){
        throw new Error(data.message);
      }
      setPeoples(data.people);
    }
    catch(err){
      toast(err.message);
    }
  }

  const addCustomersHandler = async (e)=>{
    e.preventDefault();

    if(type === ''){
      toast.error("Type not selected");
      return;
    }

    try{
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL+'customer/create-customer', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${cookies?.access_token}`
        },
        body: JSON.stringify({
          type, peopleId: people, companyId: company
        })
      })

      const data = await response.json();

      if(!data.success){
        throw new Error(data.message);
      }

      fetchAllCustomers();
      closeDrawerHandler();
      toast.success(data.message);
    }
    catch(err){
      toast.error(err.message);
    }
  }
  
  useEffect(()=>{
    getAllCompanies();
    getAllPeoples();
  }, [])

  useEffect(()=>{
    setShowSelectPeoples(type === 'People' ? true : false);
    setShowSelectCompanies(type === 'Company' ? true : false);
    setPeople('');
    setCompany('');
  }, [type])

  return (
    <div className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3" style={{boxShadow: "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px"}}>
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b"><BiX onClick={closeDrawerHandler} size="26px" />Customer</h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">Add New Customer</h2>

        <form onSubmit={addCustomersHandler}>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Type</FormLabel>
            <Select value={type} onChange={(e)=>setType(e.target.value)} placeholder="Select type">
              <option value="People">People</option>
              <option value="Company">Company</option>
            </Select>
          </FormControl>
          {(showSelectPeoples || type === '') && <FormControl className="mt-2 mb-5">
            <FormLabel fontWeight="bold">People</FormLabel>
            <Select value={people} onChange={(e)=>setPeople(e.target.value)} placeholder="Select person">
              {peoples.map(people => <option key={people._id} value={people._id}>{people.firstname + ' ' + people.lastname}</option>)}
            </Select>
          </FormControl>}
          {(showSelectCompanies || type === '') && <FormControl className="mt-2 mb-5">
            <FormLabel fontWeight="bold">Company</FormLabel>
            <Select value={company} onChange={(e)=>setCompany(e.target.value)} placeholder="Select company">
              {companies.map(company => <option key={company._id} value={company._id}>{company.companyname}</option>)}s
            </Select>
            </FormControl>}
            <Button
              type="submit"
              className="mt-1" 
              color="white"
              backgroundColor="#1640d6"
            >
              Submit
            </Button>
        </form>
      </div>
    </div>
  );
};

export default CustomersDrawer;
