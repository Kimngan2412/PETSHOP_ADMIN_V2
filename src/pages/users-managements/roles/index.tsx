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
import CustomChip from 'src/@core/components/mui/chip'
import { DEFAULT_PAGE, LIMIT_PAGE, SAVE_SUCCESS_MESSAGE, renderStatusString } from 'src/common'
import PSDatagrid from 'src/components/data-grid'
import { FormWrapper } from 'src/components/form-wrapper'
import PsInput from 'src/components/input'
import RowOptions from 'src/components/row-option.component'
import { DialogContext } from 'src/context/dialog-context'
import { LoadingContext } from 'src/context/loading.context'
import { ModalContext } from 'src/context/modal.context'
import { SnackbarContext } from 'src/context/snackbar.context'
import RoleComponent from 'src/pages/components/role.component'
import { AppDispatch, RootState } from 'src/store'
import { DataParams, deleteRoles, fetchData, fetchRole } from 'src/store/apps/roles'
import { RoleType } from 'src/store/apps/roles/role.type'
import * as yup from 'yup'

const schema = yup.object().shape({})

const defaultValues = {
  keyword: '',
  roleId: ''
}
const defaultFilter: DataParams = {
  keyword: '',
  status: null,
  page: DEFAULT_PAGE,
  limit: 10
}

const RolesPage = () => {
  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.roles)

  const { setLoading } = useContext(LoadingContext)
  const { openDialog, closeDialog } = useContext(DialogContext)
  const { openModal, closeModal } = useContext(ModalContext)
  const { openSnackbar } = useContext(SnackbarContext)

  const [page, setPage] = useState<number>(1)
  const [roles, setRoles] = useState<RoleType[] | undefined>()

  const [editData, setEditData] = useState<any>(null)

  const getData = (filter?: any) => {
    setLoading(true)
    dispatch(
      fetchData(!filter ? defaultFilter : filter)
    )
      .then((res: any) => {
        if (res) setRoles(store.data)
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
      page: 1,
      limit: LIMIT_PAGE
    }

    getData(filter)
  }

  const editRow = (id: number) => {
    dispatch(fetchRole(id))
      .unwrap()
      .then((response) => {
        setEditData(response)
        openModal(
          <>
            <DialogContent>
              <DialogTitle>{"Edit roles"}</DialogTitle>
              <DialogContentText id="alert-dialog-slide-description">
                <RoleComponent values={response} onSubmit={handleSubmit} onClose={handleCloseAdd} />
              </DialogContentText>
            </DialogContent>
          </>

        )
      })
      .catch((error) => {
        console.error(error)
      })
  }


  const handleDeleteRow = (id: number) => {
    setLoading(true)
    dispatch(deleteRoles(id))
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


  const handleSubmit = () => {
    closeModal();
  }

  const handleCloseAdd = () => {
    closeModal();
  }


  const handleOpenModal = () => {
    openModal(<>
      <DialogContent>
        <DialogTitle>{"Add new roles"}</DialogTitle>
        <DialogContentText id="alert-dialog-slide-description">
          <RoleComponent onSubmit={handleSubmit} onClose={handleCloseAdd} />
        </DialogContentText>
      </DialogContent>
    </>);
  }

  const deleteRow = (id: number) => {
    openDialog(
      <>
        <DialogTitle>{"Delete role?"}</DialogTitle>
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
        flex: 0.20,
        minWidth: 50,
        field: 'name',
        headerName: 'Role Name',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.roleName}
            </>
          )
        }
      },
      {
        flex: 0.20,
        minWidth: 140,
        field: 'description',
        headerName: 'Description',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.description ?? '-'}
            </>
          )
        }
      },
      {
        flex: 0.11,
        minWidth: 100,
        sortable: false,
        field: 'isActive',
        headerName: 'Status',
        renderCell: ({ row }: any) => {
          return (
            <>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={renderStatusString(row.isActive)}
                color={row.status == 1 ? 'warning' : 'success'}
                sx={{ textTransform: 'capitalize' }}
              />
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
            <RowOptions
              value={row.id} o
              onEdit={(value: any) => editRow(value)}
              onDelete={(value: any) => deleteRow(value)}
            />
          )
        }
      }
    ]
  }, [])

  useEffect(() => {
    getData()
  }, [dispatch])

  useEffect(() => {
    // renderRoleDropdown()
    //   .then(res => console.log('rolesDropDown', res))
  }, [])

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
                {/* <Grid item xs={4}>
                  <PsAutoComplete
                    size='small'
                    options={testOptions}
                    controller={{
                      fullWidth: false,
                      name: 'roleId'
                    }}
                  />
                </Grid> */}
                <Grid
                  item xs={12}
                  display={'flex'}
                  justifyContent={'end'}
                  alignItems={'end'}
                  alignContent={'end'}>
                  <Button
                    variant='outlined'
                    type='submit'
                    sx={{ mr: 3 }}
                  >Filter
                  </Button>
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

export default RolesPage
