import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { closeAddProductsDrawer } from "../../../../redux/reducers/misc";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import FormData from "form-data";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const ProductsDrawer = ({ fetchAllProducts, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState();
  const [categoryOptions, setCategoryOptions] = useState();
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [ref, setRef] = useState("");
  const [stock, setStock] = useState();
  const file = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addProductHandler = async (e) => {
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
    if (file.current.files.length === 0) {
      toast.error("Product image not selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file.current.files[0]);

      const imageUploadResponse = await fetch(process.env.REACT_APP_IMAGE_UPLOAD_URL,
        {
          method: "POST",
          body: formData,
        }
      );
      const imageUrl = await imageUploadResponse.json();

      if (imageUrl?.error) {
        throw new Error(imageUrl?.error);
      }

      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "product/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          name,
          categoryId: category?.value,
          price,
          description,
          ref,
          imageUrl: imageUrl[0],
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
      console.log(err);
      
    }
  };
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
          Add New Product
        </h2>

        <form onSubmit={addProductHandler} className="space-y-5">
          {/* Product Image */}
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Product Image
            </FormLabel>
            <input
              className="py-1 px-3 border rounded-md w-full"
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
              placeholder="Model"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Category Selection */}
          <div className="mt-2 mb-5">
            <label className="font-bold text-[#4B5563]">Category</label>
            <Select
              className="rounded mt-2"
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

          {/* Price */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Price
            </FormLabel>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Price"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Description */}
          <FormControl className="mt-2 mb-5">
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Description
            </FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product Description"
              resize="none"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Stock */}
          <FormControl className="mt-2 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Stock
            </FormLabel>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
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
            className="mt-4 w-full py-3 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
            colorScheme="blue"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProductsDrawer;
