import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";
import { Avatar } from "@chakra-ui/react";
import moment from "moment";

const SupportDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState({});

  const fetchSupportDetails = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "support/get-support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supportId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setDetails({
        name: data?.support?.name,
        remarks: data?.support?.remarks || "No Remarks",
        createdAt: moment(data?.support?.createdAt).format("DD/MM/YYYY"),
        mobile: data?.support?.mobile,
        purpose:
          data?.support?.purpose?.substr(0, 1).toUpperCase() +
          data?.support?.purpose?.substr(1),
        description: data?.support?.description,
        assignedName: data?.support?.assigned
          ? data?.support?.assigned?.name
          : "Not Assigned",
        assignedEmail: data?.support?.assigned
          ? data?.support?.assigned?.email
          : "Not Assigned",
        assignedMobile: data?.support?.assigned
          ? data?.support?.assigned?.phone
          : "Not Assigned",
        status:
          data?.support?.status?.substr(0, 1).toUpperCase() +
          data?.support?.status?.substr(1),
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchSupportDetails(id);
  }, []);

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
        Support
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Support Details
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <div>
            <div className="mt-3 mb-5 font-bold">
              <p>Name</p>
              <p className="font-normal">{details?.name}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Mobile</p>
              <p className="font-normal">{details?.mobile}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Description</p>
              <p className="font-normal">{details?.description}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Purpose</p>
              <p className="font-normal">{details?.purpose}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Status</p>
              <p className="font-normal">{details?.status}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Remarks</p>
              <p className="font-normal">{details?.remarks}</p>
            </div>
            {details?.assignedName !== "Not Assigned" && (
              <>
                <div className="mt-3 mb-5 font-bold">
                  <p>Assigned To (Name)</p>
                  <p className="font-normal">{details?.assignedName}</p>
                </div>
                <div className="mt-3 mb-5 font-bold">
                  <p>Assigned To (Email)</p>
                  <p className="font-normal">{details?.assignedEmail}</p>
                </div>
                <div className="mt-3 mb-5 font-bold">
                  <p>Assigned To (Mobile)</p>
                  <p className="font-normal">{details?.assignedMobile}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportDetailsDrawer;
