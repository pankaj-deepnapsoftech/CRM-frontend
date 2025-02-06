import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { closeAddExpensesDrawer } from "../../../../redux/reducers/misc";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const ExpensesDrawer = ({ fetchAllExpenses, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState();
  const [categoryOptions, setCategoryOptions] = useState();
  const [total, setTotal] = useState("");
  const [description, setDescription] = useState("");
  const [ref, setRef] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getAllCategories = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(
        baseURL + "expense-category/all-categories",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setCategories(data.categories);
    } catch (err) {
      toast(err.message);
    }
  };

  const addExpenseHandler = async (e) => {
    e.preventDefault();

    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "expense/create-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          name,
          categoryId: category?.value,
          description,
          ref,
          price: total,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      closeDrawerHandler();
      fetchAllExpenses();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getAllCategories();
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
        Expense
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200  rounded-lg shadow-md">
          Add New Expense
        </h2>

        <form onSubmit={addExpenseHandler} className="space-y-5">
          {/* Expense Name */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Name
            </FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Expense Name"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Expense Category */}
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
                  navigate("/crm/expenses-category");
                }
                setCategory(d);
              }}
              isSearchable={true}
            />
          </div>

          {/* Total */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Total
            </FormLabel>
            <Input
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              type="number"
              placeholder="Total Amount"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Description */}
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Description
            </FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expense Description"
              resize="none"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Reference */}
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Ref
            </FormLabel>
            <Input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              type="text"
              placeholder="Reference ID"
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

export default ExpensesDrawer;
