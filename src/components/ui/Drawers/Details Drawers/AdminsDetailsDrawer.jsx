import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";

const AdminDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});

  const fetchAdminDetails = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "admin/admin-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          adminId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setDetails({
        name: data.admin?.name,
        allowedroutes: data.admin?.allowedroutes,
        phone: data.admin?.phone,
        email: data.admin?.email,
        verified: data.admin?.verified,
        designation: data.admin?.designation,
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
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
        Employee
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-3xl bg-blue-200 font-bold py-5 text-center mb-8 border-y border-gray-200  rounded-md shadow-md">
          Employee Details
        </h2>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="bg-gray-50 shadow-lg rounded-lg p-6 space-y-6">
            <div className="font-bold text-lg text-gray-700">
              <p>Name</p>
              <p className="font-normal text-indigo-800">{details?.name}</p>
            </div>
            <div className="font-bold text-lg text-gray-700">
              <p>IsVerified</p>
              <p className={`font-normal ${details?.verified ? "text-green-600" : "text-red-500"}`}>
                {details?.verified ? "Verified" : "Not Verified"}
              </p>
            </div>
            <div className="font-bold text-lg text-gray-700">
              <p>Designation</p>
              <p className="font-normal text-indigo-800">
                {details?.designation}
              </p>
            </div>
            <div className="font-bold text-lg text-gray-700">
              <p>Phone</p>
              <p className="font-normal text-indigo-800">{details?.phone}</p>
            </div>
            <div className="font-bold text-lg text-gray-700">
              <p>Email</p>
              <p className="font-normal text-indigo-800">{details?.email}</p>
            </div>
            <div>
              <p className="font-bold text-lg text-gray-700">Permissions</p>
              {details.allowedroutes.length === 0 ? (
                <span className="text-gray-500">No permissions granted.</span>
              ) : (
                <ul className="list-disc pl-5 space-y-2">
                  {details.allowedroutes.map((r, index) => (
                    <li key={index} className="text-indigo-800">
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDetailsDrawer;
