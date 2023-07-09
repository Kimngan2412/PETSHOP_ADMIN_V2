import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid } from "@mui/material";
import * as _ from 'lodash';
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ERROR_MESSAGE, SAVE_SUCCESS_MESSAGE } from "src/common";
import { FormWrapper } from "src/components/form-wrapper";
import PsInput from "src/components/input";
import { LoadingContext } from "src/context/loading.context";
import { SnackbarContext } from "src/context/snackbar.context";
import { AppDispatch } from "src/store";
import { addEntity, updateEntity } from "src/store/apps/roles";
import * as yup from 'yup';

const schema = yup.object().shape({
  roleName: yup.string().required('Role Name is required!'),
})

export default function RoleComponent({ values, onSubmit, onClose }: any) {
  const defaultValues = !_.isEmpty(values) ? values : {
    roleName: '',
    description: ''
  }

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
        .then(res => {
          if (res) {
            onSubmit && onSubmit()
            setLoading(false)
            openSnackbar(SAVE_SUCCESS_MESSAGE)
          }
        })
        .catch(error => {
          console.error('error', error)
          openSnackbar(ERROR_MESSAGE)
        })
    }
  }

  return (
    <FormWrapper methods={methods} onSubmit={handleFormSubmit}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
        </Grid>
        <Grid item xs={12}>
          <PsInput
            size={'small'}
            label="Role Name"
            controller={{
              fullWidth: true,
              name: 'roleName'
            }}
          />
          <Box sx={{ mb: 10 }}></Box>
          <PsInput
            size={'small'}
            label="Description"
            controller={{
              fullWidth: true,
              name: 'description'
            }}
          />
        </Grid>

        <Grid item xs={12} display={'flex'} justifyContent={'end'}>
          <Grid item xs={6} display={'flex'} justifyContent={'end'}>
            <Button type='button' variant="outlined" color="secondary" sx={{ mr: 3 }} onClick={onClose}>Close</Button>
            <Button type='submit' variant="contained" color="primary" >Submit</Button>
          </Grid>
        </Grid>
      </Grid>
    </FormWrapper>
  )
}
