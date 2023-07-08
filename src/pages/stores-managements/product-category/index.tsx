// ** MUI Imports
import { Button } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import { useMemo } from 'react'
import { testOptions } from 'src/common'
import PsAutoComplete from 'src/components/auto-complete'
import PSDatagrid from 'src/components/data-grid'
import { FormWrapper } from 'src/components/form-wrapper'
import PsInput from 'src/components/input'
import * as yup from 'yup'

const ProductCategoryPage = () => {
  const schema = yup.object().shape({})
  const defaultValues = {
    name: '',
    roleId: ''
  }
  const handleFilterSubmit = (value: any) => {
    console.log(value)
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
              {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography noWrap sx={{ color: 'text.secondary' }}>
                  {row.value}
                </Typography>
              </Box> */}
            </>
          )
        }
      },
      {
        flex: 0.25,
        minWidth: 50,
        field: 'name',
        headerName: 'Role Name',
        renderCell: ({ row }: any) => {
          return (
            <>
              {/* <CustomChip
              rounded
              skin='light'
              size='small'
              label={renderStatusContentString(row.typeId)}
              color={proxyStatusObject[(!row.typeId || row.typeId == 0) ? 1 : row.typeId]}
              sx={{ textTransform: 'capitalize' }}
            /> */}
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
              {/* <CustomChip
              rounded
              skin='light'
              size='small'
              label={renderStatusContentString(row.typeId)}
              color={proxyStatusObject[(!row.typeId || row.typeId == 0) ? 1 : row.typeId]}
              sx={{ textTransform: 'capitalize' }}
            /> */}
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
          return <>{/* <RowOptions id={row?.id} choose={clickedAction} /> */}</>
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
            data={[]}
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

export default ProductCategoryPage
