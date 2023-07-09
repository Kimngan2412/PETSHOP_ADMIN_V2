// ** MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import { AxiosError } from 'axios'
import { format } from 'date-fns'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_PAGE, SAVE_SUCCESS_MESSAGE, testOptions } from 'src/common'
import PsAutoComplete from 'src/components/auto-complete'
import PSDatagrid from 'src/components/data-grid'
import { FormWrapper } from 'src/components/form-wrapper'
import PsInput from 'src/components/input'
import RowOptions from 'src/components/row-option.component'
import { DialogContext } from 'src/context/dialog-context'
import { LoadingContext } from 'src/context/loading.context'
import { ModalContext } from 'src/context/modal.context'
import { SnackbarContext } from 'src/context/snackbar.context'
import OrdersComponent from 'src/pages/components/order.component'
import { AppDispatch, RootState } from 'src/store'
import { DataParams, deleteOrder, fetchAllOrder, fetchOrder } from 'src/store/apps/orders'
import * as yup from 'yup'

const schema = yup.object().shape({})
const defaultValues = {
  keyword: '',
  ordersId: ''
}

const defaultFilter: DataParams = {
  keyword: '',
  status: null,
  page: DEFAULT_PAGE,
  limit: 10
}


const OrderPage = () => {
  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.orders)
  console.log('store', store)


  const { openDialog, closeDialog } = useContext(DialogContext)
  const [page, setPage] = useState<number>(1)
  const { openModal, closeModal } = useContext(ModalContext)
  const { openSnackbar } = useContext(SnackbarContext)
  const { setLoading } = useContext(LoadingContext)
  const [editData, setEditData] = useState<any>(null)


  const editRow = (id: number) => {
    console.log('id', id)
    dispatch(fetchOrder(id))
      .unwrap().then((response) => {
        console.log('respone', response)
        setEditData(response)
        openModal(
          <>
            <DialogContent>
              <DialogTitle>{'Detail Order'}</DialogTitle>
              <DialogContentText id="alert-dialog-slide-description">
                <OrdersComponent values={response} onSubmit={handleSubmit} onClose={handleCloseAdd} />
              </DialogContentText>
            </DialogContent>
          </>
        )
      })
  }


  const deleteRow = (id: number) => {
    openDialog(
      <>
        <DialogTitle>{"Delete Order?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure to delete this?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} variant={'outlined'} color={'secondary'}>Exit</Button>
          <Button onClick={() => handleDeleteRow(id)} variant={'contained'} color={'error'}>Agree</Button>
        </DialogActions>
      </>)
    console.log(id)
  }


  const handleSubmit = () => {
    closeModal();
  }

  const handleCloseAdd = () => {
    closeModal();
  }
  const handleDeleteRow = (id: number) => {
    setLoading(true)
    dispatch(deleteOrder(id))
      .unwrap()
      .then(() => {
        openSnackbar(SAVE_SUCCESS_MESSAGE, "success")
        closeDialog()
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false)
      })
  }



  const handleFilterSubmit = (value: any) => {
    console.log(value)
  }

  const getData = (filter?: any) => {
    console.log(filter)
    dispatch(
      fetchAllOrder(!filter ? defaultFilter : filter)
    )
      .then((res: any) => { })
      .catch((error: AxiosError<any>) => {
        console.error(error)
      })
  }

  useEffect(() => {
    getData()
  }, [dispatch])


  const columns = useMemo(() => {
    return [
      {
        flex: 0.1,
        field: 'id',
        minWidth: 50,
        headerName: 'ID',
        renderCell: ({ row }: any) => {
          console.log(row)

          return (
            <>
              {row.id}

            </>
          )
        }
      },
      {
        flex: 0.2,
        field: '',
        minWidth: 50,
        headerName: 'OrderDay',
        renderCell: ({ row }: any) => {
          const createdAt = new Date(row.createdAt);
          const formattedDate = format(createdAt, 'MMMM dd, yyyy');

          return (
            <>{formattedDate}</>
          );
        }
      },
      {
        flex: 0.2,
        minWidth: 50,
        field: 'name',
        headerName: 'Client Name',
        renderCell: ({ row }: any) => {
          const fullName = `${row.user.lastName} ${row.user.firstName}`

          return (
            <>
              {fullName}

            </>
          )
        }
      },
      {
        flex: 0.25,
        minWidth: 50,
        field: 'shipping',
        headerName: 'Shipping Status',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.shipping?.status}

            </>
          )
        }
      },
      {
        flex: 0.25,
        minWidth: 50,
        field: 'addresse',
        headerName: 'Address',
        renderCell: ({ row }: any) => {
          const address = `${row.shipping?.addresses?.streetNo} ${row.shipping?.addresses?.city}`

          return (
            <>
              {address}

            </>
          )
        }
      },
      {
        flex: 0.11,
        minWidth: 100,
        sortable: false,
        field: 'actions',
        headerName: 'Actions',
        renderCell: ({ row }: any) => {
          return (
            <>
              <RowOptions value={row.id}
                onEdit={(value: any) => editRow(value)}
                onDelete={(value: any) => deleteRow(value)} />
            </>
          )
        }
      }
    ]
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <FormWrapper
          defaultValues={defaultValues}
          schema={schema}
          onSubmit={handleFilterSubmit}>
          <Card>
            <CardHeader title='Filter'></CardHeader>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={4}>
                  <PsInput
                    size={'small'}
                    controller={{
                      fullWidth: true,
                      name: 'name'
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <PsAutoComplete
                    size='small'
                    options={testOptions}
                    controller={{
                      fullWidth: false,
                      name: 'roleId'
                    }}
                  />
                </Grid>
                <Grid
                  item xs={12}
                  display={'flex'}
                  justifyContent={'end'}
                  alignItems={'end'}
                  alignContent={'end'}>
                  <Button
                    variant='outlined'
                    type='submit'
                  >Filter</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </FormWrapper>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <PSDatagrid
            data={store.data}
            total={10}
            pageIndex={0}
            pageSize={10}
            columns={columns}
            onRowsSelectionHandler={() => { }}
            handlePageChange={() => { }}
          />
        </Card>

      </Grid>
    </Grid>
  )
}

export default OrderPage
