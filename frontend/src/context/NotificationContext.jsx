import { createContext, useContext, useState } from "react";
import NotificationContainer from "../components/NotificationContainer";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const notify = (message, type = "info") => {
        const id = Date.now();

        setNotifications((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            remove(id);
        }, 3500);
    };

    const remove = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}

            <NotificationContainer
                notifications={notifications}
                remove={remove}
            />
        </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);
