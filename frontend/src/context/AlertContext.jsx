import React, { createContext, useState, useContext } from "react";
import { Alert } from "reactstrap";
import "../static/resources/css/Alert.css";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alertMessage, setAlertMessage] = useState("");
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(true);

    const showAlert = (message) => {
        setAlertMessage(message);
        setVisible(true);
        setOpen(true);
        setTimeout(() => setVisible(false), 4000); // Hacer invisible después de 4 segundos
        setTimeout(() => setOpen(false), 4500); // Cerrar después de 4 segundos y medio (desaparece)
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Alert isOpen={open} className={`alert-container ${!visible ? "alert-hidden" : ""}`}>
                {alertMessage}
            </Alert>
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);