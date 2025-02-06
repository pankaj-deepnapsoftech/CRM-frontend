import { Button, Textarea, useDisclosure } from "@chakra-ui/react";
import {
  MdOutlineRefresh,
  MdArrowBack,
  MdEdit,
  MdDeleteOutline,
  MdOutlineVisibility,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddLeadsDrawer,
  closeEditIndiamartLeadDrawer,
  closeEditLeadsDrawer,
  closeShowDetailsIndiamartLeadDrawer,
  closeShowDetailsLeadsDrawer,
  openAddLeadsDrawer,
  openEditIndiamartLeadDrawer,
  openEditLeadsDrawer,
  openShowDetailsIndiamartLeadDrawer,
  openShowDetailsLeadsDrawer,
} from "../../redux/reducers/misc";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../ui/Loading";
import { FcDatabase } from "react-icons/fc";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

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
import IndiamartLeadDetails from "../ui/Drawers/Details Drawers/IndiamartLeadDetails";
import IndiamartLeadEditDrawer from "../ui/Drawers/Edit Drawers/IndiamartLeadEditDrawer";
import { checkAccess } from "../../utils/checkAccess";
import { Link } from "react-router-dom";

const columns = [
  {
    Header: "Date",
    accessor: "QUERY_TIME",
  },
  {
    Header: "Name",
    accessor: "SENDER_NAME",
  },
  {
    Header: "Company",
    accessor: "SENDER_COMPANY",
  },
  {
    Header: "Mobile",
    accessor: "SENDER_MOBILE",
  },
  {
    Header: "Email",
    accessor: "SENDER_EMAIL",
  },
  {
    Header: "Mobile (Alt)",
    accessor: "SENDER_MOBILE_ALT",
  },
  {
    Header: "Email (Alt)",
    accessor: "SENDER_EMAIL_ALT",
  },
  {
    Header: "City",
    accessor: "SENDER_CITY",
  },
  {
    Header: "State",
    accessor: "SENDER_STATE",
  },
  {
    Header: "Product",
    accessor: "QUERY_PRODUCT_NAME",
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
    Header: "Followup Date",
    accessor: "followup_date",
  },
  {
    Header: "Followup Reason",
    accessor: "followup_reason",
  },
];

const IndiamartLeads = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataId, setDataId] = useState();
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");

  const dispatch = useDispatch();

  const [leadDeleteId, setLeadDeleteId] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

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
    state: { pageIndex },
    pageCount,
  } = useTable({ columns, data: filteredData }, useSortBy, usePagination);

  const {
    addLeadsDrawerIsOpened,
    editIndiamartLeadDrawerIsOpened,
    showDetailsIndiamartLeadIsOpened,
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
      const response = await fetch(baseURL + "indiamart/all", {
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

      setData(data.leads);
      setFilteredData(data.leads);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  const addLeadsHandler = () => {
    dispatch(openAddLeadsDrawer());
  };

  const confirmDeleteHandler = async () => {
    onOpen();
  };

  const deleteHandler = async () => {
    if (!leadDeleteId) {
      return;
    }

    try {
      const response = await fetch(baseURL + "indiamart/delete", {
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
    dispatch(openEditIndiamartLeadDrawer());
  };

  const showDetailsHandler = (id) => {
    setDataId(id);
    dispatch(openShowDetailsIndiamartLeadDrawer());
  };

  useEffect(() => {
    if (isAllowed) {
      fetchAllLeads();
    }
  }, []);

  useEffect(() => {
    if (searchKey.trim() !== "") {
      const searchedData = data.filter(
        (d) =>
          d?.SENDER_NAME?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.SENDER_COMPANY?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.SENDER_EMAIL?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.SENDER_EMAIL_ALT?.toLowerCase().includes(
            searchKey.toLowerCase()
          ) ||
          d?.status?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.assigned?.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.SENDER_MOBILE?.includes(searchKey) ||
          d?.SENDER_MOBILE_ALT?.includes(searchKey) ||
          d?.SENDER_CITY?.toLowerCase()?.includes(searchKey) ||
          d?.SENDER_STATE?.toLowerCase()?.includes(searchKey) ||
          d?.QUERY_PRODUCT_NAME?.toLowerCase()?.includes(searchKey) ||
          d?.followup_reason?.toLowerCase()?.includes(searchKey) ||
          (d?.followup_date &&
            new Date(d?.followup_date)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              .reverse()
              .join("")
              ?.includes(searchKey.replaceAll("-", ""))) ||
          (d?.QUERY_TIME &&
            new Date(d?.QUERY_TIME)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              .reverse()
              .join("")
              ?.includes(searchKey.replaceAll("-", "")))
      );
      setFilteredData(searchedData);
    } else {
      setFilteredData(data);
    }
  }, [searchKey]);

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
                    Delete Lead
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure, deleting a Lead will also delete its
                    corresponding Offers?
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme="red" onClick={deleteHandler} ml={3}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
          <div>
            <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
                Lead List
              </div>

              <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
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
                  onClick={fetchAllLeads}
                  leftIcon={<MdOutlineRefresh />}
                  color="#1640d6"
                  borderColor="#1640d6"
                  variant="outline"
                >
                  Refresh
                </Button>
              </div>
            </div>

            <div>
              {addLeadsDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeAddLeadsDrawer())
                  }
                >
                  <LeadsDrawer
                    fetchAllLeads={fetchAllLeads}
                    closeDrawerHandler={() => dispatch(closeAddLeadsDrawer())}
                  />
                </ClickMenu>
              )}

              {editIndiamartLeadDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeEditIndiamartLeadDrawer())
                  }
                >
                  <IndiamartLeadEditDrawer
                    dataId={dataId}
                    fetchAllLeads={fetchAllLeads}
                    closeDrawerHandler={() =>
                      dispatch(closeEditIndiamartLeadDrawer())
                    }
                  />
                </ClickMenu>
              )}

              {showDetailsIndiamartLeadIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeShowDetailsIndiamartLeadDrawer())
                  }
                >
                  <IndiamartLeadDetails
                    dataId={dataId}
                    closeDrawerHandler={() =>
                      dispatch(closeShowDetailsIndiamartLeadDrawer())
                    }
                  />
                </ClickMenu>
              )}

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
                  <TableContainer>
                    <Table variant="simple" {...getTableProps()}>
                      <Thead className="text-lg font-semibold">
                        {headerGroups.map((hg) => {
                          return (
                            <Tr {...hg.getHeaderGroupProps()}>
                              {hg.headers.map((column) => {
                                return (
                                  <Th
                                    className={
                                      column.id === "SENDER_NAME"
                                        ? "sticky top-0 left-[-2px] bg-[#f9fafc]"
                                        : ""
                                    }
                                    textTransform="capitalize"
                                    fontSize="15px"
                                    fontWeight="700"
                                    color="black"
                                    backgroundColor="#fafafa"
                                    borderLeft="1px solid #d7d7d7"
                                    borderRight="1px solid #d7d7d7"
                                    {...column.getHeaderProps(
                                      column.getSortByToggleProps()
                                    )}
                                  >
                                    <p className="flex">
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
                                    </p>
                                  </Th>
                                );
                              })}
                              <Th
                                textTransform="capitalize"
                                fontSize="15px"
                                fontWeight="700"
                                color="black"
                                backgroundColor="#fafafa"
                                borderLeft="1px solid #d7d7d7"
                                borderRight="1px solid #d7d7d7"
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
                              className="relative hover:bg-[#e4e4e4] hover:cursor-pointer text-base lg:text-base"
                              {...row.getRowProps()}
                            >
                              {row.cells.map((cell) => {
                                return (
                                  <Td
                                    className={
                                      cell.column.id === "SENDER_NAME"
                                        ? "sticky top-0 left-[-2px] bg-[#f9fafc]"
                                        : ""
                                    }
                                    fontWeight="600"
                                    {...cell.getCellProps()}
                                  >
                                    {cell.column.id !== "leadtype" &&
                                      cell.column.id !== "status" &&
                                      cell.column.id !== "assigned" &&
                                      cell.column.id !== "followup_date" &&
                                      cell.column.id !== "followup_reason" &&
                                      cell.column.id !== "QUERY_TIME" &&
                                      cell.render("Cell")}

                                    {cell.column.id === "leadtype" &&
                                      (cell.row.original.leadtype ===
                                      "People" ? (
                                        <span className="text-sm bg-[#fff0f6] text-[#c41d7f] rounded-md px-3 py-1">
                                          Individual
                                        </span>
                                      ) : (
                                        <span className="text-sm bg-[#e6f4ff] text-[#0958d9] rounded-md px-3 py-1">
                                          Corporate
                                        </span>
                                      ))}
                                    {cell.column.id === "QUERY_TIME" &&
                                      row.original?.QUERY_TIME && (
                                        <span>
                                          {moment(
                                            row.original?.QUERY_TIME
                                          ).format("DD-MM-YYYY hh:mm A")}
                                        </span>
                                      )}
                                    {cell.column.id === "followup_date" &&
                                      row.original?.followup_date && (
                                        <span>
                                          {moment(
                                            row.original?.followup_date
                                          ).format("DD-MM-YYYY")}
                                        </span>
                                      )}
                                    {cell.column.id === "followup_date" &&
                                      !row.original?.followup_date && (
                                        <span>Not Available</span>
                                      )}

                                    {cell.column.id === "followup_reason" &&
                                      row.original?.followup_reason && (
                                        <span>
                                          {row?.original?.followup_reason?.substr(
                                            0,
                                            10
                                          ) +
                                            (row?.original?.followup_reason
                                              ?.length > 10
                                              ? "..."
                                              : "")}
                                        </span>
                                      )}
                                    {cell.column.id === "followup_reason" &&
                                      !row.original?.followup_reason && (
                                        <span>Not Available</span>
                                      )}

                                    {cell.column.id === "status" && (
                                      <span
                                        className="text-sm rounded-md px-3 py-1"
                                        style={{
                                          backgroundColor: `${
                                            statusStyles[
                                              row.original.status.toLowerCase()
                                            ].bg
                                          }`,

                                          color: `${
                                            statusStyles[
                                              row.original.status.toLowerCase()
                                            ].text
                                          }`,
                                        }}
                                      >
                                        {row.original.status}
                                      </span>
                                    )}

                                    {cell.column.id === "assigned" && (
                                      <span>
                                        {row.original?.assigned
                                          ? row.original.assigned?.name
                                          : "Not Assigned"}
                                      </span>
                                    )}
                                  </Td>
                                );
                              })}
                              <Td className="flex gap-x-2">
                                <MdOutlineVisibility
                                  className="hover:scale-110"
                                  size={20}
                                  onClick={() =>
                                    showDetailsHandler(row.original?._id)
                                  }
                                />
                                <MdEdit
                                  className="hover:scale-110"
                                  size={20}
                                  onClick={() => editHandler(row.original?._id)}
                                />
                                <MdDeleteOutline
                                  className="hover:scale-110"
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

                  <div className="w-[max-content] m-auto my-7">
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
        </div>
      )}
    </>
  );
};

export default IndiamartLeads;
