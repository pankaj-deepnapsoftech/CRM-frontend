import { createContext, useContext, useReducer } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

export const notificationContext = createContext();

const NotificationContextProvider = ({ children }) => {
  const [cookies] = useCookies();

  const getNotifications = async () => {
    if(cookies?.access_token === undefined){
      return;
    }

    try {
      // setLoadingNotifications(true);
      dispatchNotificationAction({ type: "GET_NOTIFICATION" });
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "notification/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      // setNotifications(data.notifications);
      getUnseenNotificationsHandler();
      return dispatchNotificationAction({
        type: "GOT_NOTIFICATION",
        notifications: data.notifications,
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getUnseenNotificationsHandler = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "notification/unseen", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      //   setUnseenNotifications(data.unseenNotifications);
      return dispatchNotificationAction({
        type: "GET_UNSEEN_COUNT",
        unseenNotifications: data.unseen,
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const seenNotificationHandler = async () => {
    try {
      const notificationIds = notificationState.notifications.map(
        (notification) => notification._id
      );

      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "notification/seen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          notifications: notificationIds,
        }),
      });
      const data = await response.json();
      return dispatchNotificationAction({ type: "RESET_UNSEEN_COUNT" });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const default_state = {
    isLoading: false,
    unseenNotifications: 0,
    notifications: [],
  };

  const notificationReducer = (state, action) => {
    if (action.type === "GET_NOTIFICATION") {
      return {
        ...state,
        isLoading: true,
      };
    } else if (action.type === "GOT_NOTIFICATION") {
      return {
        ...state,
        isLoading: false,
        notifications: action.notifications,
      };
    } else if (action.type === "GET_UNSEEN_COUNT") {
      return {
        ...state,
        unseenNotifications: action.unseenNotifications,
      };
    } else if (action.type === "RESET_UNSEEN_COUNT") {
      return {
        ...state,
        unseenNotifications: 0,
      };
    } else {
      return {
        ...state,
      };
    }
  };

  const [notificationState, dispatchNotificationAction] = useReducer(
    notificationReducer,
    default_state
  );

  return (
    <notificationContext.Provider
      value={{
        ...notificationState,
        getNotifications,
        getUnseenNotificationsHandler,
        seenNotificationHandler,
      }}
    >
      {children}
    </notificationContext.Provider>
  );
};

export default NotificationContextProvider;
