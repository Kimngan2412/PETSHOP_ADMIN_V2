import { Alert, AlertColor, Snackbar } from '@mui/material'
import { createContext, useState } from 'react'

export const SnackbarContext = createContext<any>('')

export const SnackbarProvider = ({ children }: any) => {
  const [message, setMessage] = useState('')
  const [type, setType] = useState<AlertColor>()
  const [open, setOpen] = useState(false)
  const [state] = useState<any>({
    vertical: 'top',
    horizontal: 'center'
  })
  const { vertical, horizontal } = state
  const openSnackbar = (newMessage: string, type: AlertColor) => {
    setMessage(newMessage)
    setType(type)
    setOpen(true)
  }

  const handleClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
      >
        <Alert severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
