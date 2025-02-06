import { a } from "react-router-dom";
import {
  AiFillYoutube,
  AiFillInstagram,
  AiFillTwitterCircle,
} from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";
import logo from '../../../assets/logo/logo.png';

const Footer = () => {
  const socialLinks = [
    {
      icon: <BsFacebook />,
      to: "https://www.facebook.com/deepnapsoftech",
      label: "social-media",
    },
    {
      icon: <AiFillInstagram />,
      to: "https://www.instagram.com/deepnapsoftech/",
      label: "social-media",
    },
    {
      icon: <AiFillTwitterCircle />,
      to: "https://twitter.com/deepnapsoftech",
      label: "social-media",
    },
    {
      icon: <AiFillYoutube />,
      to: "https://www.youtube.com/@deepnap_softech",
      label: "social-media",
    },
  ];

  const developmentLinks = [
    { label: "Website Design", to: "/web-design" },
    { label: "Logo Design", to: "/logo-development" },
    { label: "Web Development", to: "/web-development" },
    { label: "Software Development", to: "/software" },
    { label: "App Development", to: "/app-dev" },
    { label: "CRM Development", to: "/crm-dev" },
  ];

  const marketingLinks = [
    { label: "Meta Ads", to: "/meta-ads" },
    { label: "Google Ads", to: "/google-ads" },
    { label: "Email Marketing", to: "/email-marketing" },
    { label: "Content Marketing", to: "/content-Marketing" },
    { label: "SEO & SEM", to: "/seo&smo" },
    { label: "PPC", to: "/ppc" },
  ];

  const brandLinks = [
    { label: "Brand Building", to: "/brand" },
    { label: "Public Relations", to: "/public-relation" },
    { label: "ORM", to: "/orm" },
    { label: "Digital Marketing", to: "/digital-marketing" },
    { label: "Influencer Marketing", to: "/influence" },
    { label: "Social Media Presence", to: "/socialmedia" },
  ];

  const legalLinks = [
    { label: "Book Demo", to: "/contact" },
    { label: "Privacy Policy", to: "/policy" },
    { label: "Terms & Conditions", to: "/terms" },
  ];

  return (
    <footer
      id="footer"
      style={{background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)'}}
      className="subscription-font relative text-white z-50 border-t-2 px-4 pt-4"
    >
      <div className="container flex flex-col lg:flex-row justify-between flex-wrap px-4">
        <div className="mr-16">
          <img
            src={logo}
            style={{
              width: "150px",
              height: "100px",
              aspectRatio: "4/4",
              objectFit: "cover",
              filter: "invert(1)",
            }}
            className="mr-5 h-6 sm:h-9"
            alt="logo"
          />
          {/* <p className="max-w-xs text-sm">All rights reserved</p> */}
          <div className="flex space-x-6 text-xl my-4">
            {socialLinks.map((link, index) => (
              <a
                target="_blank"
                key={index}
                className="subscription-font hover:opacity-75 text-3xl"
                rel="noreferrer"
                href={link.to}
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
          <p className="subscription-font text-xs">© 2023 Deepnap Softech</p>
        </div>
        <div className="mt-4 lg:mt-0 flex-1 justify-items-start gap-y-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {renderLinksSection("DEVELOPMENT", developmentLinks, "development")}
        {renderLinksSection(
          "DIGITAL MARKETING",
          marketingLinks,
          "digital-marketing"
        )}
        {renderLinksSection("BECOME BRAND", brandLinks, "become-a-brand")}
        {renderLinksSection("LEGAL", legalLinks)}
        </div>
      </div>
      <div className="subscription-font p-2 border-t mt-4 text-center">
        All rights reserved: Deepnap Softech Powered By Dryish ERCS
      </div>
    </footer>
  );
};

export default Footer;

const renderLinksSection = (title, links, parentRoute) => (
  <div className="col-12 col-sm-6 col-md-4 col-xl-2 mt-2">
    <p className="font-medium text-lg">{title}</p>
    <nav className="flex flex-col mt-2 space-y-2 text-sm cursor-pointer">
      {links.map((link, index) => (
        <a
          target="_blank"
          key={index}
          className="subscription-font hover:opacity-75"
          href={parentRoute ? `https://www.deepnapsoftech.com/service/${parentRoute}${link.to}` : link.to}
        >
          {link.label}
        </a>
      ))}
    </nav>
  </div>
);
