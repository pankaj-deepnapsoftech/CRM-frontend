import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";

const PeoplesDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});

  const fetchPeopleDetails = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "people/person-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          peopleId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setDetails({
        firstname: data.person?.firstname,
        lastname: data.person?.lastname,
        company: data.person?.company,
        phone: data.person?.phone,
        email: data.person?.email,
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchPeopleDetails(id);
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
        Individual
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-3xl font-bold  py-5 text-center mb-8 border-y border-gray-200 bg-blue-200 rounded-md shadow-md">
          Individual Details
        </h2>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="bg-gray-50 shadow-lg rounded-lg p-6 space-y-6">
            <div className="font-bold text-lg text-gray-700">
              <p>First Name</p>
              <p className="font-normal text-indigo-800">
                {details?.firstname ? details.firstname : "Not Available"}
              </p>
            </div>
            <div className="font-bold text-lg text-gray-700">
              <p>Last Name</p>
              <p className="font-normal text-indigo-800">
                {details?.lastname ? details.lastname : "Not Available"}
              </p>
            </div>
            {/* Uncomment this block if you want to add the 'Corporate' field back */}
            {/* <div className="font-bold text-lg text-gray-700">
        <p>Corporate</p>
        <p className="font-normal text-gray-600">{details?.company ? details.company : 'Not Available'}</p>
      </div> */}
            <div className="font-bold text-lg text-gray-700">
              <p>Phone</p>
              <p className="font-normal text-indigo-800">
                {details?.phone ? details.phone : "Not Available"}
              </p>
            </div>
            <div className="font-bold text-lg text-gray-700">
              <p>Email</p>
              <p className="font-normal text-indigo-800">
                {details?.email ? details.email : "Not Available"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeoplesDetailsDrawer;
