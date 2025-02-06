import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { IoIosAdd } from "react-icons/io";
import { BiMinus } from "react-icons/bi";

const AddDynamicItemFields = ({
  selectedProducts,
  setSelectedProducts,
  closeDrawerHandler,
  inputs,
  setInputs
}) => {
  const [allProducts, setAllProducts] = useState();
  const [productOptionsList, setProductOptionsList] = useState();
  const [cookies] = useCookies();
  const navigate = useNavigate();

  const addInputHandler = (e) => {
    setInputs((prev) => [...prev, { item: "", quantity: 0, price: 0, total: 0 }]);
  };

  const deleteInputHandler = (ind) => {
    const inputsArr = [...inputs];
    inputsArr.splice(ind, 1);
    setInputs(inputsArr);
  };

  const onChangeHandler = (name, value, ind) => {
    const inputsArr = [...inputs];
    inputsArr[ind][name] = value;
    
    if(name === 'price' || name === 'quantity'){
      inputsArr[ind]['total'] = inputsArr[ind]['price'] * inputsArr[ind]['quantity']
    }
    setInputs(inputsArr);
  };

  const getAllProducts = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "product/all-products", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setAllProducts(data.products);
    } catch (err) {
      toast(err.message);
    }
  };

  useEffect(() => {
    let options = [{ value: "Add Product", label: "+ Add Product" }];
    options = options.concat(
      allProducts?.map((prod) => {
        return { value: prod._id, label: prod.name };
      })
    );
    setProductOptionsList(options);
  }, [allProducts]);

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div>
      {inputs.map((item, ind) => {
        return (
          <div className="flex gap-x-1 my-1">
            <FormControl>
              <FormLabel fontWeight="bold">Item</FormLabel>
              <Select
                isRequired={true}
                className="rounded mt-2"
                options={productOptionsList}
                placeholder="Select"
                value={selectedProducts[ind]}
                name="item"
                onChange={(d) => {
                  if (d.value === "Add Product") {
                    closeDrawerHandler();
                    navigate("/crm/products");
                  }
                  const selectedProds = [...selectedProducts];
                  selectedProds[ind] = {...d};
                  setSelectedProducts(selectedProds);
                  onChangeHandler("item", d.value, ind);
                }}
                isSearchable={true}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Quantity</FormLabel>
              <Input
                onChange={(e) => {
                  onChangeHandler(e.target.name, e.target.value, ind);
                }
                }
                type="number"
                name="quantity"
                value={item?.quantity}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Price</FormLabel>
              <Input
                onChange={(e) => {
                  onChangeHandler(e.target.name, e.target.value, ind);
                }
                }
                type="number"
                name="price"
                value={item?.price}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Total</FormLabel>
              <Input
                type="number"
                name="total"
                value={item?.total}
                isDisabled={true}
              ></Input>
            </FormControl>
          </div>
        );
      })}

      <div className="text-end mt-1">
        {inputs.length > 1 && (
          <Button
            onClick={() => deleteInputHandler(inputs.length - 1)}
            leftIcon={<BiMinus />}
            variant="outline"
            className="mr-1"
          >
            Remove
          </Button>
        )}
        <Button
          onClick={addInputHandler}
          leftIcon={<IoIosAdd />}
          variant="outline"
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default AddDynamicItemFields;
