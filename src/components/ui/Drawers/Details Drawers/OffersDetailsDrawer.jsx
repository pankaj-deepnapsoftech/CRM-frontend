import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";
import { Avatar } from "@chakra-ui/react";
import moment from "moment";

const OffersDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState({});

  const fetchOfferDetails = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "offer/offer-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          offerId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setDetails({
        offername: data.offer.offername,
        startdate: moment(data.offer.startdate).format("DD/MM/YYYY"),
        expiredate: moment(data.offer.expiredate).format("DD/MM/YYYY"),
        total: data.offer.total,
        subtotal: data.offer.subtotal,
        status: data.offer.status,
        phone: data.offer?.lead
          ? data.offer?.lead.people
            ? data.offer.lead.people.phone
            : data.offer?.lead.company.phone
          : data.offer?.indiamartlead.people
          ? data.offer.indiamartlead.people.phone
          : data.offer?.indiamartlead.company.phone,
        email: data.offer?.lead
          ? data.offer?.lead.people
            ? data.offer.lead.people.email
            : data.offer?.lead.company.email
          : data.offer?.indiamartlead.people
          ? data.offer.indiamartlead.people.email
          : data.offer?.indiamartlead.company.email,
        offertype: data.offer?.lead
          ? data.offer.lead.leadtype === "People"
            ? "Individual"
            : "Corporate"
          : "Indiamart",
        products: data.offer.products,
        remarks: data.offer.remarks,
        taxamount: data.offer?.tax[0].taxamount,
        taxname: data.offer?.tax[0].taxname,
        taxpercentage: data.offer?.tax[0].taxpercentage,
        createdByName: data.offer?.createdBy.name,
        createdByDesignation: data.offer?.createdBy.designation,
        createdByPhone: data.offer?.createdBy.phone,
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchOfferDetails(id);
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
        Offer
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-3xl font-bold py-5 text-center mb-8 border-y border-gray-200 bg-blue-200 rounded-md shadow-md">
          Offer Details
        </h2>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="bg-gray-50 shadow-lg rounded-lg p-6 space-y-6">
            {/* Offer Type */}
            <div className="font-bold text-lg text-gray-700">
              <p>Offer Type</p>
              <p className="font-normal text-indigo-800">
                {details?.offertype || "Not Available"}
              </p>
            </div>

            {/* Offer Name */}
            <div className="font-bold text-lg text-gray-700">
              <p>Offer Name</p>
              <p className="font-normal text-indigo-800">
                {details?.offername || "Not Available"}
              </p>
            </div>

            {/* Created By (Name) */}
            <div className="font-bold text-lg text-gray-700">
              <p>Created By (Name)</p>
              <p className="font-normal text-indigo-800">
                {details?.createdByName || "Not Available"}
              </p>
            </div>

            {/* Created By (Designation) */}
            <div className="font-bold text-lg text-gray-700">
              <p>Created By (Designation)</p>
              <p className="font-normal text-indigo-800">
                {details?.createdByDesignation || "Not Available"}
              </p>
            </div>

            {/* Created By (Phone) */}
            <div className="font-bold text-lg text-gray-700">
              <p>Created By (Phone)</p>
              <p className="font-normal text-indigo-800">
                {details?.createdByPhone || "Not Available"}
              </p>
            </div>

            {/* Start Date */}
            <div className="font-bold text-lg text-gray-700">
              <p>Start Date</p>
              <p className="font-normal text-indigo-800">
                {details?.startdate || "Not Available"}
              </p>
            </div>

            {/* End Date */}
            <div className="font-bold text-lg text-gray-700">
              <p>End Date</p>
              <p className="font-normal text-indigo-800">
                {details?.expiredate || "Not Available"}
              </p>
            </div>

            {/* Status */}
            <div className="font-bold text-lg text-gray-700">
              <p>Status</p>
              <p className="font-normal text-indigo-800">
                {details?.status || "Not Available"}
              </p>
            </div>

            {/* Sub Total */}
            <div className="font-bold text-lg text-gray-700">
              <p>Sub Total</p>
              <p className="font-normal text-indigo-800">
                &#8377;{details?.subtotal || "Not Available"}
              </p>
            </div>

            {/* Tax */}
            <div className="font-bold text-lg text-gray-700">
              <p>Tax</p>
              <p className="font-normal text-indigo-800">
                {details?.taxname || "Not Available"}
              </p>
            </div>

            {/* Tax Percentage */}
            <div className="font-bold text-lg text-gray-700">
              <p>Tax Percentage</p>
              <p className="font-normal text-indigo-800">
                {details?.taxpercentage === 1
                  ? 0
                  : details?.taxpercentage * 100}
                %
              </p>
            </div>

            {/* Tax Amount */}
            <div className="font-bold text-lg text-gray-700">
              <p>Tax Amount</p>
              <p className="font-normal text-indigo-800">
                &#8377;{details?.taxamount || "Not Available"}
              </p>
            </div>

            {/* Total */}
            <div className="font-bold text-lg text-gray-700">
              <p>Total</p>
              <p className="font-normal text-indigo-800">
                &#8377;{details?.total || "Not Available"}
              </p>
            </div>

            {/* Phone */}
            <div className="font-bold text-lg text-gray-700">
              <p>Phone</p>
              <p className="font-normal text-indigo-800">
                {details?.phone || "Not Available"}
              </p>
            </div>

            {/* Email */}
            <div className="font-bold text-lg text-gray-700">
              <p>Email</p>
              <p className="font-normal text-indigo-800">
                {details?.email || "Not Available"}
              </p>
            </div>

            {/* Products Interested In Table */}
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
                    {details?.products?.map((p, ind) => (
                      <tr
                        className="border-b hover:bg-gray-100 transition-colors duration-200"
                        key={p._id}
                      >
                        <td className="px-3 py-2">{p.product.name}</td>
                        <td className="px-3 py-2">
                          {p.product.category.categoryname}
                        </td>
                        <td className="px-3 py-2">
                          <Avatar size="sm" src={p.product.imageUrl} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Remarks */}
            <div className="font-bold text-lg text-gray-700">
              <p>Remarks</p>
              <p className="font-normal text-indigo-800">
                {details?.remarks || "Not Available"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersDetailsDrawer;
