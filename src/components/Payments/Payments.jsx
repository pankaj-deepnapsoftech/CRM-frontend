import { Button, Select, Textarea } from "@chakra-ui/react";
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
  closeEditPaymentsDrawer,
  closeShowDetailsPaymentsDrawer,
  openEditLeadsDrawer,
  openEditPaymentsDrawer,
  openShowDetailsLeadsDrawer,
  openShowDetailsPaymentsDrawer,
} from "../../redux/reducers/misc";
import { useEffect, useState } from "react";
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
import moment from "moment";
import PaymentDetailsDrawer from "../ui/Drawers/Details Drawers/PaymentDetailsDrawer";
import PaymentsEditDrawer from "../ui/Drawers/Edit Drawers/PaymentEditDrawer";
import { checkAccess } from "../../utils/checkAccess";
import { Link } from "react-router-dom";

const columns = [
  {
    Header: "Number",
    accessor: "number",
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
    Header: "Customer",
    accessor: "customer",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Date",
    accessor: "date",
  },
  {
    Header: "Payment Mode",
    accessor: "mode",
  },
];

const Payments = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataId, setDataId] = useState();
  const [loading, setLoading] = useState(true);
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
    state: { pageIndex, setPageSize },
    pageCount,
    pageSize,
  } = useTable({ columns, data: filteredData }, useSortBy, usePagination);

  const {
    addPaymentsDrawerIsOpened,
    editPaymentsDrawerIsOpened,
    showDetailsPaymentsDrawerIsOpened,
  } = useSelector((state) => state.misc);
  const { role, ...auth } = useSelector((state) => state.auth);
  const { isAllowed, msg } = checkAccess(auth, "payment");

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

  const fetchAllPayments = async () => {
    setSearchKey("");
    setData([]);
    setFilteredData([]);
    setLoading(true);
    try {
      const response = await fetch(baseURL + "payment/all-payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data?.message);
      }
      setData(data?.payments);
      setFilteredData(data?.payments);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err?.message);
    }
  };

  const deleteHandler = async (id) => {
    try {
      const response = await fetch(baseURL + "payment/delete-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          paymentId: id,
        }),
      });

      const data = await response.json();

      if (!data?.success) {
        throw new Error(data?.message);
      }

      fetchAllPayments();
      toast.success(data?.message);
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const editHandler = (id) => {
    setDataId(id);
    dispatch(openEditPaymentsDrawer());
  };

  const showDetailsHandler = (id) => {
    setDataId(id);
    dispatch(openShowDetailsPaymentsDrawer());
  };

  const downloadHandler = (id) => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    fetch(baseUrl + "payment/download-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies?.access_token}`,
      },
      body: JSON.stringify({
        paymentId: id,
      }),
    })
      .then((response) => {
        const filename = response?.headers
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

  useEffect(() => {
    if (isAllowed) {
      setLoading(false);
      fetchAllPayments();
    }
  }, []);

  useEffect(() => {
    if (searchKey.trim() !== "") {
      const searchedData = data.filter((d) => {
        return (
          (d?.invoice?.customer?.people
            ? (
                d?.invoice?.customer?.people?.firstname +
                " " +
                d?.invoice?.customer?.people?.lastname
              )
                .toLowerCase()
                .includes(searchKey.toLowerCase())
            : d?.invoice?.customer?.company?.companyname
                .toLowerCase()
                .includes(searchKey.toLowerCase())) ||
          d?.mode?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.amount
            .toString()
            .toLowerCase()
            .includes(searchKey.toLowerCase()) ||
          d?.creator?.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
          (d?.createdAt &&
            new Date(d?.createdAt)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              .reverse()
              .join("")
              ?.includes(searchKey.replaceAll("/", "")))
        );
      });
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
          <div>
            <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
                {/* <span className="mr-2">
                  <MdArrowBack />
                </span> */}
                Payment List
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
                  onClick={fetchAllPayments}
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
              onClick={addLeadsHandler}
              color="white"
              backgroundColor="#1640d6"
            >
              Add New Payment
            </Button> */}
              </div>
            </div>

            <div>
              {/* {addLeadsDrawerIsOpened && (
            <ClickMenu
              top={0}
              right={0}
              closeContextMenuHandler={() => dispatch(closeAddLeadsDrawer())}
            >
              <LeadsDrawer
                fetchAllLeads={fetchAllLeads}
                closeDrawerHandler={() => dispatch(closeAddLeadsDrawer())}
              />
            </ClickMenu>
          )}*/}

              {editPaymentsDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeEditPaymentsDrawer())
                  }
                >
                  <PaymentsEditDrawer
                    dataId={dataId}
                    fetchAllPayments={fetchAllPayments}
                    closeDrawerHandler={() =>
                      dispatch(closeEditPaymentsDrawer())
                    }
                  />
                </ClickMenu>
              )}

              {showDetailsPaymentsDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeShowDetailsPaymentsDrawer())
                  }
                >
                  <PaymentDetailsDrawer
                    dataId={dataId}
                    closeDrawerHandler={() =>
                      dispatch(closeShowDetailsPaymentsDrawer())
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
                    <Table
                      variant="simple"
                      {...getTableProps()}
                      className="shadow-lg rounded-lg"
                    >
                      <Thead className="bg-blue-400 text-white text-lg font-semibold">
                        {headerGroups.map((hg) => {
                          return (
                            <Tr {...hg.getHeaderGroupProps()}>
                              {hg?.headers?.map((column) => {
                                return (
                                  <Th
                                    className={`text-sm font-semibold text-left py-3 px-4
                    ${
                      column?.id === "customer"
                        ? "sticky top-0 left-[-2px] bg-blue-400"
                        : ""
                    }
                    border-b-2 border-gray-200`}
                                    {...column?.getHeaderProps(
                                      column?.getSortByToggleProps()
                                    )}
                                  >
                                    <div className="flex items-center text-white">
                                      {column?.render("Header")}
                                      {column?.isSorted && (
                                        <span className="ml-2">
                                          {column?.isSortedDesc ? (
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
                              <Th className="text-sm font-semibold text-left py-3 px-4 border-b-2 border-gray-200">
                                <p className="text-white">Actions</p>
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
                              className="relative hover:bg-gray-100 hover:cursor-pointer text-base transition-all duration-300 ease-in-out"
                              {...row?.getRowProps()}
                            >
                              {row?.cells?.map((cell) => {
                                return (
                                  <Td
                                    className={`py-3 px-4 ${
                                      cell?.column?.id === "customer"
                                        ? "sticky top-0 left-[-2px] "
                                        : ""
                                    }`}
                                    fontWeight="600"
                                    {...cell?.getCellProps()}
                                  >
                                    {cell?.column?.id !== "number" &&
                                      cell?.column?.id !== "createdAt" &&
                                      cell?.column?.id !== "amount" &&
                                      cell?.column?.id !== "customer" &&
                                      cell?.column?.id !== "creator" &&
                                      cell?.column?.id !== "created_on" &&
                                      cell.render("Cell")}

                                    {cell?.column?.id === "customer" && (
                                      <span>
                                        {row?.original?.invoice?.customer?.people
                                          ? row?.original?.invoice?.customer?.people
                                              .firstname +
                                            " " +
                                            (row?.original?.invoice?.customer
                                              ?.people.lastname || "")
                                          : row?.original?.invoice?.customer
                                              ?.company?.companyname}
                                      </span>
                                    )}

                                    {cell?.column?.id === "number" && (
                                      <span>{ind + 1}</span>
                                    )}
                                    {cell?.column?.id === "creator" && (
                                      <span className="text-blue-500">{row?.original?.creator?.name}</span>
                                    )}
                                    {cell?.column?.id === "created_on" && (
                                      <span>
                                        {moment(row?.original?.createdAt).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </span>
                                    )}
                                    {cell?.column?.id === "amount" && (
                                      <span>&#8377;{row?.original?.amount}</span>
                                    )}
                                    {cell?.column?.id === "date" && (
                                      <span>
                                        {moment(row?.original?.createdAt).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </span>
                                    )}
                                  </Td>
                                );
                              })}
                              <Td className="flex gap-x-3 py-3 px-4">
                                <MdDownload
                                  className="hover:scale-110 transition-all duration-300 ease-in-out text-green-500 hover:text-green-600"
                                  size={20}
                                  onClick={() =>
                                    downloadHandler(row?.original?._id)
                                  }
                                />
                                <MdOutlineVisibility
                                  className="hover:scale-110 transition-all duration-300 ease-in-out text-blue-500 hover:text-blue-600"
                                  size={20}
                                  onClick={() =>
                                    showDetailsHandler(row?.original?._id)
                                  }
                                />
                                <MdEdit
                                  className="hover:scale-110 transition-all duration-300 ease-in-out text-orange-500 hover:text-orange-600"
                                  size={20}
                                  onClick={() => editHandler(row?.original?._id)}
                                />
                                {/* Removed delete icon for now */}
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

export default Payments;
