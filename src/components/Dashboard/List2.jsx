import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa"; // Example icons
import { MdAssignmentTurnedIn } from "react-icons/md";
import { TbBrandGoogleBigQuery } from "react-icons/tb";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const List2 = ({ newQueries, underProcess, assigned, completed }) => {
  const navigate = useNavigate();
  const items = [
    {
      icon: <BsFillQuestionCircleFill className="text-red-500" />,
      title: "New Queries",
      value:  newQueries ,
      navigateTo: "support",
      state: { searchKey: "New" },
    },
    {
      icon: <FaCheckCircle className="text-green-500" />,
      title: "Completed Queries",
      value: underProcess ,
      navigateTo: "support",
      state: { searchKey: "Completed" },
    },
    {
      icon: <FaExclamationCircle className="text-yellow-500" />,
      title: "Under Process Queries",
      value: assigned ,
      navigateTo: "support",
      state: { searchKey: "Under Process" },
    },
    {
      icon: <MdAssignmentTurnedIn className="text-blue-500" />,
      title: "Assigned Queries",
      value:  completed ,
      navigateTo: "assigned-support",
    },
  ];

  const handleItemClick = (route, state) => {
    if (state) {
      navigate(route, { state });
    } else {
      navigate(route);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Query Status</h2>
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between py-3 border-b"
            onClick={() => handleItemClick(item.navigateTo, item.state )} 
          >
            <div className="flex items-center">
              {item.icon}
              <span className="ml-3 font-medium">{item.title}</span>
            </div>
            <span className="font-bold text-gray-700">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List2;
