import { useState } from "react";
import { IoIosMore } from "react-icons/io";
import ClickMenu from "../ui/ClickMenu";
import {
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineVisibility,
} from "react-icons/md";

const TableActionsMenu = ({
  dataId = "",
  showDetails,
  editHandler,
  deleteHandler,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const actionsMenuHandler = () => {
    setShowMenu(true);
  };

  return (
    <div>
      <IoIosMore onClick={actionsMenuHandler} />
      {showMenu && (
        <ClickMenu
          top={30}
          right={20}
          closeContextMenuHandler={() => setShowMenu(false)}
        >
          <div className="bg-white p-3 border rounded-md">
            <div
              onClick={() => showDetails(dataId)}
              className="flex gap-x-1 mb-3 px-2 py-1 rounded hover:bg-[#d9d9d9]"
            >
              <MdOutlineVisibility size="20px" />
              View
            </div>

            <div
              onClick={() => editHandler(dataId)}
              className="flex gap-x-1 mb-3 px-2 py-1 rounded hover:bg-[#d9d9d9]"
            >
              <MdOutlineEdit size="20px" />
              Edit
            </div>

            <div
              onClick={() => deleteHandler(dataId)}
              className="flex gap-x-1 px-2 py-1 rounded hover:bg-[#d9d9d9]"
            >
              <MdOutlineDelete size="20px" />
              Delete
            </div>
          </div>
        </ClickMenu>
      )}
    </div>
  );
};

export default TableActionsMenu;
