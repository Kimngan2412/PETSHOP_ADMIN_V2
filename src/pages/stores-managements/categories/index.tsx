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
import { DEFAULT_PAGE, LIMIT_PAGE, SAVE_SUCCESS_MESSAGE } from 'src/common'
import PSDatagrid from 'src/components/data-grid'
import { FormWrapper } from 'src/components/form-wrapper'
import PsInput from 'src/components/input'
import RowOptions from 'src/components/row-option.component'
import { DialogContext } from 'src/context/dialog-context'
import { LoadingContext } from 'src/context/loading.context'
import { ModalContext } from 'src/context/modal.context'
import { SnackbarContext } from 'src/context/snackbar.context'
import CategoryComponent from 'src/pages/components/category.component'
import { AppDispatch, RootState } from 'src/store'
import { DataParams, deleteCategories, fetchAllCategories, fetchCategories } from 'src/store/apps/categories'
import * as yup from 'yup'

const schema = yup.object().shape({})
const defaultValues = {
  keyword: '',
  categoriesId: ''
}

const defaultFilter: DataParams = {
  keyword: '',
  status: null,
  page: DEFAULT_PAGE,
  limit: 10
}

const CategoriesPage = () => {
  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.categories)

  const { openDialog, closeDialog } = useContext(DialogContext)
  const [page, setPage] = useState<number>(1)
  const { openModal, closeModal } = useContext(ModalContext)
  const { openSnackbar } = useContext(SnackbarContext)
  const { setLoading } = useContext(LoadingContext)
  const [, setEditData] = useState<any>(null)


  const getData = (filter?: any) => {
    console.log(filter)
    dispatch(
      fetchAllCategories(!filter ? defaultFilter : filter)
    )
      .then((res: any) => { console.log(res) })
      .catch((error: AxiosError<any>) => {
        console.error(error)
      })
  }

  const editRow = (id: number) => {
    dispatch(fetchCategories(id))
      .unwrap()
      .then((response) => {
        setEditData(response)
        openModal(
          <>
            <DialogContent>
              <DialogTitle>{"Edit category"}</DialogTitle>
              <DialogContentText id="alert-dialog-slide-description">
                <CategoryComponent values={response} onSubmit={handleSubmit} onClose={handleCloseAdd} />
              </DialogContentText>
            </DialogContent>
          </>

        )
      })
      .catch((error) => {
        console.error(error)
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
        <DialogTitle>{"Add new category"}</DialogTitle>
        <DialogContentText id="alert-dialog-slide-description">
          <CategoryComponent onSubmit={handleSubmit} onClose={handleCloseAdd} />
        </DialogContentText>
      </DialogContent>
    </>);
  }

  const deleteRow = (id: number) => {
    openDialog(
      <>
        <DialogTitle>{"Delete categories?"}</DialogTitle>
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


  const handleDeleteRow = (id: number) => {
    setLoading(true)
    dispatch(deleteCategories(id))
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
    const filter: DataParams = {
      keyword: value?.keyword,
      status: value?.status,
      page: 1,
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
        flex: 0.25,
        minWidth: 50,
        field: 'name',
        headerName: 'Category Name',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.categoriesName}
            </>
          )
        }
      },
      {
        flex: 0.25,
        minWidth: 50,
        field: 'description',
        headerName: 'Description',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.description}
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
              value={row.id}
              onEdit={(value: any) => editRow(value)}
              onDelete={(value: any) => deleteRow(value)}
            />
          )
        }
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <PSDatagrid
            data={store.data}
            total={store.total ?? 10}
            pageIndex={!page ? 0 : page - 1}
            pageSize={10}
            columns={columns}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onRowsSelectionHandler={() => { }}
            onPageChange={handlePageChange}
          />
        </Card>

      </Grid>
    </Grid>
  )
}

export default CategoriesPage
