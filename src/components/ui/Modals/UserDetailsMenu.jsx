import { Avatar, Badge } from "@chakra-ui/react";
import { BiLogOutCircle, BiX } from "react-icons/bi";

const UserDetailsMenu = ({
  logoutHandler,
  closeUserDetailsMenu,
  name,
  email,
  role
}) => {
  return (
    <div
      className="bg-white px-3 py-3 z-30 rounded-lg"
      style={{
        boxShadow:
          "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="cursor-pointer flex border-b py-2 px-3 rounded-md hover:bg-[#e3e3e3]">
        <Avatar size="md" name={name} />
        <div className="pl-2">
          <p className="text-lg font-semibold mb-1">{name}
          <Badge ml="1" colorScheme="red" rounded={'6px'}>
            {role === 'Admin' ? 'Employee' : 'Super Admin'}
          </Badge></p>
          <p className="mt-[-4px] font-semibold">{email}</p>
        </div>
      </div>
      <div
        className="cursor-pointer px-3 py-1 rounded-md hover:bg-[#e3e3e3] mt-2 font-semibold text-lg flex items-center gap-x-2 border-b"
        onClick={logoutHandler}
      >
        <span>
          <BiLogOutCircle />
        </span>
        Logout
      </div>
      <div
        onClick={closeUserDetailsMenu}
        className="cursor-pointer px-3 py-1 rounded-md hover:bg-[#e3e3e3] mt-2 font-semibold text-lg flex items-center gap-x-2"
      >
        <span className="">
          <BiX />
        </span>
        Close
      </div>
    </div>
  );
};

export default UserDetailsMenu;
