import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";
import { Avatar, Badge } from "@chakra-ui/react";
import moment from "moment";

const LeadsDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});

  const fetchLeadDetails = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "lead/lead-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          leadId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setDetails({
        name: data.lead.name,
        type: data.lead.leadtype,
        company: data.lead?.company ? data.lead?.company?.companyname : "",
        people: data.lead?.people
          ? data.lead?.people?.firstname +
            " " +
            (data.lead?.people?.lastname || "")
          : "",
        status: data.lead.status,
        source: data.lead.source,
        phone: data.lead?.company
          ? data.lead.company.phone
          : data.lead.people.phone,
        email: data.lead?.company
          ? data.lead.company.email
          : data.lead.people.email,
        notes: data.lead?.notes ? data.lead.notes : "",
        products: data.lead?.products,
        assignedName: data.lead?.assigned?.name || "N/A",
        assignedPhone: data.lead?.assigned?.phone || "N/A",
        assignedEmail: data.lead?.assigned?.email || "N/A",
        followupDate: data.lead?.followup_date,
        followupReason: data.lead?.followup_reason,
        prcQt: data.lead?.prc_qt || "N/A",
        location: data.lead?.location || "N/A",
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchLeadDetails(id);
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
        Lead
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-3xl font-bold py-5 text-center mb-8 border-y border-gray-200 bg-blue-200 rounded-md shadow-md">
          Lead Details
        </h2>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
            {/* Lead Type */}
            <div className="font-bold text-lg text-gray-700">
              <p>Type</p>
              <p className="font-normal text-indigo-800">
                {details?.type || "Not Available"}
              </p>
            </div>

            {/* Corporate Field */}
            {details.company && (
              <div className="font-bold text-lg text-gray-700">
                <p>Corporate</p>
                <p className="font-normal text-indigo-800">{details?.company}</p>
              </div>
            )}

            {/* Individual Field */}
            {details.people && (
              <div className="font-bold text-lg text-gray-700">
                <p>Individual</p>
                <p className="font-normal text-indigo-800">{details?.people}</p>
              </div>
            )}

            {/* Status Field */}
            <div className="font-bold text-lg text-gray-700">
              <p>Status</p>
              <Badge colorScheme="orange">
              {details?.status || "Not Available"}
              </Badge>
             
            </div>

            {/* Source Field */}
            <div className="font-bold text-lg text-gray-700">
              <p>Source</p>
              <p className="font-normal text-indigo-800">
                {details?.source || "Not Available"}
              </p>
            </div>

            {/* Contact Fields */}
            <div className="font-bold text-lg text-gray-700">
              <p>Phone</p>
              <p className="font-normal text-indigo-800">
                {details?.phone || "Not Available"}
              </p>
            </div>
            <div className="font-bold text-lg text-gray-700">
              <p>Email</p>
              <p className="font-normal text-indigo-800">
                {details?.email || "Not Available"}
              </p>
            </div>

            {/* Products Table */}
            <div className="cursor-pointer">
              <p className="font-bold mb-1 text-gray-700">
                Products Interested In
              </p>
              <div>
                <table className="border w-full table-auto text-left shadow-md rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-3 py-2">Product</th>
                      <th className="border px-3 py-2">Category</th>
                      <th className="border px-3 py-2">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details?.products.map((p, ind) => (
                      <tr
                        className="border-b hover:bg-gray-100 transition-colors duration-200"
                        key={p._id}
                      >
                        <td className="px-3 py-2">{p.name}</td>
                        <td className="px-3 py-2">{p.category.categoryname}</td>
                        <td className="px-3 py-2">
                          <Avatar size="sm" src={p.imageUrl} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Follow-up Date & Reason */}
            {details?.followupDate && (
              <div className="font-bold text-lg text-gray-700">
                <p>Follow-up Date</p>
                <p className="font-normal text-indigo-800">
                  {moment(details.followupDate).format("DD-MM-YYYY")}
                </p>
              </div>
            )}
            {details?.followupReason && (
              <div className="font-bold text-lg text-gray-700">
                <p>Follow-up Reason</p>
                <p className="font-normal text-indigo-800">
                  {details?.followupReason}
                </p>
              </div>
            )}

            {/* Remarks */}
            <div className="font-bold text-lg text-gray-700">
              <p>Remarks</p>
              <p className="font-normal text-indigo-800">
                {details?.notes || "Not Available"}
              </p>
            </div>

            {/* Assigned To Fields */}
            {details?.assignedName !== "N/A" && (
              <>
                <div className="font-bold text-lg text-gray-700">
                  <p>Assigned To (Name)</p>
                  <p className="font-normal text-indigo-800">
                    {details?.assignedName}
                  </p>
                </div>
                <div className="font-bold text-lg text-gray-700">
                  <p>Assigned To (Phone)</p>
                  <p className="font-normal text-indigo-800">
                    {details?.assignedPhone}
                  </p>
                </div>
                <div className="font-bold text-lg text-gray-700">
                  <p>Assigned To (Email)</p>
                  <p className="font-normal text-indigo-800">
                    {details?.assignedEmail}
                  </p>
                </div>
              </>
            )}

            {/* PRC QT Field */}
            {details?.prcQt !== "N/A" && (
              <div className="font-bold text-lg text-gray-700">
                <p>PRC QT</p>
                <p className="font-normal text-indigo-800">{details?.prcQt}</p>
              </div>
            )}

            {/* Location Field */}
            {details?.location !== "N/A" && (
              <div className="font-bold text-lg text-gray-700">
                <p>Location</p>
                <p className="font-normal text-indigo-800">{details?.location}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsDetailsDrawer;
