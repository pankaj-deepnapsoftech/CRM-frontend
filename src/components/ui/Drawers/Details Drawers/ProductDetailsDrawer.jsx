import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import Loading from "../../Loading";

const ProductDetailsDrawer = ({ closeDrawerHandler, dataId: id }) => {
  const [details, setDetails] = useState({});
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(true);

  const fetchProductDetails = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "product/product-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          productId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setDetails({
        name: data.product.name,
        model: data.product.model,
        price: data.product.price,
        category: data.product.category.categoryname,
        imageUrl: data.product?.imageUrl,
        description: data.product?.description,
        stock: data.product?.stock,
      });
      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchProductDetails(id);
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
        Product
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 text-[#333] rounded-lg shadow-md">
          Product Details
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <div className="space-y-5">
            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Product Image</p>
              {details?.imageUrl !== undefined ? (
                <img
                  className="w-full rounded-lg shadow-md"
                  src={details?.imageUrl}
                  alt="Product"
                />
              ) : (
                <p className="font-normal text-indigo-800">Not Available</p>
              )}
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Name</p>
              <p className="font-normal text-indigo-800">
                {details?.name || "Not Available"}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Model</p>
              <p className="font-normal text-indigo-800">
                {details?.model || "Not Available"}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Category</p>
              <p className="font-normal text-indigo-800">
                {details?.category || "Not Available"}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Price</p>
              <p className="font-normal text-indigo-800">
                &#8377;{details?.price || "Not Available"}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Description</p>
              <p className="font-normal text-indigo-800">
                {details?.description || "Not Available"}
              </p>
            </div>

            <div className="mt-3 mb-5 font-bold text-lg">
              <p className="text-[#4B5563]">Stock</p>
              <p className="font-normal text-indigo-800">
                {details?.stock || "Not Available"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsDrawer;
