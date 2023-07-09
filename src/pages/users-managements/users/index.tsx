// ** MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import { AxiosError } from 'axios'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_PAGE, ERROR_MESSAGE, LIMIT_PAGE, SAVE_SUCCESS_MESSAGE } from 'src/common'
import PSDatagrid from 'src/components/data-grid'
import { FormWrapper } from 'src/components/form-wrapper'
import PsInput from 'src/components/input'
import RowOptions from 'src/components/row-option.component'
import { DialogContext } from 'src/context/dialog-context'
import { LoadingContext } from 'src/context/loading.context'
import { ModalContext } from 'src/context/modal.context'
import { SnackbarContext } from 'src/context/snackbar.context'
import UserComponent from 'src/pages/components/user.component'
import { AppDispatch, RootState } from 'src/store'
import { fetchData as fetchRoleData } from 'src/store/apps/roles'
import { DataParams, deleteUsers, fetchData, fetchUser } from 'src/store/apps/users'
import * as yup from 'yup'


const defaultFilter: DataParams = {
  keyword: '',
  status: null,
  page: DEFAULT_PAGE,
  limit: 10
}
const schema = yup.object().shape({})

const defaultValues = {
  keyword: '',
}


const UsersPage = () => {
  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.users)

  const { setLoading } = useContext(LoadingContext)
  const { openDialog, closeDialog } = useContext(DialogContext)
  const { openModal, closeModal } = useContext(ModalContext)
  const { openSnackbar } = useContext(SnackbarContext)

  const [page, setPage] = useState<number>(1)

  const [editData, setEditData] = useState<any>(null)
  const [users, setUsers] = useState<any>(null)
  const rolesStore = useSelector((state: RootState) => state.roles)

  const getData = (filter?: any) => {
    console.log(filter)
    dispatch(
      fetchData(!filter ? defaultFilter : filter)
    )
      .then((res: any) => {
        if (res) setUsers(store.data)
      })
      .catch((error: AxiosError<any>) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }


  const handleFilterSubmit = (value: any) => {
    const filter: DataParams = {
      keyword: value?.keyword,
      status: value?.status,
      page: DEFAULT_PAGE,
      limit: LIMIT_PAGE
    }

    getData(filter)
  }

  const handleSubmit = () => {
    closeModal();
  }

  const handleCloseAdd = () => {
    closeModal();
  }

  const deleteRow = (id: number) => {
    openDialog(
      <>
        <DialogTitle>{"Delete products?"}</DialogTitle>
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

  const handleDeleteRow = (id: number) => {
    setLoading(true)
    dispatch(deleteUsers(id))
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


  const handleOpenModal = () => {

    const roles = rolesStore?.data?.map(role => (
      {
        label: role.roleName,
        value: role.id
      }
    ))
    if (roles) {
      openModal(<>
        <DialogContent>
          <DialogTitle>{"Add new User"}</DialogTitle>
          <DialogContentText id="alert-dialog-slide-description">
            <UserComponent roles={roles} onSubmit={handleSubmit} onClose={handleCloseAdd} />
          </DialogContentText>
        </DialogContent>
      </>);
    } else {
      openSnackbar(ERROR_MESSAGE, 'error')
    }
  }

  const editRow = (id: number) => {
    dispatch(fetchRoleData({
      keyword: '',
      page: 1,
      limit: 9999
    })).unwrap().then((res: any) => {
      console.log('res111', res?.items)
      const roles = res?.items?.map((role: any) => (
        {
          label: role.roleName,
          value: role.id
        }
      ))

      dispatch(fetchUser(id))
        .unwrap()
        .then((response) => {
          setEditData(response)
          if (roles) {
            openModal(
              <>
                <DialogContent>
                  <DialogTitle>{"Edit User"}</DialogTitle>
                  <DialogContentText id="alert-dialog-slide-description">
                    <UserComponent roles={roles} values={response} onSubmit={handleSubmit} onClose={handleCloseAdd} />
                  </DialogContentText>
                </DialogContent>
              </>

            )
          }
        })
        .catch((error: any) => {
          console.error(error)
        })
    })
  }


  const handlePageChange = (event: any) => {
    console.log(event)
    setPage(event + 1)
    const { getValues } = methods;
    const keyword = getValues('keyword')
    const filter: DataParams = {
      keyword: keyword,
      status: null,
      page: event + 1,
      limit: LIMIT_PAGE
    }

    getData(filter)
  }


  const columns = useMemo(() => {
    return [
      {
        flex: 0.1,
        field: 'id',
        minWidth: 50,
        headerName: 'ID',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.id}
            </>
          )
        }
      },
      {
        flex: 0.15,
        minWidth: 50,
        field: 'userName',
        headerName: 'User Name',
        renderCell: ({ row }: any) => {
          return (
            <>
              {(row.userName ?? '-')}
            </>
          )
        }
      },
      {
        flex: 0.2,
        minWidth: 50,
        field: 'name',
        headerName: 'Full Name',
        renderCell: ({ row }: any) => {
          return (
            <>
              {(row.firstName ?? '') + " " + (row.lastName ?? '')}
            </>
          )
        }
      },
      {
        flex: 0.25,
        minWidth: 50,
        field: 'email',
        headerName: 'Email',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.email}
            </>
          )
        }
      },
      {
        flex: 0.25,
        minWidth: 50,
        field: 'roleName',
        headerName: 'Role',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.role.roleName}
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
              <RowOptions
                value={row.id}
                onEdit={(value: any) => editRow(value)}
                onDelete={(value: any) => deleteRow(value)}
              />
            </>
          )
        }
      }
    ]
  }, [])

  useEffect(() => {
    getData()
  }, [dispatch])


  useEffect(() => {
    dispatch(fetchRoleData({ keyword: '' }))
      .then((res: any) => {
        // const rolesResult = res.payload?.items
        // setRoles(rolesResult?.map((role: any) => ({
        //   label: role.roleName,
        //   value: role.id
        // })))
      })
  }, [dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <FormWrapper
          methods={methods}
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
                      name: 'keyword'
                    }}
                  />
                </Grid>
                <Grid
                  item xs={12}
                  display={'flex'}
                  justifyContent={'end'}
                  alignItems={'end'}
                  alignContent={'end'}
                >

                  <Button
                    variant='outlined'
                    type='submit'
                    sx={{ mr: 3 }}
                  >Filter</Button>
                  <Button
                    variant='contained'
                    type='submit'
                    onClick={handleOpenModal}
                  >Add</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </FormWrapper>
      </Grid>
      <Grid item xs={12}>
        <Card>
          {
            store.data && (
              <PSDatagrid
                data={store.data}
                total={store.total ?? 10}
                pageIndex={!page ? 0 : page - 1}
                pageSize={10}
                columns={columns}
                onRowsSelectionHandler={() => { }}
                onPageChange={handlePageChange}
              />
            )
          }

        </Card>

      </Grid>
    </Grid>
  )
}

export default UsersPage

// function setPage(arg0: any) {
//   throw new Error('Function not implemented.')
// }

