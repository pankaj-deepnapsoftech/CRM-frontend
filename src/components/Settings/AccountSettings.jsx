import React, { useEffect, useState } from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
import Loading from "../ui/Loading";
import { checkAccess } from "../../utils/checkAccess";

const AccountSettings = () => {
  const [reload, setReload] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [cookies, _, removeCookie] = useCookies();
  const {id} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {role, ...auth} = useSelector((state) => state.auth);
  const {isAllowed, msg} = checkAccess(auth, 'website configuration');

  const logoutHandler = () => {
    if (cookies.access_token !== undefined) {
      removeCookie("access_token");
    }
    dispatch(userNotExists());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const editAccountHandler = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      if(phone && (phone?.trim().length > 10 || phone?.trim().length < 10)){
        toast.error('Phone no. field should be 10 digits long');
        return;
      }

      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'admin/change-details', {
        method: "POST",
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${cookies?.access_token}`
        },
        body: JSON.stringify({
          _id: id,
          name,
          phone,
          email
        })
      });
      const data = await response.json();
      if(!data.success){
        throw new Error(data.message);
      }

      toast.success(data.message);
      setReload(prev => !prev);
      logoutHandler();
    } catch (error) {
      toast.error(error.message);
    }
    finally{
      setUpdating(false);
    }
  };

  const getAccountHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'admin/admin-details', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies?.access_token}`
        },
        body: JSON.stringify({
          adminId: id
        })
      });
      const data = await response.json();
      if(!data.success){
        throw new Error(data.message);
      }
      setName(data?.admin?.name);
      setEmail(data?.admin?.email);
      setPhone(data?.admin?.phone);
    } catch (error) {
      toast.error(error.message);
    }
    finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(isAllowed){
      getAccountHandler();
    }
  }, []);

  return (
    <div>
      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
        Account Settings
      </div>
      <h4 className="text-[#939393] text-sm md:text-base font-semibold items-center gap-y-1">
        Update your account settings
      </h4>

      {isLoading && <Loading />}
      {!isLoading && <div className="mt-10">
        <form onSubmit={editAccountHandler}>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Name :</FormLabel>
            <Input value={name} onChange={(e)=>setName(e.target.value)} type="text" />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Email :</FormLabel>
            <Input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" />
          </FormControl>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Phone no. :</FormLabel>
            <Input value={phone} onChange={(e)=>setPhone(e.target.value)} type="tel" />
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

export default AccountSettings;
