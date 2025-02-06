import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";
import { Avatar, Badge } from "@chakra-ui/react";

const CustomersDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});

  const fetchCustomerDetails = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "customer/customer-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          customerId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setDetails({
        name: data.customer?.name,
        email: data.customer?.email,
        phone: data.customer?.phone,
        type: data.customer?.customertype,
        status: data.customer?.status,
        products: data.customer?.products,
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
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
        Customer
      </h1>

      <div className="mt-8 px-5">
  <h2 className="text-3xl font-bold py-5 text-center mb-8 border-y border-gray-200 bg-blue-200 rounded-md shadow-md">
    Customer Details
  </h2>

  {isLoading ? (
    <Loading />
  ) : (
    <div className="bg-gray-50 shadow-lg rounded-lg p-6 space-y-6">
      {/* Customer Type */}
      <div className="font-bold text-lg text-gray-700">
        <p>Type</p>
        <p className="font-normal text-indigo-800">
          {details?.type
            ? details.type === "People"
              ? "Individual"
              : "Corporate"
            : "Not Available"}
        </p>
      </div>

      {/* Name Field */}
      <div className="font-bold text-lg text-gray-700">
        <p>Name</p>
        <p className="font-normal text-indigo-800">{details?.name || "Not Available"}</p>
      </div>

      {/* Email Field */}
      <div className="font-bold text-lg text-gray-700">
        <p>Email</p>
        <p className="font-normal text-indigo-800">{details?.email || "Not Available"}</p>
      </div>

      {/* Phone Field */}
      <div className="font-bold text-lg text-gray-700">
        <p>Phone</p>
        <p className="font-normal text-indigo-800">{details?.phone || "Not Available"}</p>
      </div>

      {/* Status Field */}
      <div className="font-bold text-lg text-gray-700">
        <p>Status</p>
        <Badge colorScheme={details?.status === "Deal Done" ? 'green' : 'orange'}>
        {details?.status || "Not Available"}
        </Badge>      
      </div>

      {/* Products Interested Table */}
      <div className="cursor-pointer">
        <p className="font-bold mb-1 text-gray-700">Products Interested In</p>
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
                <tr className="border-b hover:bg-gray-100 transition-colors duration-200" key={p._id}>
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
    </div>
  )}
</div>

    </div>
  );
};

export default CustomersDetailsDrawer;
