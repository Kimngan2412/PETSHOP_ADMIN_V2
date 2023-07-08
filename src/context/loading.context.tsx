import { Backdrop, CircularProgress } from '@mui/material';
import { createContext, useState } from 'react';

export const LoadingContext = createContext<any>('');

export const LoadingProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);

  const setLoading = (value: boolean) => {
    setOpen(value);
  };

  const handleClose = (event: any) => {
    event.preventDefault()
  };

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {children}
      <Backdrop open={open} onClick={handleClose} sx={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </LoadingContext.Provider>
  );
};