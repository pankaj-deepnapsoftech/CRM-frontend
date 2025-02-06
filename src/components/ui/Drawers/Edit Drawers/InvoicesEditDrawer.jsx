import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import AddDynamicItemFields from "../../AddDynamicItemFields";

const InvoicesEditDrawer = ({
  closeDrawerHandler,
  getAllInvoices,
  dataId: id,
}) => {
  const [cookies] = useCookies();
  const navigate = useNavigate();

  const [allCustomers, setAllCustomers] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [customerOptionsList, setCustomerOptionsList] = useState();

  // const [year, setYear] = useState();
  // const [yearOptionsList, setYearOptionsList] = useState();

  const [remarks, setRemarks] = useState("");

  const statusOptionsList = [
    { value: "Draft", label: "Draft" },
    { value: "Pending", label: "Pending" },
    { value: "Sent", label: "Sent" },
  ];
  const [selectedStatus, setSelectedStatus] = useState();

  const [invoiceId, setProformaInvoiceId] = useState();
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [expiryDate, setExpiryDate] = useState();

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);

  const [items, setItems] = useState([
    { item: "", quantity: 0, price: 0, total: 0 },
  ]);

  const taxOptionsList = [
    { value: 1, label: "No tax 0%" },
    { value: 0.18, label: "GST 18%" },
  ];

  const [taxes, setTaxes] = useState([
    // {value: 1, label: ''}
  ]);

  const getAllCustomers = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "customer/all-customers", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setAllCustomers(data.customers);
    } catch (err) {
      toast(err.message);
    }
  };

  const editInvoiceHandler = async (e) => {
    e.preventDefault();

    // const products = selectedProducts.map((prod) => prod?.value);
    const products = items.map((prod) => {
      return {
        product: prod.item,
        quantity: parseInt(prod.quantity),
        price: parseInt(prod.price),
        total: parseInt(prod.total),
      };
    });

    const tax = {
      taxname: taxes?.label,
      taxamount: taxes?.value === 1 ? 0 : (subTotal * taxes?.value).toFixed(2),
      taxpercentage: taxes?.value,
    };

    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseUrl + "invoice/edit-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          invoiceId: id,
          customer: selectedCustomer?.value,
          startdate: date,
          expiredate: expiryDate,
          status: selectedStatus?.value,
          remarks,
          products,
          subtotal: subTotal.toFixed(2),
          total: total.toFixed(2),
          tax,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      getAllInvoices();
      closeDrawerHandler();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getInvoiceDetails = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    try {
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

      setProformaInvoiceId(data.invoice._id);
      setSelectedCustomer({
        value: data.invoice.customer._id,
        label: data.invoice.customer?.company
          ? data.invoice.customer?.company.companyname
          : data.invoice.customer?.people.firstname +
            " " +
            (data.invoice.customer?.people.lastname || ""),
      });
      setSelectedStatus({
        value: data.invoice.status,
        label: data.invoice.status,
      });
      setDate(new Date(data.invoice.startdate).toISOString().substring(0, 10));
      setExpiryDate(
        new Date(data.invoice.expiredate).toISOString().substring(0, 10)
      );
      setRemarks(data.invoice.remarks);
      setSubTotal(data.invoice.subtotal);
      setTotal(data.invoice.total);
      setTaxes({
        value: data.invoice.tax[0].taxpercentage,
        label: data.invoice.tax[0].taxname,
      });

      const products = data.invoice.products.map((prod) => {
        return { value: prod.product._id, label: prod.product.name };
      });
      const items = data.invoice.products.map((prod) => {
        return {
          item: prod.product._id,
          quantity: prod.quantity,
          price: prod.price,
          total: prod.total,
        };
      });
      setItems(items);
      setSelectedProducts(products);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getAllCustomers();
    getInvoiceDetails();
  }, []);

  useEffect(() => {
    // let options = [{ value: "Add ", label: "+ Add Lead" }];
    let options = allCustomers?.map((customer) => {
      return { value: customer._id, label: customer.name };
    });
    setCustomerOptionsList(options);
  }, [allCustomers]);

  useEffect(() => {
    const subTotalAmt = items.reduce((acc, curr) => acc + curr.total, 0);
    setSubTotal(subTotalAmt);
  }, [items]);

  useEffect(() => {
    if (taxes?.value === 1) {
      setTotal(subTotal);
    } else {
      const total = subTotal * taxes?.value + subTotal;
      setTotal(total);
    }
  }, [taxes, subTotal]);

  return (
    <div
      className="overflow-auto  h-[100vh] w-[90vw] md:w-[550px] bg-white right-0 top-0 z-10 py-3"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
      }}
    >
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
        <BiX onClick={closeDrawerHandler} size="26px" />
        Invoice
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
          Edit Invoice
        </h2>

        <form onSubmit={editInvoiceHandler} className="space-y-5">
          {/* Customer Selection */}
          <div className="mt-2 mb-5">
            <label className="font-bold text-[#4B5563]">Customer</label>
            <Select
              isRequired={true}
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              options={customerOptionsList}
              placeholder="Select customer"
              value={selectedCustomer}
              onChange={(d) => {
                setSelectedCustomer(d);
              }}
              isSearchable={true}
            />
          </div>

          {/* Status Selection */}
          <div className="mt-2 mb-5">
            <label className="font-bold text-[#4B5563]">Status</label>
            <Select
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              options={statusOptionsList}
              placeholder="Select status"
              value={selectedStatus}
              onChange={(d) => {
                setSelectedStatus(d);
              }}
              isSearchable={true}
            />
          </div>

          {/* Date Selection */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Date
            </FormLabel>
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              placeholder="Date"
              min={new Date().toISOString().substring(0, 10)}
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Expiry Date */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Expiry Date
            </FormLabel>
            <Input
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              type="date"
              placeholder="Expiry date"
              min={date}
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Remarks */}
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Remarks
            </FormLabel>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              type="text"
              placeholder="Remarks"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Dynamic Item Fields */}
          <AddDynamicItemFields
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            closeDrawerHandler={closeDrawerHandler}
            inputs={items}
            setInputs={setItems}
          />

          {/* Sub Total */}
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Sub Total
            </FormLabel>
            <Input
              value={subTotal}
              isDisabled={true}
              type="number"
              placeholder="Sub total"
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
            />
          </FormControl>

          {/* Tax Selection */}
          <div className="mt-2 mb-5">
            <label className="font-bold text-[#4B5563]">Tax</label>
            <Select
              className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              options={taxOptionsList}
              placeholder="Select tax"
              value={taxes}
              onChange={(d) => {
                setTaxes(d);
              }}
              isSearchable={true}
            />
          </div>

          {/* Total */}
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold" className="text-[#4B5563]">
              Total
            </FormLabel>
            <Input
              value={total}
              isDisabled={true}
              type="number"
              placeholder="Total"
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
      </div>
    </div>
  );
};

export default InvoicesEditDrawer;
