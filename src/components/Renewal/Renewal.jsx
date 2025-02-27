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
import * as XLSX from "xlsx"; // Import the xlsx library

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
import ExcelEditDrawer from "../ui/Drawers/Edit Drawers/ExcelEditDrawer";
import ExcelDetailsDrawer from "../ui/Drawers/Details Drawers/ExcelDetailsDrawer";
import ExcelDrawer from "../ui/Drawers/Add Drawers/ExcelDrawer";
import { FcDatabase } from "react-icons/fc";
import { Input } from "@chakra-ui/react";
import Marquee from "react-fast-marquee";
import sampleCSV from "../../assets/bulk-upload-renewal.csv";

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
import axios from "axios";
import { HStack } from "@chakra-ui/react";

const columns = [
  {
    Header: "",
    accessor: "select",
  },
  {
    Header: "Custumer Name",
    accessor: "custumerName",
  },
  {
    Header: "Type of contract",
    accessor: "contractType",
  },
  {
    Header: "Contract Number",
    accessor: "contractNumber",
  },
  {
    Header: "Product Name",
    accessor: "productName",
  },
  {
    Header: "Phone",
    accessor: "phnNumber",
  },
  {
    Header: "Renewals Times",
    accessor: "renewalTimes",
  },
];

const Renewals = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataId, setDataId] = useState();
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [dateWise, setDateWise] = useState([]);
  const [toggleBulkUpload, setToggleBulkUpload] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ids, setIds] = useState([]);

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

  // Fetch all people and store their IDs
  // State to store only IDs of all people
  const [peopleIds, setPeopleIds] = useState([]);

  const fetchAllPeople = async () => {
    setSearchKey("");
    setData([]);
    setFilteredData([]);
    setPeopleIds([]); // Reset IDs before fetching new data
    setLoading(true);

    try {
      const response = await fetch(baseURL + "renewal/all-records", {
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

      setData(data.data || []); // Ensure it's always an array

      setFilteredData(data.data || []);

      // Extract IDs and store them separately
      const extractedIds = data.data?.map((person) => person._id) || [];
      setPeopleIds(extractedIds);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  const fetchAllDateWiseData = async () => {
    try {
      const response = await fetch(baseURL + "renewal/date-wise", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });
      const data = await response.json();
      setDateWise(data?.data ? data?.data : []);
    } catch (error) {
      toast.error(`Something went wrong! ${error}`)
    }
  };

  useEffect(() => {
    fetchAllPeople();
    fetchAllDateWiseData();
  }, []);

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
      toast.error("No ID provided for deletion.");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}renewal/delete-record/${peopleDeleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      // ✅ Log the response before parsing
      const text = await response.text();

      // ✅ Try parsing JSON safely
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("API did not return valid JSON. Check console logs.");
      }

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      onClose();
      fetchAllPeople(); // Refresh data after deletion
    } catch (err) {

      toast.error(err.message);
    }
  };

  const confirmDeleteHandler = async () => {
    onOpen();
  };

  useEffect(() => {
    if (searchKey.trim() !== "") {
      const searchedData = data.filter(
        (d) =>
          d?.custumerName?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.contractType?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.contractNumber?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.productName?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.phnNumber?.includes(searchKey) ||
          d?.renewalTimes?.toString().includes(searchKey)
      );
      setFilteredData(searchedData);
    } else {
      setFilteredData(data);
    }
  }, [searchKey, data]);

  // Function to handle bulk download
  const handleBulkDownload = () => {
    // Convert JSON data to Excel
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Renewals");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, "Renewals.xlsx");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validate file type
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".csv")) {
        toast.error("Invalid file type. Only .xlsx or .csv files are allowed.");
        return;
      }

      const formData = new FormData();
      formData.append("excel", file); // Use the "excel" field


      fetch(`${baseURL}renewal/bulk-upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: formData, // Send the file as FormData
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            toast.success("Excel data uploaded successfully!");
            fetchAllPeople(); // Refresh the data
          } else {
            throw new Error(result.message);
          }
        })
        .catch((error) => {
          toast.error(`Failed to upload Excel data: ${error.message}`);
        });
    }
  };

  const handleSelect = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      setIds((prevIds) => [...prevIds, value]);
    } else {
      setIds((prevIds) => prevIds.filter((id) => id !== value));
    }
  };

  const handleBulkDelete = async (e) => {
    e.preventDefault();
    if (ids.length === 0) {
      toast.error("Please select renewals!");
    } else {
      try {
        const response = await axios.delete(
          `${baseURL}renewal/delete-records`,
          {
            headers: {
              Authorization: `Bearer ${cookies?.access_token}`,
            },
            data: {
              ids: ids,
            },
          }
        );

        toast.success("Data deleted Successfully :)");
        fetchAllPeople();
      } catch (err) {
        // console.error("Delete Selected Error:", err);
        toast.error(`Something went wrong: ${err}`);
      }
    }
  };

  // filter by date
  const filterDataByDate = (startDate, endDate) => {
    if (!startDate || !endDate) {
      setFilteredData(data); // If no date range is selected, show all data
      return;
    }

    const filtered = data.filter((item) => {
      const itemDate = new Date(item.createdAt); // Replace `createdAt` with the appropriate date field
      const start = new Date(startDate);
      const end = new Date(endDate);

      return itemDate >= start && itemDate <= end;
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    filterDataByDate(startDate, endDate);
  }, [startDate, endDate, data]);

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
                    all sections
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
            <h1 className="font-extrabold text-2xl p-2">Renewal List</h1>
            <div className="flex flex-row justify-end text-lg md:text-xl mb-4 font-semibold items-center gap-y-4">
              {/* <span className="mr-2">
                  <MdArrowBack />
                </span> */}
              <div className="mt-2 md:mt-0 flex justify-start flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
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
              </div>
            </div>
            <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
              <div className="mt-2 md:mt-0 flex justify-end flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
                <Button
                  fontSize={{ base: "14px", md: "14px" }}
                  paddingX={{ base: "10px", md: "12px" }}
                  paddingY={{ base: "0", md: "3px" }}
                  width={{ base: "-webkit-fill-available", md: 200 }}
                  onClick={addPeoplesHandler}
                  color="white"
                  backgroundColor="#1640d6"
                >
                  Add Renewal
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
                <Button onClick={handleBulkDownload} colorScheme="green">
                  Bulk Download
                </Button>
                <Button onClick={handleBulkDelete} colorScheme="orange">
                  Bulk Delete
                </Button>

                <HStack spacing={4}>
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    size="sm"
                    maxWidth="200px"
                  />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    size="sm"
                    maxWidth="200px"
                  />
                </HStack>

                <div>
                  {/* Bulk Upload CSV Button */}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload">
                    <Button
                      as="span"
                      colorScheme="blue"
                      onClick={() => setShowUploadOptions((prev) => !prev)}
                    >
                      Bulk Upload CSV
                    </Button>
                  </label>

                  {/* Toggle Upload Options */}
                  {showUploadOptions && (
                    <div className="mt-2">
                      {/* Download Sample CSV Button */}
                      <a href={sampleCSV} download="sample-renewals.csv">
                        <Button
                          colorScheme="green"
                          variant="outline"
                          mr={2} // Add margin to separate buttons
                        >
                          Download Sample CSV
                        </Button>
                      </a>

                      {/* Upload CSV Button */}
                      <label htmlFor="csv-upload">
                        <Button as="span" colorScheme="blue">
                          Upload CSV
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
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
                  <ExcelDrawer
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
                  <ExcelEditDrawer
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
                  <ExcelDetailsDrawer
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
                  <div className="p-4">
                    <div className="bg-white  shadow-lg rounded-lg p-4 border border-gray-300">
                      <h2 className="text-lg font-semibold mb-2">
                        Upcoming Renewals
                      </h2>
                      <Marquee speed={70} pauseOnHover>
                        {dateWise?.map((item, i) => (
                          <div
                            key={i}
                            className="bg-blue-100  text-blue-800 px-4 py-2 m-2 rounded-lg shadow-md"
                          >
                            <p className="whitespace-pre-line text-center">
                              📅 Due {item.lastRenewalDate.split("T")[0]} /{" "}
                              {item.contractType} / {item.productName}
                            </p>
                          </div>
                        ))}
                      </Marquee>
                    </div>
                  </div>
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
                                    ) : cell.column.id === "select" ? (
                                      <input
                                        value={cell.row.original._id}
                                        name="select"
                                        type="checkbox"
                                        onChange={(e) => {
                                          handleSelect(e);
                                        }}
                                      />
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

export default Renewals;
