import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";
import { Avatar } from "@chakra-ui/react";
import moment from "moment";

const ProformaInvoicesDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState({});

  const fetchInvoiceDetails = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "invoice/invoice-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          invoiceId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setDetails({
        invoicename: data.invoice.inovicename,
        startdate: moment(data.invoice?.startdate).format("DD/MM/YYYY"),
        expiredate: moment(data.invoice?.expiredate).format("DD/MM/YYYY"),
        total: data.invoice?.total,
        subtotal: data.invoice?.subtotal,
        status: data.invoice?.status,
        phone: data.invoice?.customer.people
          ? data.invoice?.customer?.people?.phone
          : data.invoice?.customer?.company?.phone,
        email: data.invoice?.customer?.people
          ? data.invoice.customer?.people?.email
          : data.invoice?.customer?.company?.email,
        customertype: data.invoice?.customer?.people
          ? "Individual"
          : "Corporate",
        customer: data.invoice.customer?.people
          ? data.invoice.customer?.people?.firstname +
            " " +
            data.invoice.customer?.people?.lastname
          : data.invoice.customer?.company?.companyname,
        products: data.invoice?.products,
        remarks: data.invoice?.remarks,
        taxamount: data.invoice?.tax[0]?.taxamount,
        taxname: data.invoice?.tax[0]?.taxname,
        taxpercentage: data.invoice?.tax[0]?.taxpercentage,
        createdByName: data.invoice?.createdBy?.name,
        createdByDesignation: data.invoice?.createdBy?.designation,
        createdByPhone: data.invoice?.createdBy?.phone,
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchInvoiceDetails(id);
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
        Invoice
      </h1>

      <div className="mt-8 px-6">
        <h2 className="text-3xl font-bold py-5 text-center mb-6 border-y border-gray-300 bg-blue-200 rounded-md shadow-lg">
          Invoice Details
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <div>
            {/* Customer Type */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Customer Type</p>
              <p className="font-normal text-indigo-800">
                {details?.customertype}
              </p>
            </div>

            {/* Created By Details */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Created By (Name)</p>
              <p className="font-normal text-indigo-800">
                {details?.createdByName}
              </p>
            </div>
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Created By (Designation)</p>
              <p className="font-normal text-indigo-800">
                {details?.createdByDesignation}
              </p>
            </div>
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Created By (Phone)</p>
              <p className="font-normal text-indigo-800">
                {details?.createdByPhone}
              </p>
            </div>

            {/* Customer */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Customer</p>
              <p className="font-normal text-indigo-800">{details?.customer}</p>
            </div>

            {/* Dates */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Start Date</p>
              <p className="font-normal text-indigo-800">{details?.startdate}</p>
            </div>
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>End Date</p>
              <p className="font-normal text-indigo-800">{details?.expiredate}</p>
            </div>

            {/* Status */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Status</p>
              <p className="font-normal text-indigo-800">{details?.status}</p>
            </div>

            {/* Sub Total */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Sub Total</p>
              <p className="font-normal text-indigo-800">
                &#8377;{details?.subtotal}
              </p>
            </div>

            {/* Tax */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Tax</p>
              <p className="font-normal text-indigo-800">{details?.taxname}</p>
            </div>

            {/* Tax Percentage */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Tax Percentage</p>
              <p className="font-normal text-indigo-800">
                {details?.taxpercentage === 1
                  ? 0
                  : details?.taxpercentage * 100}
                %
              </p>
            </div>

            {/* Tax Amount */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Tax Amount</p>
              <p className="font-normal text-indigo-800">
                &#8377;{details?.taxamount}
              </p>
            </div>

            {/* Total */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Total</p>
              <p className="font-normal text-indigo-800">
                &#8377;{details?.total}
              </p>
            </div>

            {/* Phone */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Phone</p>
              <p className="font-normal text-indigo-800">
                {details?.phone ? details.phone : "Not Available"}
              </p>
            </div>

            {/* Email */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Email</p>
              <p className="font-normal text-indigo-800">
                {details?.email ? details.email : "Not Available"}
              </p>
            </div>

            {/* Products Interested In */}
            <div className="mt-3 mb-5 cursor-pointer">
              <p className="font-semibold text-lg text-gray-800 mb-2">
                Products Interested In
              </p>
              <div className="overflow-x-auto">
                <table className="border-collapse w-full text-left bg-white shadow-md rounded-lg">
                  <thead className="bg-gray-100">
                    <tr className="border-b">
                      <th className="px-4 py-2 font-semibold text-gray-700">
                        Product
                      </th>
                      <th className="px-4 py-2 font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="px-4 py-2 font-semibold text-gray-700">
                        Image
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {details?.products?.map((p) => (
                      <tr
                        className="border-b hover:bg-gray-50 transition duration-200"
                        key={p._id}
                      >
                        <td className="px-4 py-2 text-indigo-800">
                          {p.product.name}
                        </td>
                        <td className="px-4 py-2 text-indigo-800">
                          {p.product.category.categoryname}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <Avatar size="sm" src={p.product.imageUrl} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Remarks */}
            <div className="mt-3 mb-5 font-semibold text-lg text-gray-800">
              <p>Remarks</p>
              <p className="font-normal text-indigo-800">
                {details?.remarks ? details.remarks : "Not Available"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProformaInvoicesDetailsDrawer;
