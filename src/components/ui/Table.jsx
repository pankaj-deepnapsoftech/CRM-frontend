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
import TableActionsMenu from "./TableActionsMenu";
import ProductDetailsDrawer from "./Drawers/ProductDetailsDrawer";
import { useEffect, useState } from "react";
import ProductEditDrawer from "./Drawers/Edit Drawers/ProductEditDrawer";
import { BiDotsHorizontal } from "react-icons/bi";
import ClickMenu from "./ClickMenu";
import { useDispatch, useSelector } from "react-redux";
import { closeShowDetailsProductsDrawer } from "../../redux/reducers/misc";

const TableComponent = (props) => {
  const { columns, data, fetchDetails } = props;

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
  } = useTable({ columns, data }, useSortBy, usePagination);

  const [showDetails, setShowDetails] = useState(false);
  const [edit, setEdit] = useState(false);
  const [dataId, setDataId] = useState();
  const dispatch = useDispatch();
  const {
    editCustomersDrawerIsOpened,
    showDetailsCustomersDrawerIsOpened,
    editPeoplesDrawerIsOpened,
    showDetailsPeoplesDrawerIsOpened,
    editCompaniesDrawerIsOpened,
    showDetailsCompaniesDrawerIsOpened,
    editLeadsDrawerIsOpened,
    showDetailsLeadsDrawerIsOpened,
    editProductsDrawerIsOpened,
    showDetailsProductsDrawerIsOpened,
    editProductsCategoryDrawerIsOpened,
    showDetailsProductsCategoryDrawerIsOpened,
    editExpensesDrawerIsOpened,
    showDetailsExpensesDrawerIsOpened,
    editExpensesCategoryDrawerIsOpened,
    showDetailsExpensesCategoryDrawerIsOpened,
  } = useSelector((state) => state.misc);

  const showDetailsHandler = async (id) => {
    setDataId(id);
    setShowDetails(true);
  };

  const editHandler = async (id) => {
    setDataId(id);
    setEdit(true);
  };

  return (
    <div>
      {showDetailsProductsDrawerIsOpened && (
        <ClickMenu
          top={0}
          right={0}
          closeContextMenuHandler={() => closeShowDetailsProductsDrawer()}
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
          closeContextMenuHandler={() => dispatch(closeShowDetailsProductsDrawer())}
        >
          <ProductEditDrawer
            dataId={dataId}
            closeDrawerHandler={() => dispatch(closeShowDetailsProductsDrawer())}
          />
        </ClickMenu>
      )}

      <TableContainer>
        <Table variant="simple" {...getTableProps()}>
          <Thead className="text-lg font-semibold">
            {headerGroups.map((hg) => {
              return (
                <Tr {...hg.getHeaderGroupProps()}>
                  {hg.headers.map((column) => {
                    return (
                      <Th
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
                        {column.render("Header")}
                        {column.isSorted && (
                          <span>
                            {column.isSortedDesc ? (
                              <i class="bx bx-chevron-down"></i>
                            ) : (
                              <i class="bx bx-chevron-up"></i>
                            )}
                          </span>
                        )}
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
                  onClick={() =>
                    fetchDetails !== undefined &&
                    fetchDetails(row.cells[0].value)
                  }
                  className="relative text-4xl hover:bg-[#e4e4e4] hover:cursor-pointer sm:text-3xl lg:text-2xl xl:text-base"
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell) => {
                    return (
                      <Td fontWeight="600" {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </Td>
                    );
                  })}
                  <Td>
                    <TableActionsMenu
                      showDetails={showDetailsHandler}
                      editHandler={editHandler}
                      dataId={row.original?._id}
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
          className="text-4xl mt-2 bg-[#515454] py-4 px-10 text-white border-[1px] border-[#515454] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-2xl md:py-2 md:px-6 lg:text-xl lg:py-1 xl:text-base"
          disabled={!canPreviousPage}
          onClick={previousPage}
        >
          Prev
        </button>
        <span className="mx-3 text-4xl md:text-2xl lg:text-xl xl:text-base">
          {pageIndex + 1} of {pageCount}
        </span>
        <button
          className="text-4xl mt-2 mr-2 bg-[#515454] py-4 px-10 text-white border-[1px] border-[#515454] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-2xl md:py-2 md:px-6 lg:text-xl lg:py-1 xl:text-base"
          disabled={!canNextPage}
          onClick={nextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
