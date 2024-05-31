import React, { createContext, useState } from "react";
const AdminContext = createContext({
    user: undefined
})

const AdminProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [companies, setCompanies] = useState(null)
    const [socket, setSocket] = useState(null)
    const [modalImage, setModalImage] = useState(false)
    const [modalImageContent, setModalImageContent] = useState(null)
    const [modal, setModal] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState(null)
    const [modalCallBack, setModalCallBack] = useState(null)
    const [pageState, setPageState] = useState(false);
    const [pageContent, setPageContent] = useState(null);
    const [pageTitle, setPageTitle] = useState(null);
    const [pageCallBack, setPageCallBack] = useState(null);
    const [usersList, setUsersList] = useState(null);
    const [internalChatRooms, setInternalChatRooms] = useState(null);
    return (
        < AdminContext.Provider value={{
            user, setUser,
            socket, setSocket,
            modalImage, setModalImage,
            modalImageContent, setModalImageContent,
            modal, setModal,
            modalContent, setModalContent,
            modalTitle, setModalTitle,
            modalCallBack, setModalCallBack,
            pageState, setPageState,
            pageContent, setPageContent,
            pageTitle, setPageTitle,
            pageCallBack, setPageCallBack,
            usersList, setUsersList,
            internalChatRooms, setInternalChatRooms,
            companies, setCompanies
        }}>
            {children}
        </AdminContext.Provider>
    )
}

export { AdminContext ,  AdminProvider }