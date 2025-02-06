import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import AddDynamicItemFields from "../../AddDynamicItemFields";

const OffersEditDrawer = ({ closeDrawerHandler, getAllOffers, dataId: id }) => {
  const [cookies] = useCookies();
  const navigate = useNavigate();

  const [allLeads, setAllLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState();
  const [leadOptionsList, setLeadOptionsList] = useState();

  const [year, setYear] = useState();
  const [yearOptionsList, setYearOptionsList] = useState();

  const [remarks, setRemarks] = useState("");

  const statusOptionsList = [
    { value: "Draft", label: "Draft" },
    { value: "Pending", label: "Pending" },
    { value: "Sent", label: "Sent" },
    { value: "Accepted", label: "Accepted" },
    { value: "Declined", label: "Declined" },
  ];
  const [selectedStatus, setSelectedStatus] = useState();

  const [offerId, setOfferId] = useState();
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

  const getAllLeads = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseUrl + "lead/all-leads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setAllLeads((prev) => [...prev, ...data.leads]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getAllIndiamartLeads = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseUrl + "indiamart/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setAllLeads((prev) => [...prev, ...data.leads]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const editOfferHandler = async (e) => {
    e.preventDefault();

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
      taxamount: taxes?.value === 1 ? 0 : subTotal * taxes?.value,
      taxpercentage: taxes?.value,
    };

    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "offer/edit-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          offerId,
          lead: selectedLead?.value,
          startdate: date,
          expiredate: expiryDate,
          status: selectedStatus?.value,
          remarks,
          products,
          subtotal: subTotal,
          total: total,
          tax,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      getAllOffers();
      closeDrawerHandler();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getOfferDetails = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await fetch(baseUrl + "offer/offer-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          offerId: id,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setOfferId(data.offer._id);
      setSelectedLead({
        value: data.offer?.lead?._id || data.offer?.indiamartlead?._id,
        label: data.offer?.lead
          ? data.offer.lead.leadtype === "People"
            ? data.offer.lead.people.firstname +
              " " +
              data.offer.lead.people.lastname
            : data.offer?.lead?.company.companyname
          : data.offer?.indiamartlead?.people
          ? data.offer?.indiamartlead?.people.firstname +
            (data.offer?.indiamartlead?.people.lastname || "")
          : data.offer?.indiamartlead?.company.companyname,
      });
      setSelectedStatus({ value: data.offer.status, label: data.offer.status });
      setDate(new Date(data.offer.startdate).toISOString().substring(0, 10));
      setExpiryDate(
        new Date(data.offer.expiredate).toISOString().substring(0, 10)
      );
      setRemarks(data.offer.remarks);
      setSubTotal(data.offer.subtotal);
      setTotal(data.offer.total);
      setTaxes({
        value: data.offer.tax[0].taxpercentage,
        label: data.offer.tax[0].taxname,
      });

      const products = data.offer.products.map((prod) => {
        return { value: prod.product._id, label: prod.product.name };
      });
      const items = data.offer.products.map((prod) => {
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
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getAllLeads();
    getAllIndiamartLeads();
    getOfferDetails();
  }, []);

  useEffect(() => {
    let options = [{ value: "Add Lead", label: "+ Add Lead" }];
    options = options.concat(
      allLeads?.map((lead) => {
        return {
          value: lead._id,
          label:
            lead.name ||
            (lead?.SENDER_COMPANY && lead?.SENDER_COMPANY !== ""
              ? lead.SENDER_COMPANY
              : lead.SENDER_NAME),
        };
      })
    );
    setLeadOptionsList(options);
  }, [allLeads]);

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
      className="overflow-auto h-[100vh] w-[90vw] md:w-[550px] bg-white right-0 top-0 z-10 py-3"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
      }}
    >
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
        <BiX onClick={closeDrawerHandler} size="26px" />
        Offer
      </h1>

      <div className="mt-8 px-6">
        <h2 className="text-3xl font-bold py-5 text-center mb-6 border-y border-gray-300 bg-blue-200 rounded-md shadow-lg">
          Edit Offer
        </h2>

        <form onSubmit={editOfferHandler} className="space-y-6">
          {/* Lead Dropdown */}
          <div className="mt-2 mb-5">
            <label className="font-semibold text-lg text-gray-700">Lead</label>
            <Select
              isRequired={true}
              className="rounded-lg mt-2 border border-gray-300"
              options={leadOptionsList}
              placeholder="Select lead"
              value={selectedLead}
              onChange={(d) => {
                if (d.value === "Add Lead") {
                  closeDrawerHandler();
                  navigate("/crm/leads");
                }
                setSelectedLead(d);
              }}
              isSearchable={true}
            />
          </div>

          {/* Status Dropdown */}
          <div className="mt-2 mb-5">
            <label className="font-semibold text-lg text-gray-700">
              Status
            </label>
            <Select
              className="rounded-lg mt-2 border border-gray-300"
              options={statusOptionsList}
              placeholder="Select status"
              value={selectedStatus}
              onChange={(d) => {
                setSelectedStatus(d);
              }}
              isSearchable={true}
            />
          </div>

          {/* Date Input */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-lg text-gray-700">
              Date
            </FormLabel>
            <Input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              placeholder="Date"
              min={new Date().toISOString().substring(0, 10)}
              className="rounded-lg border border-gray-300 p-2"
            />
          </FormControl>

          {/* Expiry Date Input */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold" className="text-lg text-gray-700">
              Expiry Date
            </FormLabel>
            <Input
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              type="date"
              placeholder="Expiry date"
              min={date}
              className="rounded-lg border border-gray-300 p-2"
            />
          </FormControl>

          {/* Remarks Input */}
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold" className="text-lg text-gray-700">
              Remarks
            </FormLabel>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              type="text"
              placeholder="Remarks"
              className="rounded-lg border border-gray-300 p-2"
            />
          </FormControl>

          {/* Dynamic Product Fields */}
          <AddDynamicItemFields
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            closeDrawerHandler={closeDrawerHandler}
            inputs={items}
            setInputs={setItems}
          />

          {/* Sub Total */}
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold" className="text-lg text-gray-700">
              Sub Total
            </FormLabel>
            <Input
              value={subTotal}
              isDisabled={true}
              type="number"
              placeholder="Sub total"
              className="rounded-lg border border-gray-300 p-2"
            />
          </FormControl>

          {/* Tax Dropdown */}
          <div className="mt-2 mb-5">
            <label className="font-semibold text-lg text-gray-700">Tax</label>
            <Select
              className="rounded-lg mt-2 border border-gray-300"
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
            <FormLabel fontWeight="bold" className="text-lg text-gray-700">
              Total
            </FormLabel>
            <Input
              value={total}
              isDisabled={true}
              type="number"
              placeholder="Total"
              className="rounded-lg border border-gray-300 p-2"
            />
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="blue"
            className="mt-4 w-full py-3 rounded-lg  transition duration-200"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OffersEditDrawer;
