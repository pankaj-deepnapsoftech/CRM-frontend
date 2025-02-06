import { Button, Select, useDisclosure } from "@chakra-ui/react";
import {
  MdOutlineRefresh,
  MdArrowBack,
  MdEdit,
  MdDeleteOutline,
  MdOutlineVisibility,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddExpensesDrawer,
  closeEditExpensesDrawer,
  closeShowDetailsExpensesCategoryDrawer,
  closeShowDetailsExpensesDrawer,
  openAddExpensesDrawer,
  openEditExpensesDrawer,
  openShowDetailsExpensesDrawer,
} from "../../redux/reducers/misc";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../ui/Loading";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import ClickMenu from "../ui/ClickMenu";

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
import ExpenseDetailsDrawer from "../ui/Drawers/Details Drawers/ExpenseDetailsDrawer";
import ExpenseEditDrawer from "../ui/Drawers/Edit Drawers/ExpenseEditDrawer";
import ExpensesDrawer from "../ui/Drawers/Add Drawers/ExpensesDrawer";
import { FcDatabase } from "react-icons/fc";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import moment from "moment";
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
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Expense Category",
    accessor: "category",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Description",
    accessor: "description",
  },
  {
    Header: "Ref",
    accessor: "ref",
  },
];

const Expenses = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataId, setDataId] = useState();
  const [searchKey, setSearchKey] = useState("");

  const dispatch = useDispatch();
  const [expenseDeleteId, setExpenseDeleteId] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const { role, ...auth } = useSelector((state) => state.auth);
  const { isAllowed, msg } = checkAccess(auth, "expense");

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
    addExpensesDrawerIsOpened,
    editExpensesDrawerIsOpened,
    showDetailsExpensesDrawerIsOpened,
  } = useSelector((state) => state.misc);

  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const fetchAllExpenses = async () => {
    setSearchKey("");
    setData([]);
    setFilteredData([]);
    setLoading(true);
    try {
      const response = await fetch(baseURL + "expense/all-expenses", {
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

      setData(data.expenses);
      setFilteredData(data.expenses);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  const addExpensesHandler = () => {
    dispatch(openAddExpensesDrawer());
  };

  const confirmDeleteHandler = async () => {
    onOpen();
  };

  const deleteHandler = async () => {
    if (!expenseDeleteId) {
      return;
    }

    try {
      const response = await fetch(baseURL + "expense/delete-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          expenseId: expenseDeleteId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      onClose();
      fetchAllExpenses();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const showDetailsHandler = (id) => {
    setDataId(id);
    dispatch(openShowDetailsExpensesDrawer());
  };

  const editHandler = async (id) => {
    setDataId(id);
    dispatch(openEditExpensesDrawer());
  };

  useEffect(() => {
    if (isAllowed) {
      fetchAllExpenses();
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
          d?.category?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.description?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.ref?.includes(searchKey) ||
          d?.price?.toLowerCase().includes(searchKey.toLowerCase())
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
                    Delete Expense
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
            <div className="flex flex-col items-start justify-start lg:flex-row gap-y-1 md:justify-between lg:items-center mb-8">
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
                {/* <span className="mr-2">
                  <MdArrowBack />
                </span> */}
                Expense List
              </div>

              <div className="mt-2 lg:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full lg:w-fit">
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
                  onClick={fetchAllExpenses}
                  leftIcon={<MdOutlineRefresh />}
                  color="#1640d6"
                  borderColor="#1640d6"
                  variant="outline"
                >
                  Refresh
                </Button>
                <Button
                  fontSize={{ base: "14px", md: "14px", lg: "16px" }}
                  paddingX={{ base: "10px", md: "12px", lg: "16px" }}
                  paddingY={{ base: "0", md: "4px" }}
                  width={{ base: "-webkit-fill-available", md: 200 }}
                  onClick={addExpensesHandler}
                  color="white"
                  backgroundColor="#1640d6"
                >
                  Add New Expense
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
              </div>
            </div>

            <div>
              {addExpensesDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeAddExpensesDrawer())
                  }
                >
                  <ExpensesDrawer
                    closeDrawerHandler={() =>
                      dispatch(closeAddExpensesDrawer())
                    }
                    fetchAllExpenses={fetchAllExpenses}
                  />
                </ClickMenu>
              )}

              {editExpensesDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeEditExpensesDrawer())
                  }
                >
                  ;
                  <ExpenseEditDrawer
                    dataId={dataId}
                    closeDrawerHandler={() =>
                      dispatch(closeEditExpensesDrawer())
                    }
                    fetchAllExpenses={fetchAllExpenses}
                  />
                </ClickMenu>
              )}

              {showDetailsExpensesDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeShowDetailsExpensesDrawer())
                  }
                >
                  <ExpenseDetailsDrawer
                    dataId={dataId}
                    closeDrawerHandler={() =>
                      dispatch(closeShowDetailsExpensesDrawer())
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
                  <TableContainer
                    maxHeight="600px"
                    overflowY="auto"
                    className="rounded-lg shadow-md bg-white"
                  >
                    <Table variant="simple" {...getTableProps()}>
                      <Thead className="bg-blue-400 text-lg font-semibold text-gray-800">
                        {headerGroups.map((hg) => {
                          return (
                            <Tr {...hg.getHeaderGroupProps()}>
                              {hg.headers.map((column) => {
                                return (
                                  <Th
                                    className={`${
                                      column.id === "name"
                                        ? "sticky top-0 left-[-2px] bg-blue-400"
                                        : "bg-blue-400"
                                    } text-sm text-gray-700 px-4 py-3 border-l border-r border-[#e0e0e0] transition duration-300 ease-in-out`}
                                    fontSize="15px"
                                    fontWeight="700"
                                    {...column.getHeaderProps(
                                      column.getSortByToggleProps()
                                    )}
                                  >
                                    <div className="flex items-center justify-between text-white">
                                      <span>{column.render("Header")}</span>
                                      {column.isSorted && (
                                        <span className="ml-2">
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
                                className="bg-blue-400"
                              >
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
                              className="relative hover:bg-gray-200 hover:cursor-pointer text-base lg:text-base transition-all duration-300 ease-in-out"
                              {...row.getRowProps()}
                            >
                              {row.cells.map((cell) => {
                                return (
                                  <Td
                                    className={`${
                                      cell.column.id === "name"
                                        ? "sticky top-0 left-[-2px] bg-[#f9fafc]"
                                        : ""
                                    } font-semibold text-sm text-gray-700 px-4 py-3 border-l border-r border-[#e0e0e0] transition duration-300 ease-in-out`}
                                    {...cell.getCellProps()}
                                  >
                                    {cell.column.id !== "price" &&
                                      cell.column.id !== "description" &&
                                      cell.column.id !== "created_on" &&
                                      cell.render("Cell")}
                                    {cell.column.id === "created_on" && (
                                      <span className="text-gray-600">
                                        {moment(row.original.createdAt).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </span>
                                    )}
                                    {cell.column.id === "price" && (
                                      <span className="text-green-600 font-bold">
                                        ₹{row.original.price}
                                      </span>
                                    )}
                                    {cell.column.id === "description" && (
                                      <span className="text-gray-600">
                                        {row.original.description.substr(0, 50)}
                                        {row.original.description.length > 50 &&
                                          "..."}
                                      </span>
                                    )}
                                  </Td>
                                );
                              })}
                              <Td className="flex gap-x-2 justify-center items-center py-2">
                                <MdOutlineVisibility
                                  className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200"
                                  size={20}
                                  onClick={() =>
                                    showDetailsHandler(row.original?._id)
                                  }
                                />
                                <MdEdit
                                  className="text-yellow-600 hover:text-yellow-800 hover:scale-110 transition-all duration-200"
                                  size={20}
                                  onClick={() => editHandler(row.original?._id)}
                                />
                                <MdDeleteOutline
                                  className="text-red-600 hover:text-red-800 hover:scale-110 transition-all duration-200"
                                  size={20}
                                  onClick={() => {
                                    setExpenseDeleteId(row.original?._id);
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

export default Expenses;
