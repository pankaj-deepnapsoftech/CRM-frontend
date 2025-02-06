import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";
import { Avatar } from "@chakra-ui/react";
import moment from 'moment';

const IndiamartLeadDetails = ({ dataId: id, closeDrawerHandler }) => {
    const [cookies] = useCookies();
    const [isLoading, setIsLoading] = useState(true);
    const [details, setDetails] = useState({});

    const fetchLeadDetails = async () => {
        try {
            const baseUrl = process.env.REACT_APP_BACKEND_URL;
            const response = await fetch(baseUrl + "indiamart/details", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookies?.access_token}`,
                },
                body: JSON.stringify({
                    _id: id,
                }),
            });
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            setDetails({
                name: data.lead?.SENDER_NAME,
                company: data.lead?.SENDER_COMPANY,
                status: data.lead.status,
                phone: data.lead?.SENDER_MOBILE,
                phoneAlt: data.lead?.SENDER_MOBILE_ALT,
                email: data.lead?.SENDER_EMAIL,
                emailAlt: data.lead?.SENDER_EMAIL_ALT,
                product: data.lead?.QUERY_PRODUCT_NAME,
                message: data.lead?.QUERY_MESSAGE,
                address: data.lead?.SENDER_ADDRESS,
                city: data.lead?.SENDER_CITY,
                state: data.lead?.SENDER_STATE,
                country: data.lead?.SENDER_COUNTRY,
                pincode: data.lead?.SENDER_PINCODE,
                remarks: data.lead?.remarks,
                assignedName: data.lead?.assigned?.name || "N/A",
                assignedPhone: data.lead?.assigned?.phone || "N/A",
                assignedEmail: data.lead?.assigned?.email || "N/A",
                followupDate: data.lead?.followup_date,
                followupReason: data.lead?.followup_reason
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
                <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
                    Lead Details
                </h2>

                {isLoading && <Loading />}
                {!isLoading && (
                    <div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>Name</p>
                            <p className="font-normal">
                                {details?.name || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>Mobile</p>
                            <p className="font-normal">
                                {details?.phone || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>Mobile (Alt)</p>
                            <p className="font-normal">
                                {details?.phoneAlt || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>Email</p>
                            <p className="font-normal">
                                {details?.email || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>Email (Alt)</p>
                            <p className="font-normal">
                                {details?.emailAlt || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>Company</p>
                            <p className="font-normal">
                                {details?.company || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>Address</p>
                            <p className="font-normal">
                                {details?.address || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>Pincode</p>
                            <p className="font-normal">
                                {details?.pincode || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>City</p>
                            <p className="font-normal">
                                {details?.city || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>State</p>
                            <p className="font-normal">
                                {details?.state || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>Country</p>
                            <p className="font-normal">
                                {details?.country || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>Product</p>
                            <p className="font-normal">
                                {details?.product || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>Query</p>
                            <p className="font-normal">
                                {details?.message || "Not Available"}
                            </p>
                        </div>
                        <div className="mt-3 mb-5 font-bold">
                            <p>Status</p>
                            <p className="font-normal">
                                {details?.status ? details.status : "Not Available"}
                            </p>
                        </div>
                        {details?.followupDate && <div className="mt-3 mb-5 font-bold">
                            <p>Follow-up Date</p>
                            <p className="font-normal">
                                {moment(details.followupDate).format('DD-MM-YYYY')}
                            </p>
                        </div>}
                        {details?.followupReason && <div className="mt-3 mb-5 font-bold">
                            <p>Follow-up Reason</p>
                            <p className="font-normal">
                                {details?.followupReason}
                            </p>
                        </div>}
                        <div className="mt-3 mb-5 font-bold">
                            <p>Remarks</p>
                            <p className="font-normal">
                                {details?.remarks || "Not Available"}
                            </p>
                        </div>
                        {details?.assignedName !== "N/A" && <div className="mt-3 mb-5 font-bold">
                            <p>Assigned To (Name)</p>
                            {<p className="font-normal">{details?.assignedName}</p>}
                        </div>}
                        {details?.assignedName !== "N/A" && <div className="mt-3 mb-5 font-bold">
                            <p>Assigned To (Phone)</p>
                            <p className="font-normal">{details?.assignedPhone}</p>
                        </div>}
                        {details?.assignedName !== "N/A" && <div className="mt-3 mb-5 font-bold">
                            <p>Assigned To (Email)</p>
                            <p className="font-normal">{details?.assignedEmail}</p>
                        </div>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default IndiamartLeadDetails
