// ** MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Grid from '@mui/material/Grid'
import _ from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { ERROR_MESSAGE, SAVE_SUCCESS_MESSAGE } from 'src/common'
import PsAutoComplete from 'src/components/auto-complete'
import { FormWrapper } from 'src/components/form-wrapper'
import PsInput from 'src/components/input'
import { LoadingContext } from 'src/context/loading.context'
import { SnackbarContext } from 'src/context/snackbar.context'
import { AppDispatch } from 'src/store'
import { addEntity, updateEntity } from 'src/store/apps/orders'
import * as yup from 'yup'

const shippingOption = [
  {
    label: 'Pending', value: 'PENDING',
  },
  {
    label: 'Delivery', value: 'DELIVERY',
  },
  {
    label: 'Finish', value: 'FINISH',
  },
  {
    label: 'Rejected', value: 'REJECTED',
  }
]

const schema = yup.object().shape({})

export default function OrdersComponent({ values, onSubmit, onClose }: any) {
  const defaultValues = !_.isEmpty(values) ? values : {
    ordersId: '',
    userId: '',
    shippingId: '',
    orderDetails: '',
    address: '',
    shipping: '',
    shippingStatus: ''
  }
  console.log('defaultValues', defaultValues)
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingStatus, setShippingStatus] = useState({})

  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const dispatch = useDispatch<AppDispatch>()

  const { setLoading } = useContext(LoadingContext)
  const { openSnackbar } = useContext(SnackbarContext)

  const handleFormSubmit = (value: any) => {
    if (value) {
      setLoading(true)
      dispatch(!_.isEmpty(values) ? updateEntity({ id: values.id, data: value }) : addEntity({ ...value, isActive: true }))
        .then((res: any) => {
          if (res) {
            onSubmit && onSubmit()
            setLoading(false)
            openSnackbar(SAVE_SUCCESS_MESSAGE)
          }
        })
        .catch((error: any) => {
          console.error('error', error)
          openSnackbar(ERROR_MESSAGE)
        })
    }
  }

  const handlechangeShippingStatus = (value: any) => {
    console.log('value', value)
    methods.setValue('shippingStatus', value)
    setShippingStatus(shippingOption?.find(x => x.value === value) ?? {});
  }

  useEffect(() => {
    let totalPrice = 0;
    values.orderDetails.forEach((orderDetail: any) => {
      totalPrice +=
        parseFloat(orderDetail.totalPrice) *
        orderDetail.quantity;
    });
    const shipping = values.shipping?.status;
    methods.setValue('shippingStatus', shipping)
    setShippingStatus(shippingOption?.find(x => x.value === shipping) ?? {});
    setTotalPrice(totalPrice)
    methods.setValue('totalPrice', totalPrice)
  }, [values])


  return (
    <FormWrapper methods={methods} onSubmit={handleFormSubmit}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
        </Grid>
        <Grid item xs={12}>
          <PsInput
            size={'small'}
            label="Order Id"
            readOnly={true}

            controller={{
              fullWidth: true,
              name: 'id'
            }}
          />
          <Box sx={{ mb: 10 }}></Box>
          <PsInput
            size={'small'}
            label="Total Price"
            readOnly={true}
            controller={{
              fullWidth: true,
              name: `totalPrice`
            }}
          />
          <Box sx={{ mb: 10 }}></Box>
          <PsAutoComplete
            label="Shiping"
            size='small'
            value={shippingStatus}
            options={shippingOption}
            onChange={handlechangeShippingStatus}
          />
          <Box sx={{ mb: 10 }}></Box>
        </Grid>


        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Size</TableCell>
                  <TableCell align="right">Original Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {values.orderDetails.map((item: any) => (
                  <TableRow
                    key={item?.product?.productName}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item?.product?.productName}
                    </TableCell>
                    <TableCell align="right">{item?.quantity}</TableCell>
                    <TableCell align="right">{item?.product?.size}</TableCell>
                    <TableCell align="right">{item?.product?.originalPrice}</TableCell>

                  </TableRow>
                )
                )}

              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} display={'flex'} justifyContent={'end'}>
          <Grid item xs={6} display={'flex'} justifyContent={'end'}>
            <Button type='button' variant="outlined" color="secondary" sx={{ mr: 3 }} onClick={onClose}>Close</Button>
            <Button type='submit' variant="contained" color="primary" >Submit</Button>
          </Grid>
        </Grid>


      </Grid>
    </FormWrapper >
  )
}
