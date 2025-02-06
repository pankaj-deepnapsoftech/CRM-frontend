import React from "react";


const Cards = ({ label, content, bg, Icon, iconColor }) => {
  return (
    <div className={`bg-gradient-to-r ${bg} p-6 rounded-xl shadow-lg w-64 sm:w-full hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Icon className={`${iconColor} text-2xl`}/> 
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg> */}
        </div>

        <h3 className="text-white text-lg font-semibold">{label}</h3>
      </div>

      <div className="mt-4 text-white text-4xl font-bold text-end">{content}</div>
    </div>
  );

};

export default Cards;
