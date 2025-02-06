import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

function AdminDeleteAlert({
  fetchAllAdmins,
  deleteEmployeeSelectedId,
  isOpen,
  onOpen,
  onClose,
  cancelRef,
}) {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeeOptionsList, setEmployeeOptionsList] = useState();
  const [assigned, setAssigned] = useState({
    value: "",
    label: "Select Employee",
  });
  const [cookies] = useCookies();
  const [isDeleting, setIsDeleting] = useState(false);

  const getAllEmployees = async () => {
    // if (!deleteEmployeeSelectedId || deleteEmployeeSelectedId === "") {
    //   toast.error("Employee for deletion is not selected");
    //   return;
    // }
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
      const employess = data.admins.filter(
        (admin) => admin._id !== deleteEmployeeSelectedId
      );
      setEmployees(employess);
    } catch (err) {
      toast(err.message);
    }
  };

  const assignToEmployee = async () => {
    if (!assigned?.value || assigned?.value === "") {
      toast.error("Employee not selected");
      return;
    }
    if (!deleteEmployeeSelectedId || deleteEmployeeSelectedId === "") {
      toast.error("Employee for deletion is not selected");
      return;
    }

    try {
      setIsDeleting(true);
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "admin/assign-employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          assign_to_id: assigned?.value,
          creator_id: deleteEmployeeSelectedId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      deleteEmployee(deleteEmployeeSelectedId);
    } catch (err) {
      toast(err.message);
    }
  };

  const deleteEmployee = async (id) => {
    if (!deleteEmployeeSelectedId || deleteEmployeeSelectedId === "") {
      toast.error("Employee for deletion is not selected");
      return;
    }
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "admin/delete-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          adminId: id,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      fetchAllAdmins();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, [showAssignForm]);

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
    setShowAssignForm(false);
    setAssigned({value:'', label: 'Select Employee'});
  }, [isOpen]);

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Employee
            </AlertDialogHeader>

            <AlertDialogBody>
              {!showAssignForm && (
                <div>
                  Are you sure? You have to assign the Individuals, Corporates,
                  Customers, Proforma Invoices, Invoices and Payments to another
                  employee, else all the Employee data will be deleted. You
                  can't undo this action afterwards.
                </div>
              )}

              {showAssignForm && (
                <div>
                  <form>
                    <div className="mt-2 mb-5">
                      <label className="font-bold">Assign to</label>
                      <Select
                        required={true}
                        className="rounded mt-2"
                        options={employeeOptionsList}
                        value={assigned}
                        onChange={(d) => {
                          setAssigned(d);
                        }}
                        isSearchable={true}
                      />
                    </div>
                  </form>
                </div>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              {!showAssignForm && (
                <>
                  <Button
                    colorScheme="blue"
                    onClick={() => setShowAssignForm(true)}
                    ml={3}
                  >
                    Assign
                  </Button>
                  <Button colorScheme="red" onClick={()=>deleteEmployee(deleteEmployeeSelectedId)} ml={3}>
                    Delete
                  </Button>
                </>
              )}
              {showAssignForm && (
                <>
                  <Button
                    disabled={!isDeleting}
                    colorScheme="red"
                    onClick={assignToEmployee}
                    ml={3}
                  >
                    {isDeleting
                      ? "Assigning and Deleting..."
                      : "Assign and Delete"}
                  </Button>
                </>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default AdminDeleteAlert;
