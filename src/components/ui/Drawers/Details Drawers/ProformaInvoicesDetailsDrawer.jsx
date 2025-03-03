import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";
import { Avatar, Badge } from "@chakra-ui/react";
import moment from "moment";

const ProformaInvoicesDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState({});

  const fetchProformaInvoiceDetails = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(
        baseUrl + "proforma-invoice/proforma-invoice-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies?.access_token}`,
          },
          body: JSON.stringify({
            proformaInvoiceId: id,
          }),
        }
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setDetails({
        proformainvoicename: data.proformaInvoice.offername,
        startdate: moment(data.proformaInvoice.startdate).format("DD/MM/YYYY"),
        // expiredate: moment(data.proformaInvoice.expiredate).format("DD/MM/YYYY"),
        total: data.proformaInvoice?.total,
        subtotal: data.proformaInvoice?.subtotal,
        status: data.proformaInvoice?.status,
        phone: data.proformaInvoice?.people
          ? data.proformaInvoice?.people?.phone
          : data.proformaInvoice?.company?.phone,
        email: data.proformaInvoice?.people
          ? data.proformaInvoice?.people?.email
          : data.proformaInvoice?.company?.email,
        customertype: data.proformaInvoice?.people ? "Individual" : "Corporate",
        customer: data.proformaInvoice?.people
          ? data.proformaInvoice?.people?.firstname +
            " " +
            data.proformaInvoice?.people?.lastname
          : data.proformaInvoice?.company?.companyname,
        products: data.proformaInvoice?.products,
        remarks: data.proformaInvoice?.remarks,
        taxamount: data.proformaInvoice?.tax[0]?.taxamount,
        taxname: data.proformaInvoice?.tax[0]?.taxname,
        taxpercentage: data.proformaInvoice?.tax[0]?.taxpercentage,
        createdByName: data.proformaInvoice?.createdBy?.name,
        createdByDesignation: data.proformaInvoice?.createdBy?.designation,
        createdByPhone: data.proformaInvoice?.createdBy?.phone,
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchProformaInvoiceDetails(id);
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
        Proforma Invoice
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 text-[#333] rounded-lg shadow-md">
          Proforma Invoice Details
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <div>
            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Customer Type</p>
              <p className="font-normal text-indigo-800">
                {details?.customertype}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Created By (Name)</p>
              <p className="font-normal text-indigo-800">
                {details?.createdByName}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Created By (Designation)</p>
              <p className="font-normal text-indigo-800">
                {details?.createdByDesignation}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Created By (Phone)</p>
              <p className="font-normal text-indigo-800">
                {details?.createdByPhone}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Customer</p>
              <p className="font-normal text-indigo-800">{details?.customer}</p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Start Date</p>
              <p className="font-normal text-indigo-800">{details?.startdate}</p>
            </div>

            {/* <div className="mt-3 mb-5 font-bold text-lg">
        <p className="text-[#4B5563]">End Date</p>
        <p className="font-normal text-indigo-800">{details?.expiredate}</p>
      </div> */}

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Status</p>
              <Badge colorScheme="orange">
              {details?.status}
              </Badge>
            
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Sub Total</p>
              <p className="font-normal text-indigo-800">
                &#8377;{details?.subtotal}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Tax</p>
              <p className="font-normal text-indigo-800">{details?.taxname}</p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Tax Percentage</p>
              <p className="font-normal text-indigo-800">
                {details?.taxpercentage === 1
                  ? 0
                  : details?.taxpercentage * 100}
                %
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Tax Amount</p>
              <p className="font-normal text-indigo-800">
                &#8377;{details?.taxamount}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Total</p>
              <p className="font-normal text-indigo-800">
                &#8377;{details?.total}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Phone</p>
              <p className="font-normal text-indigo-800">
                {details?.phone ? details.phone : "Not Available"}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Email</p>
              <p className="font-normal text-indigo-800">
                {details?.email ? details.email : "Not Available"}
              </p>
            </div>

            <div className="mt-3 mb-5 cursor-pointer">
              <p className="font-bold text-lg text-[#4B5563] mb-1">
                Products Interested In
              </p>
              <div className="overflow-x-auto shadow-lg rounded-lg bg-white p-3">
                <table className="w-full table-auto text-left border-collapse border border-gray-300 rounded-lg">
                  <thead className="bg-[#E5E7EB] text-indigo-800">
                    <tr>
                      <th className="px-4 py-2 border-b">Product</th>
                      <th className="px-4 py-2 border-b">Category</th>
                      <th className="px-4 py-2 border-b">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details?.products?.map((p, ind) => (
                      <tr key={p._id} className="hover:bg-[#F3F4F6]">
                        <td className="px-4 py-2 border-b">{p.product.name}</td>
                        <td className="px-4 py-2 border-b">
                          {p.product.category.categoryname}
                        </td>
                        <td className="px-4 py-2 border-b">
                          <Avatar size="sm" src={p.product.imageUrl} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Remarks</p>
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
