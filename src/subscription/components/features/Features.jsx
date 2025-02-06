import feature1 from "../../../assets/feature1.jpg";
import feature2 from "../../../assets/feature2.jpg";
import feature3 from "../../../assets/feature3.png";
import feature4 from "../../../assets/feature4.jpg";
import featuresbg from "../../../assets/featuresbg.jpg";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoDocumentSharp } from "react-icons/io5";
import { FaBuilding } from "react-icons/fa";
import { CgPerformance } from "react-icons/cg";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { MdOutlineSupportAgent } from "react-icons/md";

const Features = () => {
  return (
    <div>
      <div className="relative">
      <div className="mt-36 features">
        <img
          src={featuresbg}
          className="w-full h-[50rem] absolute bottom-0 left-0 object-cover"
        ></img>

        <div className="absolute top-[5rem] left-[50%] translate-x-[-50%] z-10 text-center w-[90%] sm:w-[30rem] lg:w-[50rem]">
          <h1 className="subscription-font text-white text-5xl font-medium">CRM For All</h1>
          <p className="subscription-font text-white text-lg font-light mt-3">
            Welcome to Deepnap CRM, where innovation meets efficiency! Our
            platform is designed to streamline your customer relationship
            management, making it easier than ever to connect with your clients
            and grow your business.
          </p>
          <p className="subscription-font text-white text-lg font-light mt-3">
            {" "}
            With intuitive features, robust analytics, and seamless
            integrations, Deepnap CRM empowers you to nurture relationships,
            enhance communication, and drive sales. Discover how our solutions
            can transform your approach to customer management and take your
            business to new heights. Explore Deepnap CRM today and unlock your
            full potential!
          </p>
        </div>

        <div className="h-[50rem]"></div>
      </div>
      
      <div className="z-20 absolute -bottom-12 sm:bottom-0 md:bottom-[-120px] left-1/2 -translate-x-1/2 border-[15px] h-[260px] w-full md:w-[500px] rounded-2xl overflow-hidden">
          {/* <iframe src='https://www.youtube.com/watch?v=h7XFBXzGusk' /> */}
          <iframe
            className="h-[245px] w-full md:w-[485px]"
            src="https://www.youtube.com/embed/h7XFBXzGusk"
          ></iframe>
        </div>
      </div>

      <div className="px-1 mt-16 md:mt-40 features-1 py-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 px-1 md:px-10">
          <div className="h:[20rem] md:h-[25rem] lg:h-[20rem] w-full md:w-[90%] lg:w-[50%] overflow-hidden rounded-xl">
            <img src={feature1} className="lg:mr-0 lg:ml-auto h-[inherit] w-full lg:w-[80%]" />
          </div>

          <div className="w-[80%] lg:w-[50%] text-[#262544]">
            <h1 className="subscription-font text-3xl font-medium mb-2">
              Integrate all your Lead Sources
            </h1>
            <p className="subscription-font font-light">
              Collect the leads directly in the Lead Management Software from
              all your lead sources without any manual intervention. All your
              leads will be aggregated in one place with zero effort.
            </p>
            <p className="subscription-font font-light mt-2">
              You’ll be able to unlock things like reporting, Org Chart,
              employee data, and so much more. Click below on one of the areas
              to get into the weeds of what is available.
            </p>
          </div>
        </div>
        {/* <div className="flex items-start gap-5 ml-20 mt-9 pb-4">
          <div className="flex flex-col items-center justify-center font-medium">
            <div className="-mt-3">
              <FaPeopleGroup color="#2f2a5f" size={90} />
            </div>
            <p className="text-lg -mt-1">Employee Management</p>
          </div>
          <div className="flex flex-col items-center justify-center font-medium">
            <IoDocumentSharp color="#2f2a5f" size={70} />
            <p className="text-lg mt-1">Record Management</p>
          </div>
          <div className="flex flex-col items-center justify-center font-medium">
            <FaBuilding color="#2f2a5f" size={70} />
            <p className="text-lg mt-1">Administration</p>
          </div>
        </div> */}
      </div>

      <div className="px-1 mt-16 features-2 py-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 px-1 md:px-10">
          <div className="w-[80%] lg:w-[50%] text-[#262544]">
            <h1 className="subscription-font text-3xl font-medium mb-2">Lead Assignation</h1>
            <p className="subscription-font font-light">
              The leads can be assigned to the sales team member by you from
              employees panel. The employee can also see the assigned lead.
            </p>
          </div>

          <div className="h:[20rem] md:h-[25rem] lg:h-[20rem] w-full md:w-[90%] lg:w-[50%] overflow-hidden rounded-xl">
            <img src={feature2} className="lg:mr-0 lg:ml-auto h-[inherit] w-full lg:w-[80%]" />
          </div>
        </div>
        {/* <div className="flex justify-end gap-10 mr-32 mt-9 pb-4">
          <div className="flex flex-col items-center justify-center font-medium">
            <div className="mt-2">
              <CgPerformance color="#2f2a5f" size={60} />
            </div>
            <p className="text-lg mt-1">Performance</p>
          </div>
          <div className="flex flex-col items-center justify-center font-medium">
            <LiaChalkboardTeacherSolid color="#2f2a5f" size={70} />
            <p className="text-lg mt-1">Training</p>
          </div>
          <div className="flex flex-col items-center justify-center font-medium">
            <MdOutlineSupportAgent color="#2f2a5f" size={70} />
            <p className="text-lg mt-1">Support</p>
          </div>
        </div> */}
      </div>

      <div className="px-1 mt-16 features-3 py-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 px-1 md:px-10">
        <div className="h:[20rem] md:h-[25rem] lg:h-[20rem] w-full md:w-[90%] lg:w-[50%] overflow-hidden rounded-xl">
          <img src={feature3} className="lg:mr-0 lg:ml-auto h-[inherit] w-full lg:w-[80%]" />
        </div>

          <div className="w-[80%] lg:w-[50%] text-[#262544]">
            <h1 className="subscription-font text-3xl font-medium mb-2">
              Automatic Document Generation
            </h1>
            <p className="subscription-font font-light">
              Increase the efficiency with the help of automatic document
              generation like Proforma Invoice, Invoice, Offer and Payment in
              PDF format.
            </p>
          </div>
        </div>
        {/* <div className="flex justify-end gap-10 mr-32 mt-9 pb-4">
          <div className="flex flex-col items-center justify-center font-medium">
            <div className="mt-2">
              <CgPerformance color="#2f2a5f" size={60} />
            </div>
            <p className="text-lg mt-1">Performance</p>
          </div>
          <div className="flex flex-col items-center justify-center font-medium">
            <LiaChalkboardTeacherSolid color="#2f2a5f" size={70} />
            <p className="text-lg mt-1">Training</p>
          </div>
          <div className="flex flex-col items-center justify-center font-medium">
            <MdOutlineSupportAgent color="#2f2a5f" size={70} />
            <p className="text-lg mt-1">Support</p>
          </div>
        </div> */}
      </div>

      <div className="px-1 mt-16 features-4 py-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 px-1 md:px-10">
          <div className="w-[80%] lg:w-[50%] text-[#262544]">
            <h1 className="subscription-font text-3xl font-medium mb-2">And A Lot More…</h1>
            <p className="subscription-font font-light">
              Increase the productivity of your sales team using various awesome
              sales automations tools. Create Dashboards, Reports, Sales
              Pipeline & Many More…
            </p>
          </div>

          <div className="h:[20rem] md:h-[25rem] lg:h-[20rem] w-full md:w-[90%] lg:w-[50%] overflow-hidden rounded-xl">
            <img src={feature4} className="lg:mr-0 lg:ml-auto h-[inherit] w-full lg:w-[80%]" />
          </div>
        </div>
        {/* <div className="flex justify-end gap-10 mr-32 mt-9 pb-4">
          <div className="flex flex-col items-center justify-center font-medium">
            <div className="mt-2">
              <CgPerformance color="#2f2a5f" size={60} />
            </div>
            <p className="text-lg mt-1">Performance</p>
          </div>
          <div className="flex flex-col items-center justify-center font-medium">
            <LiaChalkboardTeacherSolid color="#2f2a5f" size={70} />
            <p className="text-lg mt-1">Training</p>
          </div>
          <div className="flex flex-col items-center justify-center font-medium">
            <MdOutlineSupportAgent color="#2f2a5f" size={70} />
            <p className="text-lg mt-1">Support</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Features;
