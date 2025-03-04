import { Button, Select, useDisclosure } from "@chakra-ui/react";
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
  closeShowDetailsOffersDrawer,
  closeShowDetailsPeoplesDrawer,
  openAddOffersDrawer,
  openAddPeoplesDrawer,
  openEditOffersDrawer,
  openEditPeoplesDrawer,
  openShowDetailsOffersDrawer,
  openShowDetailsPeoplesDrawer,
} from "../../redux/reducers/misc";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
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
import { checkAccess } from "../../utils/checkAccess";
import { Link } from "react-router-dom";

const columns = [
  {
    Header: "S No.",
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
    Header: "Individual/Corporate",
    accessor: "lead",
  },
  {
    Header: "Date",
    accessor: "startdate",
  },
  {
    Header: "Sub Total",
    accessor: "subtotal",
  },
  {
    Header: "Total",
    accessor: "total",
  },
  {
    Header: "Status",
    accessor: "status",
  },
];

const Offers = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataId, setDataId] = useState();
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const dispatch = useDispatch();

  const [offerDeleteId, setOfferDeleteId] = useState();
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
    state: { pageIndex, pageSize },
    pageCount,
    setPageSize,
  } = useTable({ columns, data: filteredData }, useSortBy, usePagination);

  const {
    addOffersDrawerIsOpened,
    editOffersDrawerIsOpened,
    showDetailsOffersDrawerIsOpened,
  } = useSelector((state) => state.misc);
  const { role, ...auth } = useSelector((state) => state.auth);
  const { isAllowed, msg } = checkAccess(auth, "offer");

  const statusStyles = {
    draft: {
      bg: "#ffffff",
      text: "black",
    },
    pending: {
      bg: "#e6f4ff",
      text: "#0958d9",
    },
    sent: {
      bg: "#f9f0ff",
      text: "#531dab",
    },
    accepted: {
      bg: "#f6ffed",
      text: "#389e0d",
    },
    declined: {
      bg: "#fff1f0",
      text: "#cf1322",
    },
  };

  const addOffersHandler = () => {
    dispatch(openAddOffersDrawer());
  };

  const getAllOffers = async () => {
    setSearchKey("");
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "offer/all-offers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setData(data.offers);
      setFilteredData(data.offers);
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const confirmDeleteHandler = async () => {
    onOpen();
  };

  const deleteHandler = async () => {
    if (!offerDeleteId) {
      return;
    }
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseUrl + "offer/delete-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          offerId: offerDeleteId,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      getAllOffers();
      onClose();
      dispatch(closeAddOffersDrawer());
    } catch (err) {
      toast.error(err.message);
    }
  };

  const editHandler = async (id) => {
    setDataId(id);
    dispatch(openEditOffersDrawer());
  };

  const showDetailsHandler = async (id) => {
    setDataId(id);
    dispatch(openShowDetailsOffersDrawer());
  };

  const downloadHandler = (id) => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    fetch(baseUrl + "offer/download-offer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies?.access_token}`,
      },
      body: JSON.stringify({
        offerId: id,
      }),
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

  useEffect(() => {
    if (isAllowed) {
      getAllOffers();
    }
  }, []);

  useEffect(() => {
    if (searchKey.trim() !== "") {
      const searchedData = data.filter(
        (d) =>
          d?.creator?.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
          (d?.createdAt &&
            new Date(d?.createdAt)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              .reverse()
              .join("")
              ?.includes(searchKey.replaceAll("/", ""))) ||
          d?.startdate?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.expiredate?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.total.toString().includes(searchKey.toLowerCase()) ||
          d?.subtotal.toString().includes(searchKey.toLowerCase()) ||
          d?.status?.toLowerCase().includes(searchKey.toLowerCase()) ||
          (d?.lead.leadtype === "People"
            ? (d.lead.people.firstname + " " + d.lead.people.lastname)
                .toLowerCase()
                .includes(searchKey.toLowerCase())
            : d.lead.company.companyname
                .toLowerCase()
                .includes(searchKey.toLowerCase()))
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
                    Delete Offer
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
                Offer List
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
                  onClick={getAllOffers}
                  leftIcon={<MdOutlineRefresh />}
                  color="#1640d6"
                  borderColor="#1640d6"
                  variant="outline"
                >
                  Refresh
                </Button>
                <Button
                  fontSize={{ base: "14px", md: "14px" }}
                  paddingX={{ base: "10px", md: "12px" }}
                  paddingY={{ base: "0", md: "3px" }}
                  width={{ base: "-webkit-fill-available", md: 200 }}
                  onClick={addOffersHandler}
                  color="white"
                  backgroundColor="#1640d6"
                >
                  Add New Offer
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
          </div>

          <div>
            {addOffersDrawerIsOpened && (
              <ClickMenu
                top={0}
                right={0}
                closeContextMenuHandler={() => dispatch(closeAddOffersDrawer())}
              >
                <OffersDrawer
                  closeDrawerHandler={() => dispatch(closeAddOffersDrawer())}
                  getAllOffers={getAllOffers}
                />
              </ClickMenu>
            )}

            {editOffersDrawerIsOpened && (
              <ClickMenu
                top={0}
                right={0}
                closeContextMenuHandler={() =>
                  dispatch(closeEditOffersDrawer())
                }
              >
                <OffersEditDrawer
                  dataId={dataId}
                  closeDrawerHandler={() => {
                    dispatch(closeEditOffersDrawer());
                  }}
                  getAllOffers={getAllOffers}
                />
              </ClickMenu>
            )}

            {showDetailsOffersDrawerIsOpened && (
              <ClickMenu
                top={0}
                right={0}
                closeContextMenuHandler={() =>
                  dispatch(closeShowDetailsOffersDrawer())
                }
              >
                <OffersDetailsDrawer
                  dataId={dataId}
                  closeDrawerHandler={() =>
                    dispatch(closeShowDetailsOffersDrawer())
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
                  className="rounded-lg shadow-lg bg-white"
                >
                  <Table variant="simple" {...getTableProps()}>
                    <Thead className="bg-blue-400 text-white text-lg font-semibold">
                      {headerGroups.map((hg) => {
                        return (
                          <Tr {...hg.getHeaderGroupProps()}>
                            {hg.headers.map((column) => {
                              return (
                                <Th
                                  className={`${
                                    column.id === "lead"
                                      ? "sticky top-0 left-[-2px] bg-blue-400"
                                      : ""
                                  } text-sm text-white px-4 py-3 `}
                                  textTransform="capitalize"
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
                            <Th className="text-sm  px-4 py-3 ">
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
                            {...row.getRowProps()}
                          >
                            {row.cells.map((cell) => {
                              return (
                                <Td
                                  className={`${
                                    cell.column.id === "lead"
                                      ? "sticky top-0 left-[-2px]"
                                      : ""
                                  } font-semibold text-sm text-gray-700 px-4 py-3 border-l border-r border-[#e0e0e0]`}
                                  {...cell.getCellProps()}
                                >
                                  {cell.column.id === "lead" &&
                                    row.original?.lead && (
                                      <span>
                                        {row.original.lead?.leadtype ===
                                        "Company"
                                          ? row.original.lead?.company
                                              .companyname
                                          : row.original.lead?.people
                                              .firstname +
                                            " " +
                                            row.original.lead?.people.lastname}
                                      </span>
                                    )}
                                  {cell.column.id === "number" && (
                                    <span>{ind + 1}</span>
                                  )}
                                  {cell.column.id === "created_on" && (
                                    <span>
                                      {moment(row.original.createdAt).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </span>
                                  )}
                                  {cell.column.id === "creator" && (
                                    <span className="text-blue-500">{row.original.creator.name}</span>
                                  )}
                                  {cell.column.id === "total" && (
                                    <span>&#8377;{row.original.total}</span>
                                  )}
                                  {cell.column.id === "subtotal" && (
                                    <span>&#8377;{row.original.subtotal}</span>
                                  )}
                                  {cell.column.id === "startdate" && (
                                    <span>
                                      {moment(row.original.startdate).format(
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
                                      {row.original.status}
                                    </span>
                                  )}
                                </Td>
                              );
                            })}
                            <Td className="flex gap-x-3 justify-center items-center py-2">
                              <MdDownload
                                className="text-blue-600  hover:scale-110 transition-all duration-200"
                                size={20}
                                onClick={() =>
                                  downloadHandler(row.original?._id)
                                }
                              />
                              <MdOutlineVisibility
                                className="text-green-600  hover:scale-110 transition-all duration-200"
                                size={20}
                                onClick={() =>
                                  showDetailsHandler(row.original?._id)
                                }
                              />
                              <MdEdit
                                className="text-yellow-600  hover:scale-110 transition-all duration-200"
                                size={20}
                                onClick={() => editHandler(row.original?._id)}
                              />
                              <MdDeleteOutline
                                className="text-red-600  hover:scale-110 transition-all duration-200"
                                size={20}
                                onClick={() => {
                                  setOfferDeleteId(row.original?._id);
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
      )}
    </>
  );
};

export default Offers;
