import { Button, useDisclosure } from "@chakra-ui/react";
import {
  MdOutlineRefresh,
  MdArrowBack,
  MdEdit,
  MdDeleteOutline,
  MdOutlineVisibility,
  MdDownload,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddOffersDrawer,
  closeAddPeoplesDrawer,
  closeEditOffersDrawer,
  closeEditPeoplesDrawer,
  closeEditSupportDrawer,
  closeShowDetailsOffersDrawer,
  closeShowDetailsPeoplesDrawer,
  closeShowDetailsSupportDrawer,
  openAddOffersDrawer,
  openAddPeoplesDrawer,
  openEditOffersDrawer,
  openEditPeoplesDrawer,
  openEditSupportDrawer,
  openShowDetailsOffersDrawer,
  openShowDetailsPeoplesDrawer,
  openShowDetailsSupportDrawer,
} from "../../redux/reducers/misc";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Cookies, useCookies } from "react-cookie";
import Loading from "../ui/Loading";
import moment from "moment";
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
import PeoplesEditDrawer from "../ui/Drawers/Edit Drawers/PeoplesEditDrawer";
import PeoplesDetailsDrawer from "../ui/Drawers/Details Drawers/PeoplesDetailsDrawer";
import PeoplesDrawer from "../ui/Drawers/Add Drawers/PeoplesDrawer";
import { FcDatabase } from "react-icons/fc";
import OffersDrawer from "../ui/Drawers/Add Drawers/OffersDrawer";
import OffersEditDrawer from "../ui/Drawers/Edit Drawers/OffersEditDrawer";
import OffersDetailsDrawer from "../ui/Drawers/Details Drawers/OffersDetailsDrawer";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import SupportDetailsDrawer from "../ui/Drawers/Details Drawers/SupportDetailsDrawer";
import SupportEditDrawer from "../ui/Drawers/Edit Drawers/SupportEditDrawer";
import { checkAccess } from "../../utils/checkAccess";
import { Link } from "react-router-dom";

const columns = [
  {
    Header: "Created On",
    accessor: "createdAt",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Mobile",
    accessor: "mobile",
  },
  {
    Header: "Assigned To",
    accessor: "assigned",
  },
  {
    Header: "Purpose",
    accessor: "purpose",
  },
  {
    Header: "Status",
    accessor: "status",
  },
];

const AssignedSupport = () => {
  const { role, ...auth } = useSelector((state) => state.auth);
  const { isAllowed, msg } = checkAccess(auth, "support");
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataId, setDataId] = useState();

  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  const [cookies] = useCookies();

  const dispatch = useDispatch();

  const [supportDeleteId, setSupportDeleteId] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const statusStyles = {
    assigned: {
      bg: "#ffffff",
      text: "black",
    },
    new: {
      bg: "#e6f4ff",
      text: "#0958d9",
    },
    "under process": {
      bg: "#f9f0ff",
      text: "#531dab",
    },
    accepted: {
      bg: "#e9ff93",
      text: "#657a13",
    },
    rejected: {
      bg: "#fff1f0",
      text: "#cf1322",
    },
    completed: {
      bg: "#f6ffed",
      text: "#389e0d",
    },
  };

  const purposeStyles = {
    "gym setup": {
      bg: "#ffffff",
      text: "black",
    },
    service: {
      bg: "#f9f0ff",
      text: "#531dab",
    },
    complaint: {
      bg: "#fff1f0",
      text: "#cf1322",
    },
  };

  const { editSupportDrawerIsOpened, showDetailsSupportDrawerIsOpened } =
    useSelector((state) => state.misc);

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

  const fetchAllSupport = async () => {
    setSearchKey("");
    try {
      const response = await fetch(
        baseUrl + `support/get-all-assigned-support`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setData(data.support);
      setFilteredData(data.support);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmDeleteHandler = async () => {
    onOpen();
  };

  const deleteHandler = async () => {
    if (!supportDeleteId) {
      return;
    }
    try {
      const response = await fetch(baseUrl + "support/delete-support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          supportId: supportDeleteId,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      fetchAllSupport();
      onClose();
      // dispatch(closeAddOffersDrawer());
    } catch (err) {
      toast.error(err.message);
    }
  };

  const editHandler = (id) => {
    setDataId(id);
    dispatch(openEditSupportDrawer());
  };

  const showDetailsHandler = async (id) => {
    setDataId(id);
    dispatch(openShowDetailsSupportDrawer());
  };

  useEffect(() => {
    if (isAllowed) {
      fetchAllSupport();
    }
  }, []);

  useEffect(() => {
    if (searchKey.trim() !== "") {
      const searchedData = data.filter(
        (d) =>
          (d?.createdAt &&
            new Date(d?.createdAt)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              .reverse()
              .join("")
              ?.includes(searchKey.replaceAll("/", ""))) ||
          d?.name?.toLowerCase().toString().includes(searchKey.toLowerCase()) ||
          d?.mobile.toString().includes(searchKey.toLowerCase()) ||
          d?.status?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.purpose?.toLowerCase().includes(searchKey.toLowerCase()) ||
          (d?.assigned &&
            d.assigned.name.toLowerCase().includes(searchKey.toLowerCase()))
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
          {auth?.isTrial && !auth?.isTrialEnded && (
            <div className="-mt-1">
              <Link to="/pricing">
                <button className="text-base border border-[#d61616] rounded-md px-5 py-1 bg-[#d61616] text-white font-medium hover:bg-white hover:text-[#d61616] ease-in-out duration-300">
                  {auth?.account?.trial_started || auth?.isSubscriptionEnded
                    ? "Upgrade"
                    : "Activate Free Trial"}
                </button>
              </Link>
            </div>
          )}
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
                    Delete Support
                  </AlertDialogHeader>

                  <AlertDialogBody>Are you sure?</AlertDialogBody>

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
                {/* <span className="mr-2">
                  <MdArrowBack />
                </span> */}
                Assigned Support
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
                  onClick={fetchAllSupport}
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
              {showDetailsSupportDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeShowDetailsSupportDrawer())
                  }
                >
                  <SupportDetailsDrawer
                    dataId={dataId}
                    closeDrawerHandler={() =>
                      dispatch(closeShowDetailsSupportDrawer())
                    }
                  />
                </ClickMenu>
              )}
              {editSupportDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeEditSupportDrawer())
                  }
                >
                  <SupportEditDrawer
                    dataId={dataId}
                    closeDrawerHandler={() =>
                      dispatch(closeEditSupportDrawer())
                    }
                    fetchAllSupport={fetchAllSupport}
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
                                      column.id === "name"
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
                        {page.map((row, ind) => {
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
                                      cell.column.id === "name"
                                        ? "sticky top-0 left-[-2px] bg-[#f9fafc]"
                                        : ""
                                    }
                                    fontWeight="600"
                                    {...cell.getCellProps()}
                                  >
                                    {cell.column.id !== "status" &&
                                      cell.column.id !== "createdAt" &&
                                      cell.column.id !== "purpose" &&
                                      cell.column.id !== "assigned" &&
                                      cell.render("Cell")}

                                    {cell.column.id === "createdAt" && (
                                      <span>
                                        {moment(row.original.createdAt).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </span>
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
                                        {row.original.status
                                          .substr(0, 1)
                                          .toUpperCase() +
                                          row.original.status.substr(1)}
                                      </span>
                                    )}

                                    {cell.column.id === "purpose" && (
                                      <span
                                        className={`text-sm rounded-md px-3 py-1`}
                                        style={{
                                          backgroundColor: `${
                                            purposeStyles[
                                              row.original.purpose.toLowerCase()
                                            ].bg
                                          }`,

                                          color: `${
                                            purposeStyles[
                                              row.original.purpose.toLowerCase()
                                            ].text
                                          }`,
                                        }}
                                      >
                                        {row.original.purpose
                                          .substr(0, 1)
                                          .toUpperCase() +
                                          row.original.purpose.substr(1)}
                                      </span>
                                    )}

                                    {cell.column.id === "assigned" && (
                                      <span>
                                        {row.original?.assigned
                                          ? row.original.assigned.name
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
                                    setSupportDeleteId(row.original?._id);
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
        // </div>
      )}
    </>
  );
};

export default AssignedSupport;
