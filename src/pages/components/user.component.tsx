import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid } from "@mui/material";
import * as _ from 'lodash';
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ERROR_MESSAGE, SAVE_SUCCESS_MESSAGE } from "src/common";
import PsAutoComplete from "src/components/auto-complete";
import { FormWrapper } from "src/components/form-wrapper";
import PsInput from "src/components/input";
import { LoadingContext } from "src/context/loading.context";
import { SnackbarContext } from "src/context/snackbar.context";
import { AppDispatch } from "src/store";
import { fetchData } from "src/store/apps/roles";
import { addEntity, updateEntity } from "src/store/apps/users";
import * as yup from 'yup';

const schema = yup.object().shape({
  userName: yup.string().required('User Name is required!'),
  email: yup.string().required('Email is required!'),
  password: yup.string().required('Password is required!'),
  firstName: yup.string().required('Frist Name is required!'),
  lastName: yup.string().required('Last Name is required!'),
  phoneNumber: yup.number().required('Phone Number is required!'),
  roleId: yup.number().required('Role is required!')
})


export default function UserComponent({ values, roles, onSubmit, onClose }: any) {
  const defaultValues = !_.isEmpty(values) ? values : {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    description: '',
    phoneNumber: '',
    roleId: ''
  }

  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const dispatch = useDispatch<AppDispatch>()
  const { setLoading } = useContext(LoadingContext)
  const { openSnackbar } = useContext(SnackbarContext)
  const [, setRolesState] = useState<any>([])
  const [role, setRole] = useState<any>({})
  const handleFormSubmit = (value: any) => {
    if (value) {
      console.log('valuee', value)
      setLoading(true)
      const updatedValue = { ...value, roleId: value.roleId }
      dispatch(!_.isEmpty(values) ? updateEntity({ id: values.id, data: updatedValue }) : addEntity({ ...value, isActive: true }))
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

  const handleChangeRole = (id: any) => {
    console.log(id)
    console.log(roles?.find((x: any) => x.value == id))
    const found = roles?.find((x: any) => x.value == id);
    if (found) {
      setRole(found);
      methods?.setValue('roleId', id)
    }
  }

  useEffect(() => {
    if (_!.isEmpty(roles))
      setRolesState(roles)
    else {
      dispatch(fetchData({
        keyword: '',
        page: 1,
        limit: 9999
      }))
        .unwrap()
        .then(() => {

          setRolesState(roles)
        })
    }

    setRole(roles?.find((x: any) => x.value == values?.role?.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  return (
    <FormWrapper methods={methods} onSubmit={handleFormSubmit}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {
            !_.isEmpty(roles) &&
            <PsAutoComplete
              label="Role"
              size='small'
              options={roles}
              value={role}
              onChange={handleChangeRole}
            />
          }
        </Grid>
        <Grid item xs={12}>
          <PsInput
            size={'small'}
            label="First Name"
            controller={{
              fullWidth: true,
              name: 'firstName'
            }}
          />
          <Box sx={{ mb: 10 }}></Box>
          <PsInput
            size={'small'}
            label="Last Name"
            controller={{
              fullWidth: true,
              name: 'lastName'
            }}
          />
          <Box sx={{ mb: 10 }}></Box>
          <PsInput
            size={'small'}
            label="User Name"
            controller={{
              fullWidth: true,
              name: 'userName'
            }}
          />
          <Box sx={{ mb: 10 }}></Box>
          <PsInput
            size={'small'}
            label="Email"
            controller={{
              fullWidth: true,
              name: 'email'
            }}
          />
          {/* <Box sx={{ mb: 10 }}></Box>
          <PsInput
            size={'small'}
            label="Description"
            controller={{
              fullWidth: true,
              name: 'description'
            }}
          /> */}
          <Box sx={{ mb: 10 }}></Box>
          <PsInput
            size={'small'}
            label="Phone Number"
            controller={{
              fullWidth: true,
              name: 'phoneNumber'
            }}
          />
          <Box sx={{ mb: 10 }}></Box>
        </Grid>

        <Grid item xs={12} display={'flex'} justifyContent={'end'}>
          <Grid item xs={6} display={'flex'} justifyContent={'end'}>
            <Button type='button' variant="outlined" color="secondary" sx={{ mr: 3 }} onClick={onClose}>Close</Button>
            <Button type='submit' variant="contained" color="primary">Submit</Button>
          </Grid>
        </Grid>
      </Grid>
    </FormWrapper>
  )
}
