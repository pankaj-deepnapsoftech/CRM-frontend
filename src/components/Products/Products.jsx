import { Avatar, Button, Select, useDisclosure } from "@chakra-ui/react";
import {
  MdOutlineRefresh,
  MdArrowBack,
  MdEdit,
  MdDeleteOutline,
  MdOutlineVisibility,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  closeShowDetailsProductsDrawer,
  openAddProductsDrawer,
  openEditProductsDrawer,
  openShowDetailsProductsDrawer,
  closeEditProductsDrawer,
  closeAddProductsDrawer,
} from "../../redux/reducers/misc";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../ui/Loading";
import { useSelector } from "react-redux";
import ClickMenu from "../ui/ClickMenu";
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
import ProductDetailsDrawer from "../ui/Drawers/Details Drawers/ProductDetailsDrawer";
import ProductEditDrawer from "../ui/Drawers/Edit Drawers/ProductEditDrawer";
import ProductsDrawer from "../ui/Drawers/Add Drawers/ProductsDrawer";
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
    Header: "Model",
    accessor: "model",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Image",
    accessor: "imageUrl",
  },
  {
    Header: "Product Category",
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

const Products = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const dispatch = useDispatch();

  const [productDeleteId, setProductDeleteId] = useState();
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

  const [dataId, setDataId] = useState();

  const {
    addProductsDrawerIsOpened,
    editProductsDrawerIsOpened,
    showDetailsProductsDrawerIsOpened,
  } = useSelector((state) => state.misc);
  const { role, ...auth } = useSelector((state) => state.auth);
  const { isAllowed, msg } = checkAccess(auth, "product");
  const showDetailsHandler = (id) => {
    setDataId(id);
    dispatch(openShowDetailsProductsDrawer());
  };

  const editHandler = (id) => {
    setDataId(id);
    dispatch(openEditProductsDrawer());
  };

  const confirmDeleteHandler = async () => {
    onOpen();
  };

  const deleteHandler = async (id) => {
    if (!productDeleteId) {
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "product/delete-product",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${cookies?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: productDeleteId,
          }),
        }
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      fetchAllProducts();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      onClose();
    }
  };

  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const fetchAllProducts = async () => {
    setSearchKey("");
    setData([]);
    setFilteredData([]);
    setLoading(true);
    try {
      const response = await fetch(baseURL + "product/all-products", {
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

      setData(data.products);
      setFilteredData(data.products);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  const addProductsHandler = () => {
    dispatch(openAddProductsDrawer());
  };

  useEffect(() => {
    if (isAllowed) {
      fetchAllProducts();
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
          d?.price?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.description?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.ref?.includes(searchKey)
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
                    Delete Product
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
                Product List
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
                  onClick={fetchAllProducts}
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
                  onClick={addProductsHandler}
                  color="white"
                  backgroundColor="#1640d6"
                >
                  Add New Product
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
              {addProductsDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeAddProductsDrawer())
                  }
                >
                  <ProductsDrawer
                    fetchAllProducts={fetchAllProducts}
                    closeDrawerHandler={() =>
                      dispatch(closeAddProductsDrawer())
                    }
                  />
                </ClickMenu>
              )}

              {showDetailsProductsDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeShowDetailsProductsDrawer())
                  }
                >
                  <ProductDetailsDrawer
                    dataId={dataId}
                    closeDrawerHandler={() =>
                      dispatch(closeShowDetailsProductsDrawer())
                    }
                  />
                </ClickMenu>
              )}

              {editProductsDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeEditProductsDrawer())
                  }
                >
                  <ProductEditDrawer
                    dataId={dataId}
                    fetchAllProducts={fetchAllProducts}
                    closeDrawerHandler={() =>
                      dispatch(closeEditProductsDrawer())
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
                    className="shadow-lg rounded-lg bg-white"
                  >
                    <Table variant="simple" {...getTableProps()}>
                      <Thead className="text-lg font-semibold bg-blue-400">
                        {headerGroups.map((hg) => {
                          return (
                            <Tr {...hg.getHeaderGroupProps()}>
                              {hg.headers.map((column) => {
                                return (
                                  <Th
                                    className={`${
                                      column.id === "name"
                                        ? "sticky top-0 left-[-2px] bg-blue-400 border-b-2 border-[#ccc]"
                                        : ""
                                    } 
                  text-transform: capitalize font-semibold text-gray-800 px-4 py-3 border-l border-r border-[#e0e0e0] transition-all duration-300 ease-in-out`}
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
                                className="bg-blue-400 text-white"
                                borderLeft="1px solid #d7d7d7"
                                borderRight="1px solid #d7d7d7"
                              >
                                <p className="text-white uppercase">Actions</p>
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
                                        ? "sticky top-0 left-[-2px] bg-white z-10" 
                                        : ""
                                    } font-semibold text-sm text-gray-700 px-4 py-3 border-l border-r border-[#e0e0e0] transition duration-300 ease-in-out`}
                                    {...cell.getCellProps()}
                                  >
                                    {cell.column.id !== "imageUrl" &&
                                      cell.column.id !== "price" &&
                                      cell.column.id !== "creator" &&
                                      cell.column.id !== "description" &&
                                      cell.column.id !== "created_on" &&
                                      cell.column.id !== "stock" &&
                                      cell.render("Cell")}
                                    {cell.column.id === "imageUrl" && (
                                      <Avatar
                                        size="sm"
                                        src={row.original.imageUrl}
                                      />
                                    )}

                                    {cell.column.id === "created_on" && (
                                      <span className="text-gray-600">
                                        {moment(row.original.createdAt).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </span>
                                    )}

                                    {cell.column.id === "creator" && (
                                      <span className="text-blue-500">
                                        {row.original.creator}
                                      </span>
                                    )}
                                    {cell.column.id === "price" && (
                                      <span className="text-green-600 font-semibold">
                                        &#8377;{row.original.price}
                                      </span>
                                    )}
                                    {cell.column.id === "stock" &&
                                      row.original.stock > 10 && (
                                        <span className="bg-blue-500 text-white h-[30px] w-[30px] rounded-full p-2 flex items-center justify-center">
                                          {row.original.stock}
                                        </span>
                                      )}
                                    {cell.column.id === "stock" &&
                                      row.original.stock <= 10 && (
                                        <span className="bg-red-500 text-white h-[30px] w-[30px] rounded-full p-2 flex items-center justify-center">
                                          {row.original.stock <= 9
                                            ? "0" + row.original.stock
                                            : row.original.stock}
                                        </span>
                                      )}
                                    {cell.column.id === "description" && (
                                      <span className="text-gray-700">
                                        {row.original.description.length > 50
                                          ? row.original.description.substr(
                                              0,
                                              50
                                            ) + "..."
                                          : row.original.description}
                                      </span>
                                    )}
                                  </Td>
                                );
                              })}
                              <Td className="flex gap-x-2 py-1 justify-center items-center">
                                <MdOutlineVisibility
                                  className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200"
                                  size={23}
                                  onClick={() =>
                                    showDetailsHandler(row.original?._id)
                                  }
                                />
                                <MdEdit
                                  className="text-yellow-600 hover:text-yellow-800 hover:scale-110 transition-all duration-200"
                                  size={23}
                                  onClick={() => editHandler(row.original?._id)}
                                />
                                <MdDeleteOutline
                                  className="text-red-600 hover:text-red-800 hover:scale-110 transition-all duration-200"
                                  size={23}
                                  onClick={() => {
                                    setProductDeleteId(row.original?._id);
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

export default Products;
