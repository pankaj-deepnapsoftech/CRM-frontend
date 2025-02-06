import {
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInputStepper,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Loading from "../../Loading";
import Select from "react-select";

const AdminsEditDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionOptions, setPermissionOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const editAdminAccessHandler = async (e) => {
    e.preventDefault();

    const permissions = selectedPermissions.map((p) => p.value);

    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "admin/edit-admin-permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          adminId: id,
          permissions,
          designation,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      closeDrawerHandler();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchAdminDetails = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "admin/admin-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          adminId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setName(data.admin.name);
      setPhone(data.admin.phone);
      setEmail(data.admin.email);
      setDesignation(data.admin.designation);

      const permissions = data.admin.allowedroutes.map((p) => {
        return {
          value: p,
          label: p,
        };
      });

      setSelectedPermissions(permissions);
      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      setIsLoading(false);
      toast.error(err.message);
    }
  };

  const getAllPermissions = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "admin/all-permissions", {
        method: "GET",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      const permissions = data.permissions.map((p) => {
        return {
          value: p,
          label: p,
        };
      });
      setPermissionOptions(permissions);
    } catch (err) {
      toast(err.message);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
    getAllPermissions();
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
        Employee
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold py-5 text-center mb-6 border-y bg-blue-200 rounded-lg shadow-md">
          Edit Employee Access
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <form onSubmit={editAdminAccessHandler} className="space-y-5">
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Name
              </FormLabel>
              <Input
                disabled
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Name"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Phone
              </FormLabel>
              <Input
                disabled
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="number"
                placeholder="Phone"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 no-scrollbar"
              />
            </FormControl>

            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Email
              </FormLabel>
              <Input
                disabled
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold" className="text-[#4B5563]">
                Designation
              </FormLabel>
              <Input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                type="text"
                placeholder="Designation"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </FormControl>

            <div className="mt-2 mb-5">
              <label className="font-bold text-[#4B5563]">Permissions</label>
              <Select
                className="rounded mt-2 p-3 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                options={permissionOptions}
                placeholder="Select permissions"
                value={selectedPermissions}
                onChange={(d) => setSelectedPermissions(d)}
                isSearchable={true}
                isMulti={true}
              />
            </div>

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

export default AdminsEditDrawer;
