import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { closeAddExpensesCategoryDrawer } from "../../../../redux/reducers/misc";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../../Loading";

const ExpenseCategoryEditDrawer = ({
  dataId: id,
  closeDrawerHandler,
  fetchAllExpensesCategory,
}) => {
  const [cookies] = useCookies();
  const [colors, setColors] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [color, setColor] = useState("");
  // const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchExpenseCategoryDetails = async () => {
    setIsLoading(true);
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(
        baseURL + "expense-category/category-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${cookies?.access_token}`,
          },
          body: JSON.stringify({
            categoryId: id,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setName(data.category.categoryname);
      // setColor(data.category.color);
      setDescription(data.category.description);
      // setEnabled(data.category.enabled);

      toast.success(data.message);
      setIsLoading(false);
    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  // const getAllColors = async () => {
  //   try {
  //     const baseURL = process.env.REACT_APP_BACKEND_URL;

  //     const response = await fetch(baseURL + "expense-category/all-colors", {
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

  const editExpensesCategoryHandler = async (e) => {
    e.preventDefault();

    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "expense-category/edit-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          categoryId: id,
          name,
          // color,
          // enabled,
          description,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      closeDrawerHandler();
      fetchAllExpensesCategory();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchExpenseCategoryDetails();
    // getAllColors();
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
        Expense Category
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
          Edit Category
        </h2>

        {isLoading && <Loading />}

        {!isLoading && (
          <form onSubmit={editExpensesCategoryHandler} className="space-y-5">
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
            <FormControl className="mt-3 mb-5">
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

            {/* Optional Color Dropdown (Commented out for now) */}
            {/* 
      <FormControl className="mt-2 mb-5">
        <FormLabel fontWeight="bold">Color</FormLabel>
        <Select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Select color"
          className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
        >
          {colors.map((color, ind) => (
            <option key={ind} value={color}>
              {color}
            </option>
          ))}
        </Select>
      </FormControl>
      */}

            {/* Optional Enabled Checkbox (Commented out for now) */}
            {/* 
      <FormControl className="mt-3 mb-5">
        <Checkbox
          value={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          fontWeight="700"
          defaultChecked
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
  );
};

export default ExpenseCategoryEditDrawer;
