import { FormProvider } from "react-hook-form"

export const FormWrapper = ({
  methods,
  onSubmit,
  children,
  ref,

}
  : any) => {
  return (
    <FormProvider {...methods}>
      {
        methods &&
        <form ref={ref}
          onSubmit={methods?.handleSubmit(onSubmit)}
        >
          {children}
        </form>
      }

    </FormProvider>

  )
}
