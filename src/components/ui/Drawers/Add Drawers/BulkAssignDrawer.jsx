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

const BulkAssignDrawer = ({
  leads,
  closeDrawerHandler,
  fetchAllLeads,
  fetchLeadSummary,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [assigned, setAssigned] = useState();
  const [cookies] = useCookies();

  const [employees, setEmployees] = useState([]);
  const [employeeOptionsList, setEmployeeOptionsList] = useState();

  const bulkAssignHandler = async () => {
    try {
      setIsLoading(true);
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "lead/bulk-assign", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leads: leads || [],
          assignedTo: assigned.value,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      fetchAllLeads();
      fetchLeadSummary();
      closeDrawerHandler();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllEmployees = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
        Lead
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Bulk Assign
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <form onSubmit={bulkAssignHandler}>
            <div className="mt-2 mb-5">
              <label className="font-bold">Assign To</label>
              <Select
                required={true}
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

export default BulkAssignDrawer;
