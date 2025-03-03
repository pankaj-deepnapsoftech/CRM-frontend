import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  Text,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Loading from "../../Loading";

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
  { value: "other", label: "Other" },
];

const ExcelEditDrawer = ({ dataId: id, closeDrawerHandler }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  const fetchPeopleDetails = async () => {
    setIsLoading(true);
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${baseURL}renewal/record/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${cookies?.access_token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      const personData = data.data;
      setCustumerName(personData.custumerName);
      setPhnNumber(personData.phnNumber);
      setContractNumber(personData.contractNumber);
      setProductName(personData.productName);
      setRenewalDate(personData.renewalDate?.split("T")[0] || "");
      setLastRenewalDate(personData.lastRenewalDate?.split("T")[0] || "");
      setRenewalTimes(personData.renewalTimes);
      setYears(personData.years);
      setMonths(personData.months);
      setDoc(personData.doc);
      setStatus(personData.status);
      setRemarks(personData.remarks);

      const isContractOther = !contractOptions.some(
        (opt) => opt.value === personData.contractType
      );
      if (isContractOther) {
        setContractType("other");
        setOtherContractType(personData.contractType);
      } else {
        setContractType(personData.contractType);
      }

      const isModeOther = !modeOptions.some(
        (opt) => opt.value === personData.mode
      );
      if (isModeOther) {
        setMode("other");
        setOtherMode(personData.mode);
      } else {
        setMode(personData.mode);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPeopleDetails();
  }, [id]);

  const editPeopleHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
      formData.append("mode", mode === "other" ? otherMode : mode);
      formData.append("renewalDate", renewalDate);
      formData.append("lastRenewalDate", lastRenewalDate);
      formData.append("renewalTimes", renewalTimes);
      formData.append("years", years);
      formData.append("months", months);
      formData.append("doc", doc);
      formData.append("status", status);
      formData.append("remarks", remarks);

      if (contractAttachment)
        formData.append("contractAttachment", contractAttachment);

     

      const response = await fetch(`${baseURL}renewal/update-record/${id}`, {
        method: "PUT",
        headers: { authorization: `Bearer ${cookies?.access_token}` },
        body: formData,
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      toast.success("Record updated successfully!");
      closeDrawerHandler();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOption = [
    { value: "pending", label: "Pending" },
    { value: "renewed", label: "Renewed" },
  ];

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
        Renewal
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
          Edit Renewal
        </h2>

        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={editPeopleHandler} className="space-y-5">
            <FormControl>
              <FormLabel>Customer Name</FormLabel>
              <Input
                value={custumerName}
                onChange={(e) => setCustumerName(e.target.value)}
                type="text"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                value={phnNumber}
                onChange={(e) => setPhnNumber(e.target.value)}
                type="number"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Contract Type</FormLabel>
              <Select
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
              >
                {contractOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {contractType === "other" && (
                <Input
                  placeholder="Enter other type"
                  value={otherContractType}
                  onChange={(e) => setOtherContractType(e.target.value)}
                  mt={2}
                />
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Contract Number</FormLabel>
              <Input
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                type="text"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                type="text"
              />
            </FormControl>

            <FormControl>
              <FormLabel>DOC</FormLabel>
              <Input
                type="date"
                value={doc}
                onChange={(e) => setDoc(e.target.value)}
              />
            </FormControl>

            <Box>
              <FormControl>
                <FormLabel>Tenure</FormLabel>
                <Box display="flex" gap={2}>
                  <Input
                    type="text"
                    placeholder="Years"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                  <Input
                    type="text"
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

            <FormControl>
              <FormLabel>Mode</FormLabel>
              <Select
                options={modeOptions}
                onChange={(e) => setMode(e.target.value)}
              >
                {modeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Contract Attachment</FormLabel>
              <Input
                onChange={(e) => setContractAttachment(e.target.files[0])}
                type="file"
              />
            </FormControl>

            <FormControl>
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

            <FormControl>
              <FormLabel>Renewal Times</FormLabel>
              <Input
                value={renewalTimes}
                onChange={(e) => setRenewalTimes(e.target.value)}
                type="number"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Renewal Status</FormLabel>
              <Select
                value={status}
                options={statusOption}
                onChange={(selected) => setStatus(selected.target.value)}
              >
                {statusOption.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl >
            <FormLabel>Remarks</FormLabel>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              type="text"
            />
          </FormControl>

            {/* Add other form fields similarly */}

            <Button
              type="submit"
              className="mt-1 w-full py-3 text-white font-bold rounded-lg"
              colorScheme="blue"
              isLoading={isLoading}
            >
              Submit
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ExcelEditDrawer;
