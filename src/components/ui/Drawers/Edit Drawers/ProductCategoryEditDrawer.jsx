import { toast } from "react-toastify";
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
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Loading from "../../Loading";
import Select from "react-select";

const ProductCategoryEditDrawer = ({
  dataId: id,
  closeDrawerHandler,
  fetchAllProductsCategory,
}) => {
  const [cookies] = useCookies();
  // const [colors, setColors] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState();
  // const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // const colorOptions = [
  //   {value: "default", label: "Default"},
  //   {value: "magenta", label: "Magenta"},
  //   {value: "red", label: "Red"},
  //   {value: "volcano", label: "Volcano"},
  //   {value: "orange", label: "Orange"},
  //   {value: "gold", label: "Gold"},
  //   {value: "lime", label: "Lime"},
  //   {value: "green", label: "Green"}
  // ]

  const fetchProductCategoryDetails = async () => {
    setIsLoading(true);
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "category/category-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          categoryId: id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setName(data.category.categoryname);
      setDescription(data.category.description);
      // setEnabled(data.category.enabled);
      // setColor({value: data.category.color, label: data.category.color.substr(0,1).toUpperCase()+data.category.color.substr(1,)});

      toast.success(data.message);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err.message);
    }
  };

  const editProductsCategoryHandler = async (e) => {
    e.preventDefault();

    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "category/edit-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          categoryId: id,
          categoryname: name,
          color: color?.value,
          // enabled,
          // description,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      closeDrawerHandler();
      fetchAllProductsCategory();
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

  useEffect(() => {
    fetchProductCategoryDetails();
    // getAllColors();
  }, []);

  return (
    <div>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} size="26px" />
          Product Category
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
            Edit Category
          </h2>

          {isLoading && <Loading />}

          {!isLoading && (
            <form onSubmit={editProductsCategoryHandler} className="space-y-5">
              {/* Category Name */}
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold" className="text-[#4B5563]">
                  Name
                </FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Category Name"
                  className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
                />
              </FormControl>

              {/* Category Description */}
              <FormControl className="mt-3 mb-5" isRequired>
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

              {/* Optional Color */}
              {/* 
      <div className="mt-2 mb-5">
        <label className="font-bold text-[#4B5563]">Color</label>
        <Select
          className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
          options={colorOptions}
          placeholder="Select color"
          value={color}
          onChange={(d) => setColor(d)}
          isSearchable={true}
        />
      </div> 
      */}

              {/* Category Enabled Checkbox */}
              {/* 
      <FormControl className="mt-3 mb-5">
        <Checkbox
          value={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          fontWeight="700"
          defaultChecked={enabled}
        >
          Enabled
        </Checkbox>
      </FormControl> 
      */}

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
    </div>
  );
};

export default ProductCategoryEditDrawer;
