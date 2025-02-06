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

const IndiamartLeadEditDrawer = ({ dataId: id, closeDrawerHandler, fetchAllLeads, fetchLeadSummary }) => {
    const [statusId, setStatusId] = useState();

    const [remarks, setRemarks] = useState("");
    const [assigned, setAssigned] = useState();
    const [cookies] = useCookies();
    const [isLoading, setIsLoading] = useState(false);

    const [employees, setEmployees] = useState([]);
    const [employeeOptionsList, setEmployeeOptionsList] = useState();

    const [followupDate, setFollowupDate] = useState();
    const [followupReason, setFollowupReason] = useState();

    const notificationCtx = useContext(notificationContext);

    const statusOptionsList = [
        { value: "Draft", label: "Draft" },
        { value: "New", label: "New" },
        { value: "In Negotiation", label: "In Negotiation" },
        { value: "Completed", label: "Completed" },
        { value: "Loose", label: "Loose" },
        { value: "Cancelled", label: "Cancelled" },
        { value: "Assigned", label: "Assigned" },
        { value: "On Hold", label: "On Hold" },
        { value: "Follow Up", label: "Follow Up" },
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

    const editLeadHandler = async (e) => {
        e.preventDefault();

        if (statusId?.value === "Assigned" && assigned?.value === "") {
            toast.error("Employee not assigned");
            return;
        }
        if (statusId?.value === "Follow Up" && (!followupDate || !followupReason || followupReason === '')) {
            toast.error("Follow-up date and Follow-up reason required");
            return;
        }

        let body = {};
        if (
            statusId?.value === "Assigned" &&
            assigned?.value &&
            assigned?.value !== ""
        ) {
            body = JSON.stringify({
                leadId: id,
                status: statusId?.value,
                remarks,
                assigned: assigned?.value,
            });
        } else if (
            statusId?.value === "Follow Up" &&
            followupDate &&
            followupReason
        ) {
            body = JSON.stringify({
                leadId: id,
                status: statusId?.value,
                remarks,
                assigned: assigned?.value,
                followup_date: followupDate,
                followup_reason: followupReason,
            });
        } else {
            body = JSON.stringify({
                leadId: id,
                status: statusId?.value,
                remarks,
                assigned: undefined,
            });
        }

        try {
            const baseURL = process.env.REACT_APP_BACKEND_URL;

            const response = await fetch(baseURL + "indiamart/edit", {
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
            if (statusId?.value === 'Follow Up') {
                notificationCtx.getFollowupReminders();
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const fetchLeadDetails = async (e) => {
        setIsLoading(true);
        try {
            const baseUrl = process.env.REACT_APP_BACKEND_URL;
            const response = await fetch(baseUrl + "indiamart/details", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookies?.access_token}`,
                },
                body: JSON.stringify({
                    _id: id,
                }),
            });
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            setRemarks(data.lead?.remarks);
            setStatusId({ value: data.lead?.status, label: data.lead?.status });
            if (data?.lead?.status === "Assigned") {
                setAssigned({
                    value: data.lead?.assigned._id,
                    label: data.lead?.assigned?.name,
                });
            }
            if (data.lead?.followup_date) {
                setFollowupDate(
                    new Date(data.lead?.followup_date).toISOString().substring(0, 10)
                );
            }
            setFollowupReason(data.lead?.followup_reason);

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
        // getAllCompanies();
        // getAllPeoples();
        fetchLeadDetails();
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
                    Edit Lead
                </h2>

                {isLoading && <Loading />}
                {!isLoading && (
                    <form onSubmit={editLeadHandler}>
                        {/* <div className="mt-2 mb-5">
                <label className="font-bold">Type</label>
                <Select
                  className="rounded mt-2"
                  options={typeOptionsList}
                  placeholder="Select type"
                  value={typeId}
                  onChange={(d) => {
                    console.log(d);
                    // setTypeLabel(d);
                    setTypeId(d);
                  }}
                  isSearchable={true}
                />
              </div> */}

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

                        {statusId?.value === "Assigned" && (
                            <div className="mt-2 mb-5">
                                <label className="font-bold">Assigned</label>
                                <Select
                                    required={statusId?.value === "Assigned"}
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

                        {statusId?.value === 'Follow Up' && <>
                            <div className="mt-2 mb-5">
                                <label className="font-bold">Follow-up Date</label>
                                <Input
                                    type="date"
                                    value={followupDate}
                                    min={new Date().toISOString().substring(0, 10)}
                                    onChange={(e) => setFollowupDate(e.target.value)}
                                />
                            </div>

                            <div className="mt-2 mb-5">
                                <label className="font-bold">Follow-up Reason</label>
                                <Input
                                    type="text"
                                    value={followupReason}
                                    onChange={(e) => setFollowupReason(e.target.value)}
                                />
                            </div>
                        </>
                        }

                        {/* {(showSelectPeoples || !typeId) && (
                <div className="mt-2 mb-5">
                  <label className="font-bold">Individual</label>
                  <Select
                    className="rounded mt-2"
                    options={peopleOptionsList}
                    placeholder="Select individual"
                    value={peopleId}
                    onChange={(d) => {
                      if (d.value === "Add Individual") {
                        closeDrawerHandler();
                        navigate("/crm/individuals");
                      }
                      setPeopleId(d);
                      // setPeopleLabel(d);
                    }}
                    isSearchable={true}
                  />
                </div>
              )}
  
              {(showSelectCompanies || !typeId) && (
                <div className="mt-2 mb-5">
                  <label className="font-bold">Corporate</label>
                  <Select
                    className="rounded mt-2"
                    options={companyOptionsList}
                    placeholder="Select corporate"
                    value={companyId}
                    onChange={(d) => {
                      console.log(d);
                      if (d.value === "Add Corporate") {
                        closeDrawerHandler();
                        navigate("/crm/corporates");
                      }
                      setCompanyId(d);
                      // setCompanyLabel(d);
                    }}
                    isSearchable={true}
                  />
                </div>
              )} */}
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
    )
}

export default IndiamartLeadEditDrawer
