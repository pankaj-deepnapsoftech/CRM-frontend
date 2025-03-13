import { Button, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";

const SMSDrawer = ({ fetchAllLeads, closeDrawerHandler, mobiles, names }) => {
   
    const [templateId, setTemplateId] = useState();
    const [message, setMessage] = useState();
    const [cookies] = useCookies();

    const sendBulkSMSHandler = async (e)=>{
        e.preventDefault();

        if(mobiles.length === 0){
          toast.error('No lead selected');
          closeDrawerHandler();
          return;
        }
        
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL+'sms/send-bulk-sms', {
                method: "POST",
                headers: {
                    'Content-Type': "Application/json",
                    "Authorization": `Bearer ${cookies?.access_token}`
                },
                body: JSON.stringify({
                    mobiles,
                    templateId,
                    message,
                    name: names,
                })
            });
            const data = await response.json();
            if(!data?.success){
                throw new Error(data.message);
            }
            toast.success(data.message);
            fetchAllLeads();
            closeDrawerHandler();
        } catch (error) {
            toast.error(error?.message);
        }
    }

  return (
    <div
      className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
      }}
    >
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
        <BiX onClick={closeDrawerHandler} size="26px" />
        SMS
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Send Bulk SMS
        </h2>

        <form onSubmit={sendBulkSMSHandler}>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Template ID</FormLabel>
            <Input
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              type="text"
              placeholder="Name"
            />
          </FormControl>
          <FormControl className="mt-3 mb-5" >
            <FormLabel fontWeight="bold">Message</FormLabel>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
        </form>
      </div>
    </div>
  );
};

export default SMSDrawer;
