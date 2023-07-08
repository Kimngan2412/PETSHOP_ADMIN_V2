import { FormControl, FormHelperText, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, FieldErrors, useFormContext } from "react-hook-form";

export interface PsInputProps {
  size: 'small' | 'medium',
  label: string,
  value?: string | number,
  onChange: Function
}

export interface PsInputControllerProps {
  name: string,
  control: any;
  errors?: FieldErrors
}

export default function PsInput({
  size = 'small',
  label = 'Input Value',
  value,
  disabled = false,
  readOnly = false,
  errorMessage,
  onChange,
  controller
}: any) {
  return (
    <>
      {!controller ?
        <>
          <BaseInput
            size={size}
            value={value}
            label={label}
            disabled={disabled}
            readOnly={readOnly}
            onChange={onChange}
          />
          {errorMessage && (
            <FormHelperText sx={{ color: 'error.main', ml: '14px' }} id='validation-schema-note'>
              {errorMessage}
            </FormHelperText>
          )}
        </>
        : <PsInputController
          size={size}
          label={label}
          disabled={disabled}
          readOnly={readOnly}
          controller={controller}
        />
      }
    </>
  )
}

export const BaseInput = ({
  size = 'small',
  label = 'Input Value',
  value,
  disabled,
  readOnly,
  onChange
}
  : any) => {
  return (
    <TextField
      size={size}
      value={value}
      label={label}
      onChange={onChange}
      disabled={disabled}
      InputProps={{
        readOnly: readOnly,
      }}
    />
  )
}

const PsInputController = ({
  size = 'small',
  label = 'Input Value',
  disabled = false,
  readOnly = false,
  controller }
  : any
) => {
  const { name, fullWidth = true } = controller;
  const formContext = useFormContext();
  const [control, setControl] = useState()
  const [errors, setErrors] = useState<any>()

  useEffect(() => {
    if (formContext) {
      setControl(formContext.control as any)
      const { formState } = formContext
      setErrors(formState?.errors as any)
    }
  }, [formContext])

  return (
    <FormControl fullWidth={fullWidth}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => {
          return <BaseInput
            disabled={disabled}
            readOnly={readOnly}
            size={size}
            label={label}
            value={value}
            onChange={onChange}
          />
        }}
      />
      {errors && errors[`${name}`] && (
        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-note'>
          {errors[`${name}`]?.message}
        </FormHelperText>
      )}
    </FormControl>
  )
}
