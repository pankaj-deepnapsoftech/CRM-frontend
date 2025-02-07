import {
  Badge,
  Button,
  Checkbox,
  HStack,
  Input,
  Select,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import {
  MdOutlineRefresh,
  MdArrowBack,
  MdEdit,
  MdDeleteOutline,
  MdOutlineVisibility,
  MdDelete,
  MdAssignmentInd,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddLeadsDrawer,
  closeEditLeadsDrawer,
  closeSendSMSDrawer,
  closeShowBulkAssignDrawer,
  closeShowDetailsLeadsDrawer,
  openAddLeadsDrawer,
  openEditLeadsDrawer,
  openSendSMSDrawer,
  openShowBulkAssignDrawer,
  openShowDetailsLeadsDrawer,
} from "../../redux/reducers/misc";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../ui/Loading";
import { FcDatabase } from "react-icons/fc";
import { FaCaretDown, FaCaretUp, FaFileCsv, FaSms } from "react-icons/fa";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { usePagination, useSortBy, useTable } from "react-table";
import ClickMenu from "../ui/ClickMenu";
import LeadEditDrawer from "../ui/Drawers/Edit Drawers/LeadEditDrawer";
import LeadsDetailsDrawer from "../ui/Drawers/Details Drawers/LeadsDetailsDrawer";
import LeadsDrawer from "../ui/Drawers/Add Drawers/LeadsDrawer";
import moment from "moment";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { PieChart } from "../ui/Charts/PieChart";
import { checkAccess } from "../../utils/checkAccess";

import sampleCSV from "../../assets/bulk-upload-sample.csv";
import SMSDrawer from "../ui/Drawers/Add Drawers/SMSDrawer";
import BulkAssignDrawer from "../ui/Drawers/Add Drawers/BulkAssignDrawer";

const columns = [
  {
    Header: "",
    accessor: "select",
  },
  {
    Header: "Created By",
    accessor: "creator",
  },
  {
    Header: "Created On",
    accessor: "created_on",
  },
  {
    Header: "Type",
    accessor: "leadtype",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Assigned",
    accessor: "assigned",
  },
  {
    Header: "Source",
    accessor: "source",
  },
  {
    Header: "Follow-up Date",
    accessor: "followup_date",
  },
  {
    Header: "Follow-up Reason",
    accessor: "followup_reason",
  },
  {
    Header: "Phone",
    accessor: "phone",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Location",
    accessor: "location",
  },
  {
    Header: "PRC QT",
    accessor: "prc_qt",
  },
  {
    Header: "Lead Category",
    accessor: "leadCategory",
  },
];

const Leads = () => {
  const [cookies] = useCookies();
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataId, setDataId] = useState();
  const [loading, setLoading] = useState(true);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const [leadSummaryData, setLeadSummaryData] = useState([]);
  const [leadSummaryLabels, setLeadSummaryLabels] = useState([]);
  const [leadSummaryBG, setLeadSummaryBG] = useState([]);

  const [isAllSelected, setIsAllSelected] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();

  const [leadDeleteId, setLeadDeleteId] = useState();
  const [deleteAll, setDeleteAll] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const [toggleBulkUpload, setToggleBulkUpload] = useState(false);
  const csvRef = useRef();

  const [bulkSMSMobiles, setBulkSMSMobiles] = useState([]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex, pageSize },
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data: filteredData,
    },
    useSortBy,
    usePagination
  );

  const {
    addLeadsDrawerIsOpened,
    editLeadsDrawerIsOpened,
    showDetailsLeadsDrawerIsOpened,
    sendSMSDrawerIsOpened,
    showBulkAssignDrawerIsOpened,
  } = useSelector((state) => state.misc);

  const { role, ...auth } = useSelector((state) => state.auth);
  const { isAllowed, msg } = checkAccess(auth, "lead");

  const statusStyles = {
    draft: {
      bg: "#ffffff",
      text: "black",
    },
    new: {
      bg: "#e6f4ff",
      text: "#0958d9",
    },
    "in negotiation": {
      bg: "#f9f0ff",
      text: "#531dab",
    },
    completed: {
      bg: "#f6ffed",
      text: "#389e0d",
    },
    loose: {
      bg: "#fff1f0",
      text: "#cf1322",
    },
    cancelled: {
      bg: "#dd153d",
      text: "#f1ecff",
    },
    assigned: {
      bg: "#48d1cc",
      text: "#f9f0ff",
    },
    "on hold": {
      bg: "#deb887",
      text: "#ffffff",
    },
    "follow up": {
      bg: "#db95ff",
      text: "#ffffff",
    },
  };

  const sourceStyles = {
    linkedin: {
      bg: "rgb(65, 105, 225)",
      text: "#fff",
    },
    "social media": {
      bg: "rgb(135, 206, 235)",
      text: "#fff",
    },
    website: {
      bg: "rgb(255, 127, 80)",
      text: "#fff",
    },
    advertising: {
      bg: "rgb(0, 100, 0)",
      text: "#fff",
    },
    friend: {
      bg: "rgb(178, 34, 34)",
      text: "#fff",
    },
    "professionals network": {
      bg: "rgb(199, 21, 133)",
      text: "#fff",
    },
    "customer referral": {
      bg: "rgb(238, 130, 238)",
      text: "#fff",
    },
    sales: {
      bg: "rgb(255, 20, 147)",
      text: "#fff",
    },
  };

  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const fetchAllLeads = async () => {
    setSearchKey("");
    setData([]);
    setFilteredData([]);
    setLoading(true);
    try {
      const response = await fetch(baseURL + "lead/all-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setData(data.leads);
      console.log(data.leads);

      setFilteredData(data.leads);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  const fetchLeadSummary = async () => {
    setData([]);
    setFilteredData([]);
    setLoading(true);
    try {
      const response = await fetch(baseURL + "lead/lead-summary", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setLeadSummaryBG([
        "#F57D6A",
        "#F8D76A",
        "#54CA21",
        "#21CAC1",
        "#2170CA",
        "#C439EB",
        "#C7C7C7",
        "#F35C9D",
        "#55DCB8",
      ]);

      const labels = Object.keys(data.leads[0].statusCount).map((status) => {
        return `${status} ${(
          (data.leads[0].statusCount[status] / data.leads[0].totalCount) *
          100
        ).toFixed(2)}%`;
      });

      setLeadSummaryLabels(labels);
      setLeadSummaryData(Object.values(data.leads[0].statusCount));
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  const bulkUploadHandler = async (e) => {
    e.preventDefault();

    try {
      setBulkUploading(true);
      if (csvRef.current.files.length === 0) {
        toast.error("CSV file not selected");
        return;
      }
      console.log(csvRef.current.files[0]);
      const formData = new FormData();
      formData.append("excel", csvRef.current.files[0]);

      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "lead/bulk-upload", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      fetchAllLeads();
      setToggleBulkUpload(false);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setBulkUploading(false);
    }
  };

  const selectAllHandler = () => {
    const select = !isAllSelected;
    setIsAllSelected(select);
    const rows = Array.from(document.getElementsByName("select")).slice(
      pageIndex * pageSize,
      pageIndex * pageSize + pageSize
    );
    rows.forEach((e) => {
      e.checked = select;
    });

    if (select) {
      const reqData = filteredData.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize
      );
      const bulkSMSMobilesArr = reqData.map((data) => data.phone);
      setBulkSMSMobiles(bulkSMSMobilesArr);
    } else {
      setBulkSMSMobiles([]);
    }
  };

  const selectOneHandler = (e, phone) => {
    if (e.target.checked) {
      setBulkSMSMobiles((prev) => [...prev, phone]);
    }
  };

  const bulkAssignHandler = async (e) => {
    const rows = document.getElementsByName("select");
    const selectedRows = Array.from(rows).filter((e) => e.checked);
    if (selectedRows.length === 0) {
      toast.error("No lead selected");
      return;
    }
    const selectedRowIds = selectedRows.map((e) => e.value);
    setSelected(selectedRowIds);
    dispatch(openShowBulkAssignDrawer());
  };

  const bulkDownloadHandler = async (e) => {
    fetch(baseURL + "lead/bulk-download", {
      method: "GET",
      headers: {
        authorization: `Bearer ${cookies?.access_token}`,
      },
    })
      .then((response) => {
        const filename = response.headers
          .get("content-disposition")
          .split("filename=")[1]
          .replace(/"/g, "");
        return response.blob().then((blob) => ({ filename, blob }));
      })
      .then(({ filename, blob }) => {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        a.remove();
      })
      .catch((err) => {
        toast.error(err?.message || "Something went wrong");
      });
  };

  const addLeadsHandler = () => {
    dispatch(openAddLeadsDrawer());
  };

  const confirmDeleteHandler = async () => {
    onOpen();
  };

  const deleteAllHandler = async () => {
    try {
      const response = await fetch(baseURL + "lead/delete-all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      onClose();
      fetchAllLeads();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteHandler = async () => {
    if (!leadDeleteId) {
      return;
    }

    try {
      const response = await fetch(baseURL + "lead/delete-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          leadId: leadDeleteId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      onClose();
      fetchAllLeads();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const editHandler = (id) => {
    setDataId(id);
    dispatch(openEditLeadsDrawer());
  };

  const showDetailsHandler = (id) => {
    setDataId(id);
    dispatch(openShowDetailsLeadsDrawer());
  };

  useEffect(() => {
    if (isAllowed) {
      fetchAllLeads();
      fetchLeadSummary();
    }
  }, []);

  useEffect(() => {
    if (location?.state?.searchKey) {
      setSearchKey(location?.state?.searchKey);
    }
  }, []);

  useEffect(() => {
    setBulkSMSMobiles([]);
    setIsAllSelected(false);
    if (searchKey.trim() !== "") {
      const searchedData = data.filter(
        (d) =>
          (d?.leadtype === "People"
            ? "individual".includes(searchKey.toLowerCase())
            : "corporate".includes(searchKey.toLowerCase())) ||
          d?.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.source?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.status?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.assigned?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.leadCategory?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.phone?.includes(searchKey) ||
          d?.followup_reason?.toLowerCase()?.includes(searchKey) ||
          d?.creator?.toLowerCase()?.includes(searchKey) ||
          (d?.followup_date &&
            new Date(d?.followup_date)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              .reverse()
              .join("")
              ?.includes(searchKey.replaceAll("/", ""))) ||
          (d?.createdAt &&
            new Date(d?.createdAt)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              .reverse()
              .join("")
              ?.includes(searchKey.replaceAll("/", ""))) ||
          d?.email?.toLowerCase().includes(searchKey.toLowerCase())
      );
      setFilteredData(searchedData);
    } else {
      setFilteredData(data);
    }
  }, [searchKey, data]);

  useEffect(() => {
    setIsAllSelected(false);
    setBulkSMSMobiles([]);
  }, [pageIndex]);

  function getCategoryColor(category) {
    switch (category?.toLowerCase()) {
      case "hot":
        return "red"; // Chakra UI "red" color scheme
      case "warm":
        return "orange"; // Chakra UI "orange" color scheme
      case "cold":
        return "blue"; // Chakra UI "blue" color scheme
      default:
        return "gray"; // Default to gray if no category is provided
    }
  }

  return (
    <>
      {!isAllowed && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#ff6f6f] flex gap-x-2">
          {msg}
          {((auth?.isSubscribed && auth?.isSubscriptionEnded) ||
            (auth?.isTrial && auth?.isTrialEnded)) && (
            <div className="-mt-1">
              <Link to="/pricing">
                <button className="text-base border border-[#d61616] rounded-md px-5 py-1 bg-[#d61616] text-white font-medium hover:bg-white hover:text-[#d61616] ease-in-out duration-300">
                  Pay Now
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {isAllowed && (
        <div
          className="border-[1px] px-2 py-8 md:px-9 rounded"
          style={{ boxShadow: "0 0 20px 3px #96beee26" }}
        >
          <>
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    {!deleteAll && leadDeleteId && <span>Delete Lead</span>}
                    {deleteAll && !leadDeleteId && (
                      <span>Delete All Leads</span>
                    )}
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure, deleting a Lead will also delete its
                    corresponding Offers?
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    {!deleteAll && leadDeleteId && (
                      <Button colorScheme="red" onClick={deleteHandler} ml={3}>
                        Delete Lead
                      </Button>
                    )}
                    {deleteAll && !leadDeleteId && (
                      <Button
                        colorScheme="red"
                        onClick={deleteAllHandler}
                        ml={3}
                      >
                        Delete All
                      </Button>
                    )}
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
          <div>
            <div className="flex flex-col items-start justify-start gap-y-1 md:justify-between mb-4  pb-2 z-10">
              <div className="w-full flex text-lg lg:text-xl justify-between font-semibold lg:items-center gap-y-1 mb-2">
                {/* <span className="mr-2">
                  <MdArrowBack />
                </span> */}
                <div>Lead List</div>
                <div className="flex gap-x-2">
                  <textarea
                    className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#1640d6] hover:outline:[#1640d6] border resize-none"
                    rows="1"
                    width="220px"
                    placeholder="Search"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                  <Button
                    fontSize={{ base: "14px", md: "14px" }}
                    paddingX={{ base: "10px", md: "12px" }}
                    paddingY={{ base: "0", md: "3px" }}
                    width={{ base: "-webkit-fill-available", md: 100 }}
                    onClick={() => {
                      fetchAllLeads();
                      fetchLeadSummary();
                    }}
                    leftIcon={<MdOutlineRefresh />}
                    color="#1640d6"
                    borderColor="#1640d6"
                    variant="outline"
                  >
                    Refresh
                  </Button>
                </div>
              </div>

              <div className="mt-2 md:mt-0 flex flex-wrap justify-center gap-y-2 gap-x-3 w-full">
                <Button
                  fontSize={{ base: "12px", md: "14px" }}
                  paddingX={{ base: "8px", md: "12px" }}
                  paddingY={{ base: "2px", md: "3px" }}
                  width={{ base: "100%", md: 130 }}
                  onClick={selectAllHandler}
                  color="#ffffff"
                  backgroundColor="#1640d6"
                  borderColor="#1640d6"
                >
                  {isAllSelected ? "Unselect All" : "Select All"}
                </Button>
                <Button
                  fontSize={{ base: "12px", md: "14px" }}
                  paddingX={{ base: "8px", md: "12px" }}
                  paddingY={{ base: "2px", md: "3px" }}
                  width={{ base: "100%", md: 130 }}
                  onClick={() => {
                    dispatch(openSendSMSDrawer());
                  }}
                  rightIcon={<FaSms size={28} />}
                  color="#ffffff"
                  backgroundColor="#1640d6"
                  borderColor="#1640d6"
                >
                  Bulk SMS
                </Button>
                <Button
                  fontSize={{ base: "12px", md: "14px" }}
                  paddingX={{ base: "8px", md: "12px" }}
                  paddingY={{ base: "2px", md: "3px" }}
                  width={{ base: "100%", md: 130 }}
                  onClick={() => {
                    bulkAssignHandler();
                  }}
                  rightIcon={<MdAssignmentInd size={28} />}
                  color="#ffffff"
                  backgroundColor="#1640d6"
                  borderColor="#1640d6"
                >
                  Bulk Assign
                </Button>
                {role === "Super Admin" && (
                  <Button
                    fontSize={{ base: "12px", md: "14px" }}
                    paddingX={{ base: "8px", md: "12px" }}
                    paddingY={{ base: "2px", md: "3px" }}
                    width={{ base: "100%", md: 150 }}
                    onClick={() => {
                      bulkDownloadHandler();
                    }}
                    rightIcon={<FaFileCsv size={28} />}
                    color="#ffffff"
                    backgroundColor="#1640d6"
                    borderColor="#1640d6"
                  >
                    Bulk Download
                  </Button>
                )}
                <div className="w-full md:w-auto">
                  <Button
                    fontSize={{ base: "12px", md: "14px" }}
                    paddingX={{ base: "8px", md: "12px" }}
                    paddingY={{ base: "2px", md: "3px" }}
                    width={{ base: "100%", md: 200 }}
                    color="white"
                    backgroundColor="#1640d6"
                    rightIcon={<FaFileCsv size={28} />}
                    onClick={() => setToggleBulkUpload((prev) => !prev)}
                  >
                    Bulk Upload
                  </Button>
                  {toggleBulkUpload && (
                    <>
                      <div className="mt-2">
                        <a href={sampleCSV}>
                          <Button
                            fontSize={{ base: "12px", md: "14px" }}
                            paddingX={{ base: "8px", md: "12px" }}
                            paddingY={{ base: "2px", md: "3px" }}
                            width={{ base: "100%", md: 200 }}
                            color="#1640d6"
                            borderColor="#1640d6"
                            variant="outline"
                          >
                            Download Sample CSV
                          </Button>
                        </a>
                      </div>
                      <div className="mt-2">
                        <form onSubmit={bulkUploadHandler}>
                          <input
                            ref={csvRef}
                            className="mr-1 p-1 rounded-md outline-none border border-[#8B8B8B] w-full md:w-60"
                            type="file"
                            accept=".csv"
                          />
                          <Button
                            isDisabled={bulkUploading}
                            isLoading={bulkUploading}
                            fontSize={{ base: "12px", md: "14px" }}
                            paddingX={{ base: "8px", md: "12px" }}
                            paddingY={{ base: "2px", md: "3px" }}
                            width={{ base: "100%", md: 100 }}
                            color="white"
                            backgroundColor="#1640d6"
                            type="submit"
                          >
                            Upload
                          </Button>
                        </form>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  fontSize={{ base: "12px", md: "14px" }}
                  paddingX={{ base: "8px", md: "12px" }}
                  paddingY={{ base: "2px", md: "3px" }}
                  width={{ base: "100%", md: 200 }}
                  onClick={addLeadsHandler}
                  color="white"
                  backgroundColor="#1640d6"
                >
                  Add New Lead
                </Button>
                {role === "Super Admin" && (
                  <Button
                    fontSize={{ base: "12px", md: "14px" }}
                    paddingX={{ base: "8px", md: "12px" }}
                    paddingY={{ base: "2px", md: "3px" }}
                    width={{ base: "100%", md: "auto" }}
                    onClick={() => {
                      setDeleteAll(true);
                      confirmDeleteHandler();
                    }}
                    color="white"
                    backgroundColor="#e34949"
                  >
                    <MdDelete size={28} />
                  </Button>
                )}
                <Select
                  onChange={(e) => setPageSize(e.target.value)}
                  width="80px"
                  className="mt-2 md:mt-0"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={100000}>All</option>
                </Select>
              </div>
            </div>

            <div>
              <HStack className="">
                {showBulkAssignDrawerIsOpened && (
                  <ClickMenu
                    top={0}
                    right={0}
                    closeContextMenuHandler={() =>
                      dispatch(closeShowBulkAssignDrawer())
                    }
                  >
                    <BulkAssignDrawer
                      leads={selected}
                      fetchAllLeads={fetchAllLeads}
                      fetchLeadSummary={fetchLeadSummary}
                      closeDrawerHandler={() =>
                        dispatch(closeShowBulkAssignDrawer())
                      }
                      data={[]}
                    />
                  </ClickMenu>
                )}

                {sendSMSDrawerIsOpened && (
                  <ClickMenu
                    top={0}
                    right={0}
                    closeContextMenuHandler={() => {
                      dispatch(closeSendSMSDrawer());
                      setBulkSMSMobiles([]);
                    }}
                  >
                    <SMSDrawer
                      fetchAllLeads={fetchAllLeads}
                      closeDrawerHandler={() => {
                        dispatch(closeSendSMSDrawer());
                        setBulkSMSMobiles([]);
                      }}
                      mobiles={bulkSMSMobiles}
                    />
                  </ClickMenu>
                )}

                {addLeadsDrawerIsOpened && (
                  <ClickMenu
                    top={0}
                    right={0}
                    closeContextMenuHandler={() =>
                      dispatch(closeAddLeadsDrawer())
                    }
                  >
                    <LeadsDrawer
                      fetchLeadSummary={fetchLeadSummary}
                      fetchAllLeads={fetchAllLeads}
                      closeDrawerHandler={() => dispatch(closeAddLeadsDrawer())}
                    />
                  </ClickMenu>
                )}

                {editLeadsDrawerIsOpened && (
                  <ClickMenu
                    top={0}
                    right={0}
                    closeContextMenuHandler={() =>
                      dispatch(closeEditLeadsDrawer())
                    }
                  >
                    <LeadEditDrawer
                      fetchLeadSummary={fetchLeadSummary}
                      dataId={dataId}
                      fetchAllLeads={fetchAllLeads}
                      closeDrawerHandler={() =>
                        dispatch(closeEditLeadsDrawer())
                      }
                    />
                  </ClickMenu>
                )}

                {showDetailsLeadsDrawerIsOpened && (
                  <ClickMenu
                    top={0}
                    right={0}
                    closeContextMenuHandler={() =>
                      dispatch(closeShowDetailsLeadsDrawer())
                    }
                  >
                    <LeadsDetailsDrawer
                      dataId={dataId}
                      closeDrawerHandler={() =>
                        dispatch(closeShowDetailsLeadsDrawer())
                      }
                    />
                  </ClickMenu>
                )}
              </HStack>

              {loading && (
                <div>
                  <Loading />
                </div>
              )}
              {!loading && filteredData.length === 0 && (
                <div className="flex items-center justify-center flex-col">
                  <FcDatabase color="red" size={80} />
                  <span className="mt-1 font-semibold text-2xl">No Data</span>
                </div>
              )}
              {!loading && filteredData.length > 0 && (
                <div>
                  <TableContainer maxHeight="600px" className="overflow-y-auto">
                    <Table
                      {...getTableProps()}
                      borderWidth="1px"
                      borderColor="#e0e0e0"
                    >
                      <Thead
                        position="sticky"
                        top={0}
                        zIndex={1}
                        bg="blue.400"
                        color="white"
                        boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
                        className="text-lg font-semibold"
                      >
                        {headerGroups.map((hg) => {
                          return (
                            <Tr {...hg.getHeaderGroupProps()}>
                              {hg.headers.map((column) => {
                                return (
                                  <Th
                                    bg="blue.400"
                                    className={`${
                                      column.id === "name"
                                        ? "sticky top-0 left-[-2px] "
                                        : ""
                                    }`}
                                    {...column.getHeaderProps(
                                      column.getSortByToggleProps()
                                    )}
                                    textTransform="capitalize"
                                    fontSize="15px"
                                    fontWeight="700"
                                    color="white"
                                  >
                                    <div className="flex items-center">
                                      {column.render("Header")}
                                      {column.isSorted && (
                                        <span>
                                          {column.isSortedDesc ? (
                                            <FaCaretDown />
                                          ) : (
                                            <FaCaretUp />
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  </Th>
                                );
                              })}
                              <Th
                                textTransform="capitalize"
                                fontSize="15px"
                                fontWeight="700"
                                color="white"
                                borderLeft="1px solid #e0e0e0"
                                borderRight="1px solid #e0e0e0"
                              >
                                Actions
                              </Th>
                            </Tr>
                          );
                        })}
                      </Thead>
                      <Tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                          prepareRow(row);

                          return (
                            <Tr
                              className="relative hover:bg-gray-100 cursor-pointer text-base lg:text-base"
                              {...row.getRowProps()}
                            >
                              {row.cells.map((cell) => {
                                return (
                                  <Td
                                    className={
                                      cell.column.id === "name"
                                        ? "sticky left-0 z-10 bg-gray-50 hover:bg-gray-100"
                                        : ""
                                    }
                                    fontWeight="600"
                                    padding="16px"
                                    {...cell.getCellProps()}
                                  >
                                    {cell.column.id !== "select" &&
                                      cell.column.id !== "leadtype" &&
                                      cell.column.id !== "status" &&
                                      cell.column.id !== "source" &&
                                      cell.column.id !== "assigned" &&
                                      cell.column.id !== "followup_date" &&
                                      cell.column.id !== "followup_reason" &&
                                      cell.column.id !== "created_on" &&
                                      cell.column.id !== "leadCategory" &&
                                      cell.render("Cell")}

                                    {cell.column.id === "select" && (
                                      <input
                                        value={cell.row.original._id}
                                        name="select"
                                        type="checkbox"
                                        onChange={(e) =>
                                          selectOneHandler(
                                            e,
                                            cell.row.original.phone
                                          )
                                        }
                                      />
                                    )}

                                    {/* Specific Column Renderings */}
                                    {cell.column.id === "leadtype" && (
                                      <span
                                        className={`text-sm rounded-md px-3 py-1 ${
                                          row.original.leadtype === "People"
                                            ? "bg-[#fff0f6] text-[#c41d7f]"
                                            : "bg-[#e6f4ff] text-[#0958d9]"
                                        }`}
                                      >
                                        {row.original.leadtype === "People"
                                          ? "Individual"
                                          : "Corporate"}
                                      </span>
                                    )}

                                    {/* Date & Reason Handling */}
                                    {cell.column.id === "created_on" &&
                                      row.original?.createdAt && (
                                        <span>
                                          {moment(
                                            row.original?.createdAt
                                          ).format("DD/MM/YYYY")}
                                        </span>
                                      )}
                                    {cell.column.id === "followup_date" &&
                                      row.original?.followup_date && (
                                        <span>
                                          {moment(
                                            row.original?.followup_date
                                          ).format("DD/MM/YYYY")}
                                        </span>
                                      )}
                                    {cell.column.id === "followup_reason" &&
                                      row.original?.followup_reason && (
                                        <span>
                                          {row.original?.followup_reason?.substr(
                                            0,
                                            10
                                          )}
                                          ...
                                        </span>
                                      )}

                                    {/* Status Rendering */}
                                    {cell.column.id === "status" && (
                                      <span
                                        className="text-sm rounded-md px-3 py-1"
                                        style={{
                                          backgroundColor:
                                            statusStyles[
                                              row.original.status.toLowerCase()
                                            ].bg,
                                          color:
                                            statusStyles[
                                              row.original.status.toLowerCase()
                                            ].text,
                                        }}
                                      >
                                        {row.original.status}
                                      </span>
                                    )}

                                    {/* Source Rendering */}
                                    {cell.column.id === "source" && (
                                      <span
                                        className="text-sm rounded-md px-3 py-1"
                                        style={{
                                          backgroundColor:
                                            sourceStyles[
                                              row.original.source.toLowerCase()
                                            ].bg,
                                          color:
                                            sourceStyles[
                                              row.original.source.toLowerCase()
                                            ].text,
                                        }}
                                      >
                                        {row.original.source}
                                      </span>
                                    )}

                                    {/* Assigned */}
                                    {cell.column.id === "assigned" && (
                                      <span>
                                        {row.original?.assigned ||
                                          "Not Assigned"}
                                      </span>
                                    )}

                                    {cell.column.id === "leadCategory" && (
                                        <Badge
                                          className="text-sm rounded-md px-3 py-1"
                                          colorScheme={getCategoryColor(
                                            row.original?.leadCategory
                                          )}
                                        >
                                          {row.original?.leadCategory}
                                          {console.log(row.original?.leadCategory)}
                                        </Badge>
                                      )}
                                  </Td>
                                );
                              })}

                              {/* Actions */}
                              <Td className="flex gap-x-2">
                                <MdOutlineVisibility
                                  className=" text-blue-500 hover:scale-110 transition-transform"
                                  size={20}
                                  onClick={() =>
                                    showDetailsHandler(row.original?._id)
                                  }
                                />
                                <MdEdit
                                  className=" text-yellow-500 hover:scale-110 transition-transform"
                                  size={20}
                                  onClick={() => editHandler(row.original?._id)}
                                />
                                <MdDeleteOutline
                                  className="text-red-500 hover:scale-110 transition-transform"
                                  size={20}
                                  onClick={() => {
                                    setLeadDeleteId(row.original?._id);
                                    confirmDeleteHandler();
                                  }}
                                />
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>

                  <div className="w-[max-content] m-auto mt-4 mb-6">
                    <button
                      className="text-sm mt-2 bg-[#1640d6] py-1 px-4 text-white border-[1px] border-[#1640d6] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
                      disabled={!canPreviousPage}
                      onClick={previousPage}
                    >
                      Prev
                    </button>
                    <span className="mx-3 text-sm md:text-lg lg:text-xl xl:text-base">
                      {pageIndex + 1} of {pageCount}
                    </span>
                    <button
                      className="text-sm mt-2 bg-[#1640d6] py-1 px-4 text-white border-[1px] border-[#1640d6] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
                      disabled={!canNextPage}
                      onClick={nextPage}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full mx-auto mt-3">
            <h1 className="text-lg md:text-xl font-semibold">Leads Summary</h1>
            {!loading && leadSummaryData.length === 0 && (
              <div>Nothing to show!</div>
            )}
            {!loading && leadSummaryData.length > 0 && (
              <div className="w-[50%] mx-auto mt-2">
                <PieChart
                  data={leadSummaryData}
                  labels={leadSummaryLabels}
                  ChartColors={leadSummaryBG}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Leads;
