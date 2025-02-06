import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useSelector } from "react-redux";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../ui/Loading";
import fb_logo from "../../assets/images/fb-logo.png";
import indiamart_logo from "../../assets/images/indiamart-logo.png";
import { FaSms } from "react-icons/fa";
import { checkAccess } from "../../utils/checkAccess";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";

const WebsiteConfiguration = () => {
  const { role, ...auth } = useSelector((state) => state.auth);
  const { isAllowed, msg } = checkAccess(auth, "website configuration");
  const [indiamartApi, setIndiamartApi] = useState();
  const [facebookApi, setFacebookApi] = useState();
  const [cookies] = useCookies();
  const baseUrl = process.env.REACT_APP_BACKEND_URL + "website-configuration/";
  const [indiamartApiLoading, setIndiamartApiLoading] = useState(false);
  const [facebookApiLoading, setFacebookApiLoading] = useState(false);
  const [smsApiLoading, setSmsApiLoading] = useState(false);
  const [emailApiLoading, setEmailApiLoading] = useState(false);

  // sms_api_key, sms_api_secret, sms_sender_id, sms_followup_template_id, sms_dealdone_template_id, sms_entity_id
  const [smsApiKey, setSmsApiKey] = useState();
  const [smsApiSecret, setSmsApiSecret] = useState();
  const [smsSenderId, setSmsSenderId] = useState();
  const [smsWelcomeTemplateId, setSmsWelcomeTemplateId] = useState();
  const [smsDealdoneTemplateId, setSmsDealdoneTemplateId] = useState();
  const [smsEntityId, setSmsEntityId] = useState();

  const [emailId, setEmailId] = useState();
  const [emailPassword, setEmailPassword] = useState();

  const fetchIndiamartApiHandler = async () => {
    try {
      setIndiamartApiLoading(true);
      const response = await fetch(baseUrl + "indiamart-api", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setIndiamartApi(data.indiamartApi);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIndiamartApiLoading(false);
    }
  };

  const fetchFacebookApiHandler = async () => {
    try {
      setFacebookApiLoading(true);
      const response = await fetch(baseUrl + "facebook-api", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setFacebookApi(data.facebookApi);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFacebookApiLoading(false);
    }
  };

  const fetchSmsApiHandler = async () => {
    try {
      setSmsApiLoading(true);
      const response = await fetch(baseUrl + "sms-api", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setSmsApiKey(data?.smsApi?.sms_api_key);
      setSmsApiSecret(data?.smsApi?.sms_api_secret);
      setSmsSenderId(data?.smsApi?.sms_sender_id);
      setSmsWelcomeTemplateId(data?.smsApi?.sms_welcome_template_id);
      setSmsDealdoneTemplateId(data?.smsApi?.sms_dealdone_template_id);
      setSmsEntityId(data?.smsApi?.sms_entity_id);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSmsApiLoading(false);
    }
  };

  const fetchEmailApiHandler = async () => {
    try {
      setEmailApiLoading(true);
      const response = await fetch(baseUrl + "email-api", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setEmailId(data?.emailApi?.email_id);
      setEmailPassword(data?.emailApi?.email_password);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEmailApiLoading(false);
    }
  };

  const updateIndiamartApiHandler = async (e) => {
    e.preventDefault();

    try {
      setIndiamartApiLoading(true);
      const response = await fetch(baseUrl + "indiamart-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          indiamartApi: indiamartApi || "",
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIndiamartApiLoading(false);
    }
  };

  const updateFacebookApiHandler = async (e) => {
    e.preventDefault();

    try {
      setFacebookApiLoading(true);
      const response = await fetch(baseUrl + "facebook-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          facebookApi: facebookApi || "",
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFacebookApiLoading(false);
    }
  };

  const updateSmsApiHandler = async (e) => {
    e.preventDefault();

    try {
      setSmsApiLoading(true);
      const response = await fetch(baseUrl + "sms-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          sms_api_key:  smsApiKey || "",
          sms_api_secret: smsApiSecret || "",
          sms_sender_id: smsSenderId || "",
          sms_welcome_template_id: smsWelcomeTemplateId || "",
          sms_dealdone_template_id: smsDealdoneTemplateId || "",
          sms_entity_id: smsEntityId || "",
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSmsApiLoading(false);
    }
  };

  const updateEmailApiHandler = async (e) => {
    e.preventDefault();

    try {
      setEmailApiLoading(true);
      const response = await fetch(baseUrl + "email-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          email_id:  emailId || "",
          email_password:  emailPassword || "",
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEmailApiLoading(false);
    }
  };

  useEffect(() => {
    if (isAllowed) {
      fetchIndiamartApiHandler();
      fetchFacebookApiHandler();
      fetchSmsApiHandler();
      fetchEmailApiHandler();
    }
  }, []);

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
          <div className="text-lg md:text-xl font-semibold items-center gap-y-1">
            {/* <span className="mr-2">
              <MdArrowBack />
            </span> */}
            CRM Configuration
          </div>

          <div className="mt-5">
            <div className="flex gap-2 text-base md:text-lg font-semibold items-center gap-y-1">
              <img className="w-[40px]" src={indiamart_logo}></img>
              <span>Indiamart API</span>
            </div>

            <div className="mt-3">
              {indiamartApiLoading && (
                <div>
                  <Loading />
                </div>
              )}
              {!indiamartApiLoading && (
                <form onSubmit={updateIndiamartApiHandler}>
                  <FormControl>
                    <FormLabel>Indiamart API</FormLabel>
                    <Input
                      value={indiamartApi}
                      onChange={(e) => setIndiamartApi(e.target.value)}
                      type="text"
                    ></Input>
                  </FormControl>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="mt-1"
                      paddingX="30px"
                      color="white"
                      backgroundColor="#1640d6"
                    >
                      Add
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex gap-2 text-base md:text-lg font-semibold items-center gap-y-1">
              <img className="w-[40px]" src={fb_logo}></img>
              <span>Facebook API</span>
            </div>

            <div className="mt-3">
              {facebookApiLoading && (
                <div>
                  <Loading />
                </div>
              )}
              {!facebookApiLoading && (
                <form onSubmit={updateFacebookApiHandler}>
                  <FormControl>
                    <FormLabel>Facebook API</FormLabel>
                    <Input
                      value={facebookApi}
                      onChange={(e) => setFacebookApi(e.target.value)}
                      type="text"
                    ></Input>
                  </FormControl>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="mt-1"
                      paddingX="30px"
                      color="white"
                      backgroundColor="#1640d6"
                    >
                      Add
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex gap-2 text-base md:text-lg font-semibold items-center gap-y-1">
              <FaSms size={40} />
              <span>SMS API</span>
            </div>

            <div className="mt-3">
              {smsApiLoading && (
                <div>
                  <Loading />
                </div>
              )}
              {!smsApiLoading && (
                <form onSubmit={updateSmsApiHandler}>
                  <FormControl className="mb-3">
                    <FormLabel>SMS API Key</FormLabel>
                    <Input
                      value={smsApiKey}
                      onChange={(e) => setSmsApiKey(e.target.value)}
                      type="text"
                    ></Input>
                  </FormControl>
                  <FormControl className="mb-3">
                    <FormLabel>SMS API Secret</FormLabel>
                    <Input
                      value={smsApiSecret}
                      onChange={(e) => setSmsApiSecret(e.target.value)}
                      type="text"
                    ></Input>
                  </FormControl>
                  <FormControl className="mb-3">
                    <FormLabel>SMS Sender ID</FormLabel>
                    <Input
                      value={smsSenderId}
                      onChange={(e) => setSmsSenderId(e.target.value)}
                      type="text"
                    ></Input>
                  </FormControl>
                  <FormControl className="mb-3">
                    <FormLabel>SMS Welcome Template ID</FormLabel>
                    <Input
                      value={smsWelcomeTemplateId}
                      onChange={(e) => setSmsWelcomeTemplateId(e.target.value)}
                      type="text"
                    ></Input>
                  </FormControl>
                  <FormControl className="mb-3">
                    <FormLabel>SMS Deal Done Template ID</FormLabel>
                    <Input
                      value={smsDealdoneTemplateId}
                      onChange={(e) => setSmsDealdoneTemplateId(e.target.value)}
                      type="text"
                    ></Input>
                  </FormControl>
                  <FormControl className="mb-3">
                    <FormLabel>SMS Entity ID</FormLabel>
                    <Input
                      value={smsEntityId}
                      onChange={(e) => setSmsEntityId(e.target.value)}
                      type="text"
                    ></Input>
                  </FormControl>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="mt-1"
                      paddingX="30px"
                      color="white"
                      backgroundColor="#1640d6"
                    >
                      Add
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex gap-2 text-base md:text-lg font-semibold items-center gap-y-1">
              <MdEmail size={40} />
              <span>Email API</span>
            </div>

            <div className="mt-3">
              {emailApiLoading && (
                <div>
                  <Loading />
                </div>
              )}
              {!emailApiLoading && (
                <form onSubmit={updateEmailApiHandler}>
                  <FormControl className="mb-3">
                    <FormLabel>Email ID</FormLabel>
                    <Input
                      value={emailId}
                      onChange={(e) => setEmailId(e.target.value)}
                      type="email"
                    ></Input>
                  </FormControl>
                  <FormControl className="mb-3">
                    <FormLabel>Email Password</FormLabel>
                    <Input
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      type="password"
                    ></Input>
                  </FormControl>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="mt-1"
                      paddingX="30px"
                      color="white"
                      backgroundColor="#1640d6"
                    >
                      Add
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WebsiteConfiguration;
