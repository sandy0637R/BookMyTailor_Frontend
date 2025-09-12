import React, { createContext, useContext, useState, useEffect } from "react";
import { GrValidate } from "react-icons/gr";
import { FiAlertTriangle } from "react-icons/fi";

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [alertOptions, setAlertOptions] = useState({ isOpen: false, message: "" });
  const [confirmOptions, setConfirmOptions] = useState({
    isOpen: false,
    message: "",
    resolve: null,
  });

  useEffect(() => {
    window.alert = (message) => setAlertOptions({ isOpen: true, message });
    window.confirm = (message) =>
      new Promise((resolve) => setConfirmOptions({ isOpen: true, message, resolve }));
  }, []);

  const handleAlertClose = () => setAlertOptions({ isOpen: false, message: "" });
  const handleConfirm = (value) => {
    if (confirmOptions.resolve) confirmOptions.resolve(value);
    setConfirmOptions({ isOpen: false, message: "", resolve: null });
  };

  const modalWrapper =
    "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto flex justify-center w-full ";

  const modalBox =
    "bg-neutral-primary rounded-lg shadow-lg border  w-[500px] max-w-full overflow-hidden";

  const header =
    "flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-yellow-tertiary";

  const body = "px-4 py-4 text-brown-tertiary text-sm";

  const footer = "flex justify-end gap-2 px-4 py-3 bg-yellow-50 border-t border-gray-200";

  const buttonBase =
    "px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition";

  return (
    <ModalContext.Provider value={{}}>
      {children}

      {/* Alert */}
      {alertOptions.isOpen && (
        <div className={modalWrapper}>
          <div className={modalBox}>
            <div className={header}>
              <FiAlertTriangle size={20} className="text-neutral-primary" />
              <h2 className="font-medium text-neutral-primary">Alert</h2>
            </div>
            <div className={body}>{alertOptions.message}</div>
            <div className={footer}>
              <button
                className={`${buttonBase} bg-brown-primary text-neutral-primary hover:bg-brown-secondary`}
                onClick={handleAlertClose}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm */}
      {confirmOptions.isOpen && (
        <div className={modalWrapper}>
          <div className={modalBox}>
            <div className={header}>
              <GrValidate size={20} className="text-neutral-primary" />
              <h2 className="font-medium text-neutral-primary">Confirm</h2>
            </div>
            <div className={body}>{confirmOptions.message}</div>
            <div className={footer}>
              <button
                className={`${buttonBase} text-danger-secondary hover:bg-gray-100`}
                onClick={() => handleConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={`${buttonBase} bg-brown-primary text-neutral-primary hover:bg-brown-secondary`}
                onClick={() => handleConfirm(true)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
