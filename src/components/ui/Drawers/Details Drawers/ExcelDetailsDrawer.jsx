import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";

const ExcelDetailsDrawer = ({ dataId, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});

  const fetchPeopleDetails = async () => {
    try {
      if (!dataId) {
        toast.error("Invalid ID provided.");
        return;
      }

      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${baseUrl}renewal/record/${dataId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      console.log("API Response:", data);

      if (!data.success) {
        throw new Error(data.message);
      }

      setDetails(data.data || {}); // Store the whole object in `details`
      setIsLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataId) {
      fetchPeopleDetails();
    }
  }, [dataId]);

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
        Renewal Details
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-3xl font-bold py-5 text-center mb-8 border-y border-gray-200 bg-blue-200 rounded-md shadow-md">
          Individual Details
        </h2>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="bg-gray-50 shadow-lg rounded-lg p-6 space-y-6">
            <DetailItem label="Customer Name" value={details.custumerName} />
            <DetailItem label="Phone Number" value={details.phnNumber} />
            <DetailItem label="Contract Type" value={details.contractType} />
            <DetailItem
              label="Contract Number"
              value={details.contractNumber}
            />
            <DetailItem label="Product Name" value={details.productName} />

            <DetailItem label="Mode" value={details.mode} />
            <DetailItem label="Renewal Date" value={details.renewalDate} />
            <DetailItem
              label="Tenure"
              value={`${details.years || 0} years ${
                details.months || 0
              } months`}
            />

            <DetailItem
              label="Last Renewal Date"
              value={details.lastRenewalDate}
            />
            <DetailItem label="Renewal Times" value={details.renewalTimes} />
            <DetailItem label="Created At" value={details.createdAt} />

            {/* Display Images */}
            {details.doc && (
              <div className="font-bold text-lg text-gray-700">
                <DetailItem label="DOC" value={details.doc} />
              </div>
            )}

            {details.contractAttachment && (
              <div className="font-bold text-lg text-gray-700">
                <p>Contract Attachment</p>
                <a
                  href={details.contractAttachment}
                  download="Contract_Attachment.pdf" // Optional: specify a filename
                  target="_blank"
                  rel="noopener noreferrer" // Recommended for security
                >
                  See Attachment
                </a>
              </div>
            )}
            {details.term && (
              <div className="font-bold text-lg text-gray-700">
                <p>Term Attachment</p>
                <img
                  src={details.term}
                  alt="Contract"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Helper Component to Display Each Detail
const DetailItem = ({ label, value }) => (
  <div className="font-bold text-lg text-gray-700">
    <p>{label}</p>
    <p className="font-normal text-indigo-800">
      {value ? value : "Not Available"}
    </p>
  </div>
);

export default ExcelDetailsDrawer;
