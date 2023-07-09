import { Dialog } from "@mui/material";
import { createContext, useState } from "react";

export const ModalContext = createContext<any>('');

export const ModalProvider = ({ children }: any) => {

  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [, setSx] = useState()

  const openModal = (content: any, sx?: any) => {
    setIsOpen(true);
    setDialogContent(content);
    setSx(sx)
  };

  const closeModal = (event: any, reason: any) => {
    if (reason && reason == "backdropClick") {
      return;
    }

    setIsOpen(false);
    setDialogContent(null);
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, dialogContent }}>
      {children}
      <Dialog
        open={isOpen}
        onClose={closeModal}
        maxWidth='md'
      >
        {dialogContent}
      </Dialog>
    </ModalContext.Provider >
  );
};
