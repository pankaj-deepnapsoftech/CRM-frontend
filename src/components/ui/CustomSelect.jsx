import { useEffect, useRef, useState } from "react";
import Select from 'react-select';

const CustomSelect = ({
  value,
  setValue,
  label,
  placeholder,
  data,
  idAccessor,
  nameAccessor,
}) => {
  const boxRef = useRef();
  const suggestionsAreaRef = useRef();
  const [input, setInput] = useState("");
  // let isInputValid = false;
  const [inputId, setInputId] = useState("");
  const [isSuggestionBoxVisible, setIsSuggestionBoxVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const [optionsList, setOptionsList] = useState();
  const [selectedOptions, setSelectedOptions] = useState();

  useEffect(() => {
    const searchedData = data.filter((d) => {
      let name = "";
      if (nameAccessor.length === 1) {
        name = d[nameAccessor[0]];
      } else {
        name = nameAccessor
              .map((_, ind) => d[nameAccessor[ind]] + " ")
              .toString()
              .replaceAll(",", "");
      }
      return name.toLowerCase().includes(input.toLowerCase());
    });
    setFilteredData(searchedData);
  }, [input]);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setIsSuggestionBoxVisible(false);

        // console.log(isInputValid)

        // if(!isInputValid){
        //   setInput('');
        //   setInputId('');
        // }
      }
    });

    return () => {
      document.removeEventListener("click", (e) => {
        if (boxRef.current && !boxRef.current.contains(e.target)) {
          setIsSuggestionBoxVisible(false);
        }
      });
    };
  }, []);

  useEffect(() => {
    const options = data.map((d)=> {
      return {'value': d._id, 'label': d.firstname + ' ' + d.lastname}
    })
    setOptionsList(options);
    // setFilteredData(data);
  }, [data]);

  return (
    <div className="flex flex-col mt-3 mb-5">
      <p className="font-bold">{label}</p>

      {/* <div ref={boxRef}>
        <div>
          <input
            value={input}
            onFocus={() => setIsSuggestionBoxVisible(true)}
            onChange={(e) => {
              setInput(e.target.value);
              // isInputValid = false;
              // console.log("Typing....")
            }}
            className="w-full mt-1 outline-none border rounded-md py-2 px-2"
            type="text"
            placeholder={placeholder}
          />
        </div>

        {isSuggestionBoxVisible && (
          <div className="cursor-pointer border mt-1 bg-white rounded-md px-2 py-2">
            {filteredData.length > 0 &&
              filteredData.map((data) => {
                return (
                  <div
                    className="hover:bg-[#e6f4ff] py-1 px-2 rounded mb-1"
                    onClick={() => {
                      // console.log("Selected")
                      // isInputValid = true;
                      let name = "";
                      if (nameAccessor.length === 1) {
                        name = data[nameAccessor[0]];
                      } else {
                        name = nameAccessor
                          .map((_, ind) => data[nameAccessor[ind]] + " ")
                          .toString()
                          .replaceAll(",", "");
                      }
                      setInput(name);
                      setInputId(data[idAccessor]);
                    }}
                  >
                    {nameAccessor.length === 1 && data[nameAccessor[0]]}
                    {nameAccessor.length > 1 &&
                      nameAccessor.map(
                        (_, ind) => data[nameAccessor[ind]] + " "
                      )}
                  </div>
                );
              })}

            {filteredData.length === 0 && <div>No matching results found.</div>}
          </div>
        )}
      </div> */}

      <Select
        options={[{ value: "red", label: "Red" },
          { value: "green", label: "Green" },
          { value: "yellow", label: "Yellow" },
          { value: "blue", label: "Blue" },
          { value: "white", label: "White" }]}
        placeholder="Select individual"
        value={selectedOptions}
        onChange={(d)=>setSelectedOptions(d)}
        isSearchable={true}
      />
    </div>
  );
};

export default CustomSelect;
