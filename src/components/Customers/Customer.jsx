import { Button, Select, useDisclosure } from "@chakra-ui/react";
import {
  MdOutlineRefresh,
  MdArrowBack,
  MdEdit,
  MdDeleteOutline,
  MdOutlineVisibility,
} from "react-icons/md";
import Loading from "../ui/Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddCustomersDrawer,
  closeEditCustomersDrawer,
  closeShowDetailsCustomersDrawer,
  openAddCustomersDrawer,
  openEditCustomersDrawer,
  openShowDetailsCustomersDrawer,
} from "../../redux/reducers/misc";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { FcDatabase } from "react-icons/fc";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import moment from "moment";

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
import CustomersEditDrawer from "../ui/Drawers/Edit Drawers/CustomersEditDrawer";
import CustomersDetailsDrawer from "../ui/Drawers/Details Drawers/CustomersDetailsDrawer";
import CustomersDrawer from "../ui/Drawers/Add Drawers/CustomersDrawer";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import { checkAccess } from "../../utils/checkAccess";
import { Link } from "react-router-dom";

const columns = [
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
    accessor: "customertype",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Phone",
    accessor: "phone",
  },
  {
    Header: "Email",
    accessor: "email",
  },
];

const Customer = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState([{}, {}]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataId, setDataId] = useState();
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const dispatch = useDispatch();

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
  } = useTable({ columns, data: filteredData }, useSortBy, usePagination);

  const {
    addCustomersDrawerIsOpened,
    editCustomersDrawerIsOpened,
    showDetailsCustomersDrawerIsOpened,
  } = useSelector((state) => state.misc);

  const { role, ...auth } = useSelector((state) => state.auth);
  const { isAllowed, msg } = checkAccess(auth, "customer");

  const [customerDeleteId, setCustomerDeleteId] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const statusStyles = {
    "deal done": {
      bg: "rgb(65, 105, 225)",
      text: "#fff",
    },
    "proforma invoice sent": {
      bg: "rgb(135, 206, 235)",
      text: "#fff",
    },
    "invoice sent": {
      bg: "rgb(255, 127, 80)",
      text: "#fff",
    },
    "payment received": {
      bg: "rgb(0, 100, 0)",
      text: "#fff",
    },
  };

  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const fetchAllCustomers = async () => {
    setSearchKey("");
    setLoading(true);
    setData([]);
    setFilteredData([]);
    setLoading(true);
    try {
      const response = await fetch(baseURL + "customer/all-customers", {
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

      setData(data.customers);
      setFilteredData(data.customers);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  console.log(data);

  const addCustomersHandler = () => {
    dispatch(openAddCustomersDrawer());
  };

  const editHandler = (id) => {
    setDataId(id);
    dispatch(openEditCustomersDrawer());
  };

  const showDetailsHandler = (id) => {
    setDataId(id);
    dispatch(openShowDetailsCustomersDrawer());
  };

  const confirmDeleteHandler = async () => {
    onOpen();
  };

  const deleteHandler = async () => {
    if (!customerDeleteId) {
      return;
    }

    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseURL + "customer/delete-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          customerId: customerDeleteId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      fetchAllCustomers();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (isAllowed) {
      fetchAllCustomers();
    }
  }, []);

  useEffect(() => {
    if (searchKey.trim() !== "") {
      const searchedData = data.filter(
        (d) =>
          d?.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.creator?.toLowerCase().includes(searchKey.toLowerCase()) ||
          (d?.createdAt &&
            new Date(d?.createdAt)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              .reverse()
              .join("")
              ?.includes(searchKey.replaceAll("/", ""))) ||
          (d?.customertype === "People"
            ? "individual".includes(searchKey.toLowerCase())
            : "corporate".includes(searchKey.toLowerCase())) ||
          d?.status.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.phone?.includes(searchKey) ||
          d?.email?.toLowerCase().includes(searchKey.toLowerCase())
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
                    Delete Customer
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure, deleting a Customer will also delete its
                    corresponding Invoices, Proforma Invoices, Leads, Offers?
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
                {/* <span className="mr-2">
                  <MdArrowBack />
                </span> */}
                Customer List
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
                  onClick={fetchAllCustomers}
                  leftIcon={<MdOutlineRefresh />}
                  color="#1640d6"
                  borderColor="#1640d6"
                  variant="outline"
                >
                  Refresh
                </Button>
                <Select
                  onChange={(e) => setPageSize(e.target.value)}
                  width="80px"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={100000}>All</option>
                </Select>
                {/* <Button
              onClick={addCustomersHandler}
              color="white"
              backgroundColor="#1640d6"
            >
              Add New Customer
            </Button> */}
              </div>
            </div>

            <div>
              {addCustomersDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeAddCustomersDrawer())
                  }
                >
                  <CustomersDrawer
                    closeDrawerHandler={() =>
                      dispatch(closeAddCustomersDrawer())
                    }
                    fetchAllCustomers={fetchAllCustomers}
                  />
                </ClickMenu>
              )}

              {editCustomersDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeEditCustomersDrawer())
                  }
                >
                  <CustomersEditDrawer
                    dataId={dataId}
                    closeDrawerHandler={() =>
                      dispatch(closeEditCustomersDrawer())
                    }
                    fetchAllCustomers={fetchAllCustomers}
                  />
                </ClickMenu>
              )}

              {showDetailsCustomersDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeShowDetailsCustomersDrawer())
                  }
                >
                  <CustomersDetailsDrawer
                    dataId={dataId}
                    closeDrawerHandler={() =>
                      dispatch(closeShowDetailsCustomersDrawer())
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
                  <TableContainer maxHeight="600px" overflowY="auto">
                    <Table variant="striped" {...getTableProps()}>
                      <Thead className="bg-blue-400 text-white text-lg font-semibold">
                        {headerGroups.map((hg) => {
                          return (
                            <Tr
                              {...hg.getHeaderGroupProps()}
                              className="border-b-2 border-gray-300"
                            >
                              {hg.headers.map((column) => {
                                return (
                                  <Th
                                    className={`
                    ${
                      column.id === "name"
                        ? "sticky top-0 left-[-2px]"
                        : ""
                    }
                    text-transform: capitalize
                    font-size: 15px
                    font-weight: 700
                    text-center
                    border-r border-gray-300
                    py-3
                    px-4
                    hover:bg-blue-200 cursor-pointer
                  `}
                                    {...column.getHeaderProps(
                                      column.getSortByToggleProps()
                                    )}
                                  >
                                    <div className="flex items-center justify-center text-white ">
                                      {column.render("Header")}
                                      {column.isSorted && (
                                        <span className="ml-1 text-xs">
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
                              <Th className="text-center py-3 px-4 bg-blue-400 text-white">
                                <p className="text-white">Actions</p>
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
                              className="relative hover:bg-gray-100 text-base text-gray-700 transition duration-300 ease-in-out"
                              {...row.getRowProps()}
                            >
                              {row.cells.map((cell) => {
                                return (
                                  <Td
                                    className={`
                    ${
                      cell.column.id === "name"
                        ? "sticky top-0 left-[-2px] bg-[#f9fafc]"
                        : ""
                    }
                    text-center
                    border-b border-gray-200
                    p-3
                  `}
                                    {...cell.getCellProps()}
                                  >
                                    {cell.column.id !== "customertype" &&
                                      cell.column.id !== "status" &&
                                      cell.column.id !== "created_on" &&
                                      cell.render("Cell")}
                                    {cell.column.id === "customertype" && (
                                      <span
                                        className={`text-sm rounded-md px-3 py-1 ${
                                          cell.row.original.customertype ===
                                          "People"
                                            ? "bg-[#fff0f6] text-[#c41d7f]"
                                            : "bg-[#e6f4ff] text-[#0958d9]"
                                        }`}
                                      >
                                        {cell.row.original.customertype ===
                                        "People"
                                          ? "Individual"
                                          : "Corporate"}
                                      </span>
                                    )}
                                    {cell.column.id === "created_on" &&
                                      row.original?.createdAt && (
                                        <span>
                                          {moment(
                                            row.original?.createdAt
                                          ).format("DD/MM/YYYY")}
                                        </span>
                                      )}
                                    {cell.column.id === "status" && (
                                      <span
                                        className="text-sm rounded-md px-3 py-1"
                                        style={{
                                          backgroundColor: `${
                                            statusStyles[
                                              row.original.status?.toLowerCase()
                                            ]?.bg
                                          }`,
                                          color: `${
                                            statusStyles[
                                              row.original.status?.toLowerCase()
                                            ]?.text
                                          }`,
                                        }}
                                      >
                                        {row.original.status}
                                      </span>
                                    )}
                                  </Td>
                                );
                              })}

                              <Td className="flex justify-center items-center gap-x-3 p-3">
                                <MdOutlineVisibility
                                  className="hover:text-blue-600 text-blue-500 hover:scale-110 transition-transform duration-200"
                                  size={20}
                                  onClick={() =>
                                    showDetailsHandler(row.original?._id)
                                  }
                                />
                                <MdEdit
                                  className="hover:text-yellow-600 text-yellow-500 hover:scale-110 transition-transform duration-200"
                                  size={20}
                                  onClick={() => editHandler(row.original?._id)}
                                />
                                <MdDeleteOutline
                                  className="hover:text-red-600 text-red-500 hover:scale-110 transition-transform duration-200"
                                  size={20}
                                  onClick={() => {
                                    setCustomerDeleteId(row.original?._id);
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

export default Customer;
