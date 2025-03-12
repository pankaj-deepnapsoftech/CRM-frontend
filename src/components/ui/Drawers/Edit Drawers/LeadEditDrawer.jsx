import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  typography,
  useStatStyles,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Select from "react-select";
import Loading from "../../Loading";
import { notificationContext } from "../../../ctx/notificationContext";

const LeadEditDrawer = ({ dataId: id, closeDrawerHandler, fetchAllLeads }) => {
  const [companies, setCompanies] = useState([]);
  const [peoples, setPeoples] = useState([]);
  const [prcQt, setPrcQt] = useState();
  const [location, setLocation] = useState();

  const [showSelectPeoples, setShowSelectPeoples] = useState(true);
  const [showSelectCompanies, setShowSelectCompanies] = useState(true);

  const [statusId, setStatusId] = useState();

  const [sourceId, setSourceId] = useState();
  const [notes, setNotes] = useState("");
  const [products, setProducts] = useState();
  const [assigned, setAssigned] = useState();
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [employeeOptionsList, setEmployeeOptionsList] = useState();

  const [followupDate, setFollowupDate] = useState();
  const [followupReason, setFollowupReason] = useState();
  const [category, setCategory] = useState(null);

  const notificationCtx = useContext(notificationContext);

  const statusOptionsList = [
    // { value: "Draft", label: "Draft" },
    { value: "New", label: "New" },
    { value: "In Negotiation", label: "In Negotiation" },
    { value: "Completed", label: "Completed" },
    { value: "Loose", label: "Loose" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Assigned", label: "Assigned" },
    { value: "On Hold", label: "On Hold" },
    { value: "Follow Up", label: "Follow Up" },
  ];
  const sourceOptionsList = [
    { value: "Linkedin", label: "Linkedin" },
    { value: "Social Media", label: "Social Media" },
    { value: "Website", label: "Website" },
    { value: "Advertising", label: "Advertising" },
    { value: "Friend", label: "Friend" },
    { value: "Professionals Network", label: "Professionals Network" },
    { value: "Customer Referarral", label: "Customer Referarral" },
    { value: "Sales", label: "Sales" },
    { value: "Digital Marketing", label: "Digital Marketing" },
    { value: "Upwork", label: "Upwork" },
    { value: "Gem", label: "Gem" },
    { value: "Freelancer", label: "Freelancer" },
    { value: "IndiaMart", label: "IndiaMart" },
    { value: "Fiverr", label: "Fiverr" },
  ];

  const getAllCompanies = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "company/all-companies", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setCompanies(data.companies);
    } catch (err) {
      toast(err.message);
    }
  };

  const getAllPeoples = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "people/all-persons", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setPeoples(data.people);
    } catch (err) {
      toast(err.message);
    }
  };

  const getAllEmployees = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "admin/all-admins", {
        method: "GET",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setEmployees(data.admins);
    } catch (err) {
      toast(err.message);
    }
  };

  const editLeadHandler = async (e) => {
    e.preventDefault();
    if (statusId?.value === "Assigned" && assigned?.value === "") {
      toast.error("Employee not assigned");
      return;
    }
    if (
      statusId?.value === "Follow Up" &&
      (!followupDate || !followupReason || followupReason === "")
    ) {
      toast.error("Follow-up date and Follow-up reason required");
      return;
    }

    const productIds = products.map((p) => p._id);
    let body = {};
    if (
      statusId?.value === "Assigned" &&
      assigned?.value &&
      assigned?.value !== ""
    ) {
      body = JSON.stringify({
        leadId: id,
        status: statusId?.value,
        source: sourceId?.value,
        notes,
        assigned: assigned?.value,
        prc_qt: prcQt,
        location: location,
        leadCategory: category?.value,
      });
    } else if (
      statusId?.value === "Follow Up" &&
      followupDate &&
      followupReason
    ) {
      body = JSON.stringify({
        leadId: id,
        status: statusId?.value,
        source: sourceId?.value,
        notes,
        assigned: assigned?.value,
        followup_date: followupDate,
        followup_reason: followupReason,
        prc_qt: prcQt,
        location: location,
        leadCategory: category?.value,
      });
    } else {
      body = JSON.stringify({
        leadId: id,
        status: statusId?.value,
        source: sourceId?.value,
        notes,
        assigned: assigned?.value,
        prc_qt: prcQt,
        location: location,
        leadCategory: category?.value,
      });
    }

    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "lead/edit-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: body,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      closeDrawerHandler();
      fetchAllLeads();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchLeadDetails = async (e) => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "lead/lead-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          leadId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setProducts(data.lead?.products);
      setNotes(data.lead?.notes);
      setSourceId({ value: data.lead?.source, label: data.lead?.source });
      setStatusId({ value: data.lead?.status, label: data.lead?.status });

      setAssigned({
        value: data.lead?.assigned?._id,
        label: data.lead?.assigned?.name,
      });

      if (data.lead?.followup_date) {
        setFollowupDate(
          new Date(data.lead?.followup_date).toISOString().substring(0, 10)
        );
      }
      setFollowupReason(data.lead?.followup_reason);
      setPrcQt(data.lead?.prc_qt);
      setLocation(data.lead?.location);
      const selectedCategory = Leadoptions.find(
        (option) => option.value === data.lead?.leadCategory
      );
      setCategory(selectedCategory || null); // If not found, set to null or default
      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      setIsLoading(false);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    let options = [];
    options = options.concat(
      employees.map((data) => {
        return {
          value: data._id,
          label: data?.name,
        };
      })
    );
    setEmployeeOptionsList(options);
  }, [employees]);

  useEffect(() => {
    getAllCompanies();
    getAllPeoples();
    fetchLeadDetails();
    getAllEmployees();
  }, []);

  const [Leadoptions] = useState(() => [
    { value: "Hot", label: "Hot" },
    { value: "Warm", label: "Warm" },
    { value: "Cold", label: "Cold" },
  ]);

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
        Lead
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
          Edit Lead
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <form onSubmit={editLeadHandler} className="space-y-5">
            {/* Status Selection */}
            <div className="mt-2 mb-5">
              <label className="font-bold text-[#4B5563]">Status</label>
              <Select
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
                options={statusOptionsList}
                placeholder="Select status"
                value={statusId}
                onChange={(d) => {
                  setStatusId(d);
                }}
                isSearchable={true}
              />
            </div>

            {/* Assigned Employee Selection (conditionally shown) */}

            <div className="mt-2 mb-5">
              <label className="font-bold text-[#4B5563]">Assigned</label>
              <Select
                required={statusId?.value === "Assigned"}
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
                options={employeeOptionsList}
                placeholder="Select employee"
                value={assigned}
                onChange={(d) => {
                  setAssigned(d);
                }}
                isSearchable={true}
              />
            </div>

            {/* Source Selection */}
            <div className="mt-2 mb-5">
              <label className="font-bold text-[#4B5563]">Source</label>
              <Select
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
                options={sourceOptionsList}
                placeholder="Select source"
                value={sourceId}
                onChange={(d) => {
                  setSourceId(d);
                }}
                isSearchable={true}
              />
            </div>

            {/* Follow-up Section (conditionally shown) */}
            {statusId?.value === "Follow Up" && (
              <>
                <div className="mt-2 mb-5">
                  <label className="font-bold text-[#4B5563]">
                    Follow-up Date
                  </label>
                  <Input
                    type="date"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="mt-2 mb-5">
                  <label className="font-bold text-[#4B5563]">
                    Follow-up Reason
                  </label>
                  <Input
                    type="text"
                    value={followupReason}
                    onChange={(e) => setFollowupReason(e.target.value)}
                    className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </>
            )}

            {/* Remarks Textarea */}
            <FormControl className="mt-2 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Remarks
              </FormLabel>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                resize="none"
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            {/* PRC QT */}
            <FormControl className="mt-2 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                PRC QT
              </FormLabel>
              <Input
                type="text"
                value={prcQt}
                onChange={(e) => setPrcQt(e.target.value)}
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            {/* Location */}
            <FormControl className="mt-2 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Location
              </FormLabel>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded mt-2 border p-3 focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            <FormControl className="mt-2 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Lead Category
              </FormLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e)} // e is the selected option object
                placeholder="Select a lead status"
                options={Leadoptions}
              />
            </FormControl>

            {/* Submit Button */}
            <Button
              type="submit"
              className="mt-1 w-full py-3 text-white font-bold rounded-lg"
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

export default LeadEditDrawer;
