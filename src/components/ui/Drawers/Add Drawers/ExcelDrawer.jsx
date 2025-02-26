import {
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  NumberInput,
  NumberInputField,
  Box,
  Text,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import { useCookies } from "react-cookie";
import Select from "react-select";

const contractOptions = [
  { value: "LIFE INSURANCE", label: "LIFE INSURANCE" },
  { value: "HEALTH INSURANCE", label: "HEALTH INSURANCE" },
  { value: "PERSONAL LOAN", label: "PERSONAL LOAN" },
  { value: "BUSINESS LOAN", label: "BUSINESS LOAN" },
  { value: "CC LIMIT", label: "CC LIMIT" },
  { value: "other", label: "Other" },
];

const modeOptions = [
  { value: "YLY", label: "YLY" },
  { value: "HLY", label: "HLY" },
  { value: "QLY", label: "QLY" },
  { value: "MLY", label: "MLY" },
];

const ExcelDrawer = ({ closeDrawerHandler, fetchAllPeople }) => {
  const [cookies] = useCookies();
  const [custumerName, setCustumerName] = useState("");
  const [phnNumber, setPhnNumber] = useState("");
  const [contractType, setContractType] = useState("");
  const [otherContractType, setOtherContractType] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [doc, setDoc] = useState(null);
  const [term, setTerm] = useState(null);
  const [mode, setMode] = useState("");
  const [otherMode, setOtherMode] = useState("");
  const [contractAttachment, setContractAttachment] = useState(null);
  const [renewalDate, setRenewalDate] = useState("");
  const [lastRenewalDate, setLastRenewalDate] = useState("");
  const [renewalTimes, setRenewalTimes] = useState("");
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);

  const addPeopleHandler = async (e) => {
    e.preventDefault();
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;
      const formData = new FormData();
      formData.append("custumerName", custumerName);
      formData.append("phnNumber", phnNumber);
      formData.append(
        "contractType",
        contractType === "other" ? otherContractType : contractType
      );
      formData.append("contractNumber", contractNumber);
      formData.append("productName", productName);
      formData.append("doc", doc);
      // formData.append("term", term);
      formData.append("mode", mode === "other" ? otherMode : mode);
      formData.append("contractAttachment", contractAttachment);
      formData.append("renewalDate", renewalDate);
      formData.append("lastRenewalDate", lastRenewalDate);
      formData.append("renewalTimes", renewalTimes);
      formData.append("years", years);
      formData.append("months", months);


      const response = await fetch(baseURL + "renewal/create-record", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      toast.success(data.message);
      fetchAllPeople();
      closeDrawerHandler();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3">
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
        <BiX onClick={closeDrawerHandler} size="26px" /> Renewals
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
          Add Renewals
        </h2>

        <form onSubmit={addPeopleHandler} className="space-y-5">
          <FormControl isRequired>
            <FormLabel>Customer Name</FormLabel>
            <Input
              value={custumerName}
              onChange={(e) => setCustumerName(e.target.value)}
              type="text"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input
              value={phnNumber}
              onChange={(e) => setPhnNumber(e.target.value)}
              type="number"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Contract Type</FormLabel>
            <Select
              options={contractOptions}
              onChange={(selected) => setContractType(selected.value)}
            />
            {contractType === "other" && (
              <Input
                placeholder="Enter other type"
                onChange={(e) => setOtherContractType(e.target.value)}
              />
            )}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Contract Number</FormLabel>
            <Input
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              type="text"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Product Name</FormLabel>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              type="text"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>DOC</FormLabel>
            <Input
              type="date"
              value={doc}
              onChange={(e) => setDoc(e.target.value)}
            />
          </FormControl>
          <Box>
            <FormControl isRequired>
              <FormLabel>Tenure</FormLabel>
              <Box display="flex" gap={2}>
                <Input
                  type="number"
                  placeholder="Years"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Months"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                />
              </Box>
            </FormControl>

            <Text mt={2} fontSize="lg" fontWeight="bold">
              {years || "0"} years {months || "0"} months
            </Text>
          </Box>

          <FormControl isRequired>
            <FormLabel>Mode</FormLabel>
            <Select
              options={modeOptions}
              onChange={(selected) => setMode(selected.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Contract Attachment</FormLabel>
            <Input
              onChange={(e) => setContractAttachment(e.target.files[0])}
              type="file"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Renewal Date</FormLabel>
            <Input
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              type="date"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Last Renewal Date</FormLabel>
            <Input
              value={lastRenewalDate}
              onChange={(e) => setLastRenewalDate(e.target.value)}
              type="date"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Renewal Times</FormLabel>
            <Input
              value={renewalTimes}
              onChange={(e) => setRenewalTimes(e.target.value)}
              type="number"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            className="w-full py-3 font-bold rounded-lg"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ExcelDrawer;
