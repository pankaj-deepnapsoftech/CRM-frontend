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

const SupportEditDrawer = ({
  dataId: id,
  closeDrawerHandler,
  fetchAllSupport,
}) => {
  const [remarks, setRemarks] = useState("");
  const [assigned, setAssigned] = useState();
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [statusId, setStatusId] = useState();
  
  const [employees, setEmployees] = useState([]);
  const [employeeOptionsList, setEmployeeOptionsList] = useState();

  const statusOptionsList = [
    { value: "new", label: "New" },
    { value: "under process", label: "Under Process" },
    { value: "assigned", label: "Assigned" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "completed", label: "Completed" },
  ];

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

  const editSupportHandler = async (e) => {
    e.preventDefault();

    if (statusId?.value === "Assigned" && assigned?.value === "") {
      toast.error("Employee not assigned");
      return;
    }

    let body = {};
    if (
      statusId?.value === "assigned" &&
      assigned?.value &&
      assigned?.value !== ""
    ) {
      body = JSON.stringify({
        supportId: id,
        status: statusId?.value,
        remarks,
        assigned: assigned?.value,
      });
    } else {
      body = JSON.stringify({
        supportId: id,
        status: statusId?.value,
        remarks,
      });
    }

    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "support/edit-support", {
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
      fetchAllSupport();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchSupportDetails = async (e) => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "support/get-support", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            supportId: id
        })
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setRemarks(data.support?.remarks);
      setStatusId({ value: data.support?.status, label: data.support?.status?.substr(0,1).toUpperCase()+data.support?.status?.substr(1)});
      if (data?.support?.status === "Assigned") {
        setAssigned({
          value: data.support?.assigned._id,
          label: data.support?.assigned?.name,
        });
      }

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
    fetchSupportDetails();
    getAllEmployees();
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
        Support
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Edit Support
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <form onSubmit={editSupportHandler}>

            <div className="mt-2 mb-5">
              <label className="font-bold">Status</label>
              <Select
                className="rounded mt-2"
                options={statusOptionsList}
                placeholder="Select status"
                value={statusId}
                onChange={(d) => {
                  // setStatusLabel(d);
                  setStatusId(d);
                }}
                isSearchable={true}
              />
            </div>

            {statusId?.value === "assigned" && (
              <div className="mt-2 mb-5">
                <label className="font-bold">Assigned</label>
                <Select
                  required={statusId?.value === "assigned"}
                  className="rounded mt-2"
                  options={employeeOptionsList}
                  placeholder="Select employee"
                  value={assigned}
                  onChange={(d) => {
                    setAssigned(d);
                  }}
                  isSearchable={true}
                />
              </div>
            )}
            <FormControl className="mt-2 mb-5">
              <FormLabel fontWeight="bold">Remarks</FormLabel>
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                resize="none"
              />
            </FormControl>
            <Button
              type="submit"
              className="mt-1"
              color="white"
              backgroundColor="#1640d6"
            >
              Submit
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SupportEditDrawer;
