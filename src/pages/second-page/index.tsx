// ** MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { testOptions } from 'src/common'
import PsAutoComplete from 'src/components/auto-complete'
import { FormWrapper } from 'src/components/form-wrapper'
import PsInput from 'src/components/input'
import { ModalContext } from 'src/context/modal.context'
import * as yup from 'yup'
import RoleComponent from '../components/role.component'

const SecondPage = () => {
  const schema = yup.object().shape({
    name: yup
      .string()
      .min(3, "Min value")
      .required("Name is required"),
    autoComplete: yup
      .string()
      .nullable()
      .required("AutoComplete is required"),
  })
  const defaultValues = {
    name: '',
    autocomplete: ''
  }


  const {
    // control,
    formState: { }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const [value, setValue] = useState('ahihi')
  const [dropdownValue, setDropdownValue] = useState({ label: 'choose 1', value: 'PENDING' })

  const handleChangeOption = (event: any) => {
    console.log(event)
    setDropdownValue(testOptions?.find(x => x.value == event) ?? { label: 'choose 1', value: 'PENDING' })
  }

  const { openModal, closeModal } = useContext(ModalContext)
  const handleChangeValue = (event: any) => {
    console.log(event.target.value)
    setValue(event.target.value)
  }

  const handleFormSubmit = (value: any) => {
    console.log(value)
  }

  const handleCloseAdd = () => {
    closeModal();
  }

  const handleSubmit = () => {
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Input 🙌'></CardHeader>
          <CardContent>
            <PsInput
              size={'small'}
              value={value}
              onChange={(event: any) => handleChangeValue(event)}
              errorMessage="Hmmmmm"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title='Input 🙌'></CardHeader>
          <CardContent>
            <PsAutoComplete
              value={dropdownValue}
              size='small'
              options={testOptions}
              onChange={handleChangeOption}
              errorMessage="Hmmmmm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader title='Form 🙌'></CardHeader>
          <CardContent>
            <FormWrapper defaultValues={defaultValues} schema={schema} onSubmit={handleFormSubmit}>
              <PsInput
                size={'small'}
                controller={{
                  fullWidth: false,
                  name: 'name'
                }}
              />
              <Box sx={{ mb: 8 }}></Box>
              <PsAutoComplete
                size='small'
                value={2}
                options={testOptions}
                controller={{
                  fullWidth: false,
                  name: 'autoComplete'
                }}
              />
              <Button type='submit'>Submit</Button>
            </FormWrapper>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title='Form 🙌'></CardHeader>
          <CardContent>

            <Button type='button' onClick={handleOpenModal}>Open Modal</Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SecondPage

