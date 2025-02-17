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
import { json, Link, useLocation } from "react-router-dom";
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

const DataBank = () => {
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
  const [dataInfo, setDataInfo] = useState([]);
  console.log(dataInfo);
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

      // Filter leads where dataBank is true
      const filteredLeads = data.leads.filter((lead) => lead.dataBank === true);
      console.log(filteredLeads);
      setData(filteredLeads);
      setFilteredData(filteredLeads);
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
      console.log(data.leads);

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
          <></>
          <div>
            <div className="flex flex-col items-start justify-start gap-y-1 md:justify-between mb-4  pb-2 z-10">
              <div className="w-full flex text-lg lg:text-xl justify-between font-semibold lg:items-center gap-y-1 mb-2">
                {/* <span className="mr-2">
                    <MdArrowBack />
                  </span> */}
                <div>Data Bank List</div>
              </div>

              <div className="mt-2 md:mt-0 flex flex-wrap justify-end gap-y-2 gap-x-3 w-full">
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
                                      </Badge>
                                    )}
                                  </Td>
                                );
                              })}
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

export default DataBank;
