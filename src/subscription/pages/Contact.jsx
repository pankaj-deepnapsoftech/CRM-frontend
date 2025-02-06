import { useState } from "react";
import contact from "../../assets/contactus.svg";
import contactbg from "../../assets/contactusbg.svg";
import Clients from "../components/Clients/Clients";
import { toast } from "react-toastify";
const Contact = () => {
  const [name, setName] = useState();
  const [mobile, setMobile] = useState();
  const [purpose, setPurpose] = useState();
  const [description, setDescription] = useState();

  const sendQueryHandler = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !purpose ||
      !mobile ||
      !description ||
      name.trim().length === 0 ||
      purpose.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    if (mobile.trim().length < 10 || purpose.trim().length > 10) {
      return;
    }

    try {
      const url = process.env.REACT_APP_SUPPORT_URL + "support/create-support";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobile,
          purpose,
          description,
        }),
      });
      const data = await response.json();

      if (!data?.success) {
        throw new Error(data.message);
      }

      setName("");
      setMobile("");
      setDescription("");
      setPurpose("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative contact pt-36">
      <div className="">
        <h1 className="subscription-font text-4xl font-medium text-[#262544] text-center mb-10">
          Have Some Questions?
        </h1>

        <div className="flex flex-col md:flex-row px-10 justify-center items-center gap-10">
          <div>
            <img src={contact} className="w-[40rem]" />
          </div>

          <div className="w-[23rem] md:w-[30rem] border rounded px-2 md:px-5 py-5 md:py-10 bg-white">
            <h1 className="subscription-font text-3xl font-medium text-[#262544] text-center mb-6 md:mb-12">
              We Just Need a Few Details
            </h1>
            <form onSubmit={sendQueryHandler}>
              <div className="flex flex-col gap-2 mb-5">
                {/* <label className="font-light text-lg">Name</label> */}
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Name"
                  className="subscription-font text-lg font-light border outline-none rounded-md px-3 py-[6px] bg-[#e3e3e3]"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-2 mb-5">
                {/* <label className="font-light text-lg">Phone no.</label> */}
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required 
                  placeholder="Mobile no."
                  className="subscription-font text-lg font-light border outline-none rounded-md px-3 py-[6px] bg-[#e3e3e3]"
                  type="tel"
                />
              </div>
              <div className="flex flex-col gap-2 mb-5">
                {/* <label className="font-light text-lg">Email</label> */}
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  className="subscription-font text-lg font-light border outline-none rounded-md px-3 py-[8px] bg-[#e3e3e3]"
                  type="text"
                >
                  <option value="">Select your purpose</option>
                  <option value="purchase">Purchase</option>
                  <option value="support">Support</option>
                </select>
              </div>
              <div className="subscription-font flex flex-col gap-2 mb-5">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Description"
                  className="bg-[#e3e3e3] text-lg font-light border outline-none rounded-md px-3 py-[6px]"
                  />
                  </div>

              <div className="w-full pt-3">
                <button
                  style={{
                    background:
                      "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
                  }}
                  className="subscription-font text-white border w-full py-2 text-lg font-light rounded-full ease-in-out duration-500 hover:scale-105"
                >
                  Contact Us
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="my-16 md:my-32 md:px-10">
        <Clients />
      </div>
    </div>
  );
};

export default Contact;
