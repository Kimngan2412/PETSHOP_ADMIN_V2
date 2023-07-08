import { Dialog } from "@mui/material";
import { createContext, useState } from "react";

export const DialogContext = createContext<any>('');

export const DialogProvider = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [, setSx] = useState()

  const openDialog = (content: any, sx?: any) => {
    setIsOpen(true);
    setDialogContent(content);
    setSx(sx)
  };

  const closeDialog = () => {
    setIsOpen(false);
    setDialogContent(null);
  };

  return (
    <DialogContext.Provider value={{ isOpen, openDialog, closeDialog, dialogContent }}>
      {children}
      <Dialog open={isOpen} onClose={closeDialog} fullWidth >
        {dialogContent}
      </Dialog>
    </DialogContext.Provider>
  );
};