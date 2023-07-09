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
import ProductComponent from 'src/pages/components/product.component'
import { AppDispatch, RootState } from 'src/store'
import { fetchAllCategories } from 'src/store/apps/categories'
import { DataParams, deleteProduct, fetchData, fetchProduct } from 'src/store/apps/products'
import * as yup from 'yup'

const schema = yup.object().shape({})
const defaultValues = {
  keyword: '',
  productId: ''
}
const defaultFilter: DataParams = {
  keyword: '',
  status: null,
  page: DEFAULT_PAGE,
  limit: 10
}

const ProductsPage = () => {
  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.products)
  const categoriesStore = useSelector((state: RootState) => state.categories)

  const [page, setPage] = useState<number>(1)
  const { openDialog, closeDialog } = useContext(DialogContext)
  const { openModal, closeModal } = useContext(ModalContext)
  const { openSnackbar } = useContext(SnackbarContext)
  const { setLoading } = useContext(LoadingContext)
  const [editData, setEditData] = useState<any>(null)
  const [categories, setCategories] = useState<any>([])
  const getData = (filter?: any) => {
    dispatch(
      fetchData(!filter ? defaultFilter : filter)
    )
      .then((res: any) => { })
      .catch((error: AxiosError<any>) => {
        console.error(error)
      })
  }

  useEffect(() => {
    if (categoriesStore) {
      const test = categoriesStore?.data?.map(category => ({
        label: category.categoriesName,
        value: category.id
      }))

      console.log('test', test)
      setCategories(test)
    }

  }, [categoriesStore?.data])


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


  const editRow = (id: number) => {
    dispatch(fetchAllCategories({
      keyword: '',
      page: 1,
      limit: 9999
    }))
      .unwrap()
      .then((res: any) => {
        const categories = res?.items?.map((category: any) => ({
          label: category.categoriesName,
          value: category.id
        }))

        dispatch(fetchProduct(id))
          .unwrap()
          .then((response) => {
            setEditData(response);
            if (categories) {
              openModal(
                <>
                  <DialogContent>
                    <DialogTitle>{"Edit product"}</DialogTitle>
                    <DialogContentText id="alert-dialog-slide-description">
                      <ProductComponent
                        categories={categories}
                        values={response}
                        onSubmit={handleSubmit}
                        onClose={handleCloseAdd}
                      />
                    </DialogContentText>
                  </DialogContent>
                </>
              );
            }
          })
          .catch((error) => {
            console.error(error);
          });

      })


  };

  const deleteRow = (id: number) => {
    openDialog(
      <>
        <DialogTitle>{"Delete Products?"}</DialogTitle>
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
    dispatch(deleteProduct(id))
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
    const categories = categoriesStore?.data?.map(category => ({
      label: category.categoriesName,
      value: category.id
    }))

    if (categories) {
      openModal(<>
        <DialogContent>
          <DialogTitle>{"Add new product"}</DialogTitle>
          <DialogContentText id="alert-dialog-slide-description">
            <ProductComponent categories={categories} onSubmit={handleSubmit} onClose={handleCloseAdd} />
          </DialogContentText>
        </DialogContent>
      </>);
    } else {
      openSnackbar(ERROR_MESSAGE, 'error')
    }

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


  const columns = useMemo(() => {
    return [
      {
        flex: 0.05,
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
        field: 'name',
        headerName: 'Product Name',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.productName}

            </>
          )
        }
      },
      {
        flex: 0.12,
        minWidth: 50,
        field: 'price',
        headerName: 'Original Price',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.originalPrice}

            </>
          )
        }
      },
      {
        flex: 0.07,
        minWidth: 50,
        field: 'size',
        headerName: 'Size',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.size}

            </>
          )
        }
      },
      {
        flex: 0.08,
        minWidth: 50,
        field: 'quantity',
        headerName: 'Quantity',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.quantity}

            </>
          )
        }
      },
      {
        flex: 0.2,
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
        flex: 0.08,
        minWidth: 50,
        field: 'status',
        headerName: 'Status',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.status}
            </>
          )
        }
      },

      {
        flex: 0.12,
        minWidth: 50,
        field: 'categoriesName',
        headerName: 'Category',
        renderCell: ({ row }: any) => {
          return (
            <>
              {row.categories && row.categories.categoriesName}
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

  // useEffect(() => {
  //   // renderRoleDropdown()
  //   //   .then(res => console.log('rolesDropDown', res))
  // }, [])

  useEffect(() => {
    dispatch(fetchAllCategories({
      keyword: '',
      page: 1,
      limit: 9999
    }))
      .then((res: any) => {
        console.log(res)
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
            onRowsSelectionHandler={() => { }}
            onPageChange={handlePageChange}
          />
        </Card>

      </Grid>
    </Grid>
  )
}

export default ProductsPage
