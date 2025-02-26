import { Button, Link, Select, useDisclosure } from "@chakra-ui/react";
import {
  MdOutlineRefresh,
  MdArrowBack,
  MdEdit,
  MdDeleteOutline,
  MdOutlineVisibility,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddPeoplesDrawer,
  closeEditPeoplesDrawer,
  closeShowDetailsPeoplesDrawer,
  openAddPeoplesDrawer,
  openEditPeoplesDrawer,
  openShowDetailsPeoplesDrawer,
} from "../../redux/reducers/misc";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../ui/Loading";
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
import PeoplesEditDrawer from "../ui/Drawers/Edit Drawers/PeoplesEditDrawer";
import PeoplesDetailsDrawer from "../ui/Drawers/Details Drawers/PeoplesDetailsDrawer";
import PeoplesDrawer from "../ui/Drawers/Add Drawers/PeoplesDrawer";
import { FcDatabase } from "react-icons/fc";
import { Input } from "@chakra-ui/react";

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
    Header: "First Name",
    accessor: "firstname",
  },
  {
    Header: "Last Name",
    accessor: "lastname",
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
    Header: "Verification",
    accessor: "verified",
    Cell: ({ row }) => {
      const { isOpen, onOpen, onClose } = useDisclosure();
      const cancelRef = useRef();
      const [cookies] = useCookies();
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const personId = row.original._id; // Get the person's ID
      const [otp, setOtp] = useState(""); // Store OTP input
      const [isVerified, setIsVerified] = useState(row.original.verify); // Track verification status

      // Resend OTP
      const reSendVerificationOtp = async () => {
        try {


          const response = await fetch(
            `${baseURL}people/resend-otp/${personId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${cookies?.access_token}`,
              },
            }
          );

          const otpResponse = await response.json();


          // Show toast for resend OTP
          toast.success("OTP has been resent successfully!");
        } catch (error) {

          toast.error("Failed to resend OTP. Please try again.");
        }
      };

      // Verify OTP
      const verifyOtp = async () => {
        try {
          if (!personId || !otp) {
            toast.warning("Please enter OTP before verifying.");
            return;
          }

          const numericOtp = Number(otp); // Convert OTP to a number

          if (isNaN(numericOtp)) {
            toast.warning("Invalid OTP format. Please enter a valid number.");
            return;
          }

          const response = await fetch(
            `${baseURL}people/verify-people/${personId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${cookies?.access_token}`,
              },
              body: JSON.stringify({ otp: numericOtp }), // Send OTP as number
            }
          );

          const verifyResponse = await response.json();

          if (verifyResponse.success) {
            toast.success("OTP verified successfully!"); // Show success toast
            setIsVerified(true); // Update UI state
            onClose(); // Close modal
          } else {
            toast.error(
              verifyResponse.message || "Invalid OTP. Please try again."
            ); // Show error toast
          }
        } catch (error) {
          toast.error("Something went wrong. Please try again."); // Show error toast
        }
      };

      return (
        <>
          {isVerified ? (
            <span className="px-2 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
              Verified
            </span>
          ) : (
            <>
              <Button size="sm" colorScheme="blue" onClick={onOpen}>
                Verify
              </Button>

              {/* Verification Popup */}
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent className="p-6 rounded-lg shadow-lg">
                    <AlertDialogHeader className="text-xl font-semibold text-center">
                      Confirm Verification
                    </AlertDialogHeader>

                    <AlertDialogBody className="text-center space-y-4">
                      <p className="text-gray-600">
                        A one-time password has been sent to your email
                      </p>
                      <Input
                        className="text-center border border-gray-300 rounded-md py-2 px-4 w-3/4 mx-auto"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <div className="flex justify-center gap-4">
                        <Button onClick={verifyOtp} colorScheme="blue">
                          Verify OTP
                        </Button>
                        <Button
                          onClick={reSendVerificationOtp}
                          variant="outline"
                          colorScheme="gray"
                        >
                          Resend OTP
                        </Button>
                      </div>
                    </AlertDialogBody>

                    <AlertDialogFooter className="flex justify-end gap-3">
                      <Button
                        ref={cancelRef}
                        onClick={onClose}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          )}
        </>
      );
    },
  },
];

const Peoples = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataId, setDataId] = useState();
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");

  const [peopleDeleteId, setPeopleDeleteId] = useState();

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
    addPeoplesDrawerIsOpened,
    editPeoplesDrawerIsOpened,
    showDetailsPeoplesDrawerIsOpened,
  } = useSelector((state) => state.misc);
  const { role, ...auth } = useSelector((state) => state.auth);
  const { isAllowed, msg } = checkAccess(auth, "people");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const [peopleIds, setPeopleIds] = useState([]); // State to store all people IDs

  // Fetch all people and store their IDs
  const fetchAllPeople = async () => {
    setSearchKey("");
    setData([]);
    setFilteredData([]);
    setLoading(true);

    try {
      const response = await fetch(baseURL + "people/all-persons", {
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

      setData(data.people);
      setFilteredData(data.people);

      // Extract IDs and store them in state
      const ids = data.people.map((person) => person._id);
      setPeopleIds(ids);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  // Send OTP to all people
  const sendVerificationOtp = async () => {
    try {
      if (peopleIds.length === 0) {
        return;
      }

      // Send OTP request for each person
      for (const id of peopleIds) {
        const response = await fetch(`${baseURL}people/verify-people/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${cookies?.access_token}`,
          },
        });

        const otpResponse = await response.json();

      }
    } catch (error) {
      toast.error(`Error while sending OTPs: ${error} `)
    }
  };

  const addPeoplesHandler = () => {
    dispatch(openAddPeoplesDrawer());
  };

  const editHandler = (id) => {
    setDataId(id);
    dispatch(openEditPeoplesDrawer());
  };

  const showDetailsHandler = (id) => {
    setDataId(id);
    dispatch(openShowDetailsPeoplesDrawer());
  };

  const deleteHandler = async () => {
    if (!peopleDeleteId) {
      return;
    }

    try {
      const response = await fetch(baseURL + "people/delete-people", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          peopleId: peopleDeleteId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      onClose();
      fetchAllPeople();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmDeleteHandler = async () => {
    onOpen();
  };

  useEffect(() => {
    if (isAllowed) {
      fetchAllPeople();
    }
  }, []);

  useEffect(() => {
    if (searchKey.trim() !== "") {
      const searchedData = data.filter(
        (d) =>
          d?.creator?.toLowerCase().includes(searchKey.toLowerCase()) ||
          (d?.createdAt &&
            new Date(d?.createdAt)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              .reverse()
              .join("")
              ?.includes(searchKey.replaceAll("/", ""))) ||
          d?.firstname?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.lastname?.toLowerCase().includes(searchKey.toLowerCase()) ||
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
                    Delete Individual
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure, deleting a Individual will also delete it from
                    Customer section, its Leads, Offers, Proforma Invoices,
                    Invoices and Payments?
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
                Individual List
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
                  onClick={fetchAllPeople}
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
                  onClick={addPeoplesHandler}
                  color="white"
                  backgroundColor="#1640d6"
                >
                  Add New Individual
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
              {addPeoplesDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeAddPeoplesDrawer())
                  }
                >
                  <PeoplesDrawer
                    closeDrawerHandler={() => dispatch(closeAddPeoplesDrawer())}
                    fetchAllPeople={fetchAllPeople}
                  />
                </ClickMenu>
              )}

              {editPeoplesDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeEditPeoplesDrawer())
                  }
                >
                  <PeoplesEditDrawer
                    dataId={dataId}
                    closeDrawerHandler={() => {
                      dispatch(closeEditPeoplesDrawer());
                      fetchAllPeople();
                    }}
                  />
                </ClickMenu>
              )}

              {showDetailsPeoplesDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeShowDetailsPeoplesDrawer())
                  }
                >
                  <PeoplesDetailsDrawer
                    dataId={dataId}
                    closeDrawerHandler={() =>
                      dispatch(closeShowDetailsPeoplesDrawer())
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
                    <Table variant="simple" {...getTableProps()}>
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
                      column.id === "firstname"
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
                    cursor-pointer
                  `}
                                    {...column.getHeaderProps(
                                      column.getSortByToggleProps()
                                    )}
                                  >
                                    <div className="flex items-center justify-center text-white">
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
                              <Th className="text-center py-3 px-4 bg-blue-400 ">
                                <p className="text-white"> Actions</p>
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
                              className="hover:bg-gray-100 hover:cursor-pointer text-base text-gray-700 transition duration-300 ease-in-out"
                              {...row.getRowProps()}
                            >
                              {row.cells.map((cell) => {
                                return (
                                  <Td
                                    className={`
                    ${
                      cell.column.id === "firstname"
                        ? "sticky top-0 left-[-2px] "
                        : ""
                    }
                    text-center
                    border-b border-gray-200
                     border-l border-r 
                    p-3
                  `}
                                    {...cell.getCellProps()}
                                  >
                                    {cell.column.id === "creator" ? (
                                      <span className="text-blue-500 text-semibold">
                                        {row.original.creator}
                                      </span>
                                    ) : cell.column.id === "created_on" &&
                                      row.original?.createdAt ? (
                                      <span>
                                        {moment(row.original?.createdAt).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </span>
                                    ) : (
                                      cell.render("Cell")
                                    )}
                                  </Td>
                                );
                              })}

                              <Td className="flex justify-center items-center gap-x-3 p-3">
                                <MdOutlineVisibility
                                  className="text-blue-500 hover:scale-110 transition-transform duration-200"
                                  size={20}
                                  onClick={() =>
                                    showDetailsHandler(row.original?._id)
                                  }
                                />
                                <MdEdit
                                  className="text-yellow-500 hover:scale-110 transition-transform duration-200"
                                  size={20}
                                  onClick={() => editHandler(row.original?._id)}
                                />
                                <MdDeleteOutline
                                  className="text-red-500 hover:scale-110 transition-transform duration-200"
                                  size={20}
                                  onClick={() => {
                                    setPeopleDeleteId(row.original?._id);
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

export default Peoples;
