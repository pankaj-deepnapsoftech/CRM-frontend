import io from "socket.io-client";
import { createContext, useMemo } from "react";

const SocketContext = createContext();

const SocketProvider = ({children})=>{

    const socket = useMemo(()=> io(process.env.REACT_APP_SOCKET_URL, {withCredentials: true}), []);

    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
}

export {SocketContext, SocketProvider};