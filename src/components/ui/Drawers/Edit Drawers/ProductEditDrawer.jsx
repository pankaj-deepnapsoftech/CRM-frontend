import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { closeAddProductsCategoryDrawer } from "../../../../redux/reducers/misc";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import Loading from "../../Loading";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const ProductsEditDrawer = ({
  dataId: id,
  closeDrawerHandler,
  fetchAllProducts,
}) => {
  const [cookies] = useCookies();
  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState();
  // const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState();
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [ref, setRef] = useState("");
  const [stock, setStock] = useState();
  const file = useRef();

  const navigate = useNavigate();

  const editProductHandler = async (e) => {
    e.preventDefault();

    if (name === "") {
      toast.error("Name should not be empty");
      return;
    }
    if (!category?.value) {
      toast.error("Category not selected");
      return;
    }
    if (price === "") {
      toast.error("Price should not be empty");
      return;
    }

    try {
      let imageUrl = [];
      if (file.current.files.length !== 0) {
        const formData = new FormData();
        formData.append("file", file.current.files[0]);

        const imageUploadResponse = await fetch(
          process.env.REACT_APP_IMAGE_UPLOAD_URL,
          {
            method: "POST",
            body: formData,
          }
        );
        imageUrl = await imageUploadResponse.json();

        if (imageUrl?.error) {
          throw new Error(imageUrl?.error);
        }
      }
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "product/edit-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          productId: id,
          name,
          categoryId: category?.value,
          price,
          description,
          ref,
          imageUrl: imageUrl.length === 0 ? undefined : imageUrl[0],
          model,
          stock,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      closeDrawerHandler();
      fetchAllProducts();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

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

      setName(data.product?.name);
      setModel(data.product?.model);
      setPrice(data.product?.price);
      setStock(data.product?.stock);
      setDescription(data.product?.description);
      setCategory({
        value: data.product?.category._id,
        label: data.product?.category.categoryname,
      });
      setRef(data.product?.ref);

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // const getAllColors = async (req, res) => {
  //   try {
  //     const baseURL = process.env.REACT_APP_BACKEND_URL;

  //     const response = await fetch(baseURL + "category/all-colors", {
  //       headers: {
  //         authorization: `Bearer ${cookies?.access_token}`,
  //       },
  //     });

  //     const data = await response.json();

  //     if (!data.success) {
  //       throw new Error(data.message);
  //     }
  //     setColors(data.colors);
  //   } catch (err) {
  //     toast.error(err.message);
  //   }
  // };

  const getAllProductCategories = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "category/all-categories", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setCategories(data.categories);
    } catch (err) {
      toast(err.message);
    }
  };

  useEffect(() => {
    // getAllColors();
    fetchProductDetails(id);
    getAllProductCategories();
  }, []);

  useEffect(() => {
    let options = [{ value: "Add Category", label: "+ Add Category" }];
    options = options.concat(
      categories.map((data) => {
        return { value: data._id, label: data.categoryname };
      })
    );
    setCategoryOptions(options);
  }, [categories]);

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
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
          Edit Product
        </h2>

        {isLoading && <Loading />}

        {!isLoading && (
          <form onSubmit={editProductHandler} className="space-y-5">
            {/* Product Image */}
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Product Image
              </FormLabel>
              <input
                className="py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                ref={file}
              />
            </FormControl>

            {/* Product Name */}
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Name
              </FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Product Name"
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            {/* Product Model */}
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Model
              </FormLabel>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                type="text"
                placeholder="Product Model"
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            {/* Product Category */}
            <div className="mt-2 mb-5">
              <label className="font-bold text-[#4B5563]">Category</label>
              <Select
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
                options={categoryOptions}
                placeholder="Select category"
                value={category}
                onChange={(d) => {
                  if (d.value === "Add Category") {
                    closeDrawerHandler();
                    navigate("/crm/products-category");
                  }
                  setCategory(d);
                }}
                isSearchable={true}
              />
            </div>

            {/* Product Price */}
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Price
              </FormLabel>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="Product Price"
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            {/* Product Description */}
            <FormControl className="mt-2 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Description
              </FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                resize="none"
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            {/* Product Stock */}
            <FormControl className="mt-2 mb-5" isRequired>
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Stock
              </FormLabel>
              <Input
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                type="number"
                placeholder="Product Stock"
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            {/* Product Reference */}
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Ref
              </FormLabel>
              <Input
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                type="text"
                placeholder="Product Reference"
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            {/* Submit Button */}
            <Button
              type="submit"
              className="mt-1 w-full py-3 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
              colorScheme="blue"
            >
              Submit
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductsEditDrawer;
