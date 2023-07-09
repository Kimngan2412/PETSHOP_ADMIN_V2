import { Autocomplete, FormControl, FormHelperText, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { defaultOptonValue } from "src/common";

export interface WCAutoCompleteOption {
  label: string,
  value: string
}

interface IProps {
  value?: any,
  options: WCAutoCompleteOption[],
  onChange?: any,
  size?: "small" | "medium"
  label?: string,
  isRequired?: boolean
  controller?: any,
  errorMessage?: string
}

export default function PsAutoComplete(props: IProps) {
  const { options, size, label, errorMessage, controller } = props;

  const [valueChange, setValueChange] = useState(defaultOptonValue)
  const [isController, setIsController] = useState(false)

  useEffect(() => {
    setIsController(controller ? true : false)
  }, [controller])

  return (
    (options && !isController) ?
      <>
        <BaseAutoComplete
          size={size}
          label={label}
          valueChange={valueChange}
          data={options}
          setValueChange={setValueChange}
          {...props}
        />
        {
          errorMessage && <FormHelperText
            sx={{ color: 'error.main', ml: '12px' }}
            id='validation-schema-note'>
            {errorMessage}
          </FormHelperText>
        }
      </>
      : <>
        <AutoCompleteController
          size={size}
          label={label}
          data={options}
          controller={controller}
          {...props}
        />
      </>
  );
}

const BaseAutoComplete = ({
  label,
  size,
  value,
  onChange,
  options
}: any) => {

  return (
    <Autocomplete
      value={value}
      disablePortal
      id="combo-box-demo"
      size={size ?? 'medium'}
      sx={{ minWidth: 200 }}
      options={options}
      onChange={(_, newValue: any) => {
        onChange && onChange(newValue?.value == 0 ? null : newValue?.value.toString())

        // setValueChange && setValueChange(newValue)
      }}
      renderInput={(params) => {
        return <TextField {...params} label={label ? label.toString() : 'Choose'} />
      }}
    />
  )
}

const AutoCompleteController = ({
  size,
  label,
  data,
  controller,
  options,
  rest
}: any) => {
  const { name = true } = controller;
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
    <>
      <FormControl fullWidth>
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange } }) => {
            if (!value) {
              value = defaultOptonValue
            }

            return (
              <BaseAutoComplete
                size={size}
                label={label}
                value={value}
                data={data}
                options={options}
                onChange={onChange}
                {...rest}
              />
            )
          }}
        />
        {errors && errors[`${name}`] && (
          <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-note'>
            {errors[`${name}`]?.message}
          </FormHelperText>
        )}
      </FormControl >
    </>
  )
}
