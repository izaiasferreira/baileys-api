import React, { createContext, useState } from "react";
import { useEdgesState, useNodesState } from "reactflow";
const AppContext = createContext({
    user: undefined,
    updateUser: undefined
})

const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [companyData, setCompanyData] = useState(null)
    const [socket, setSocket] = useState(null)
    const [socketStatus, setSocketStatus] = useState(false)
    const [socketReconnectStatus, setSocketReconnectStatus] = useState(false)
    const [client, setClient] = useState({ state: false, client: null })
    const [clientsShow, setClientsShow] = useState(null)
    const [allClients, setAllClients] = useState(null)
    const [inativeClients, setInativeClients] = useState(null)
    const [chatDataBase, setChatDatabase] = useState([])
    const [sectorsList, setSectorsList] = useState([])
    const [bookmarks, setBookmarks] = useState(null)
    const [modalImage, setModalImage] = useState(false)
    const [modalImageContent, setModalImageContent] = useState(null)
    const [modal, setModal] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState(null)
    const [modalCallBack, setModalCallBack] = useState(null)
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [createAreaData, setCreateAreaData] = useState(null);
    const [pageState, setPageState] = useState(false);
    const [pageContent, setPageContent] = useState(null);
    const [pageTitle, setPageTitle] = useState(null);
    const [pageCallBack, setPageCallBack] = useState(null);
    const [assistants, setAssistants] = useState(null);
    const [syncClients, setSyncClients] = useState(true);
    const [quickMessages, setQuickMessages] = useState([]);
    const [usersList, setUsersList] = useState(null);
    const [connectionsList, setConnectionsList] = useState(null);
    const [internalChatRooms, setInternalChatRooms] = useState(null);
    const [buttonTheme, setButtonTheme] = useState(true)
    return (
        < AppContext.Provider value={{
            user, setUser,
            socket, setSocket,
            socketStatus, setSocketStatus,
            socketReconnectStatus, setSocketReconnectStatus,
            client, setClient,
            allClients, setAllClients,
            inativeClients, setInativeClients,
            modalImage, setModalImage,
            modalImageContent, setModalImageContent,
            modal, setModal,
            modalContent, setModalContent,
            modalTitle, setModalTitle,
            modalCallBack, setModalCallBack,
            bookmarks, setBookmarks,
            chatDataBase, setChatDatabase,
            sectorsList, setSectorsList,
            nodes, setNodes, onNodesChange,
            edges, setEdges, onEdgesChange,
            createAreaData, setCreateAreaData,
            pageState, setPageState,
            pageContent, setPageContent,
            pageTitle, setPageTitle,
            pageCallBack, setPageCallBack,
            assistants, setAssistants,
            syncClients, setSyncClients,
            quickMessages, setQuickMessages,
            usersList, setUsersList,
            connectionsList, setConnectionsList,
            internalChatRooms, setInternalChatRooms,
            companyData, setCompanyData,
            buttonTheme, setButtonTheme,
            clientsShow, setClientsShow
        }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }