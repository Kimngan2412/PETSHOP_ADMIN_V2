import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ERROR_MESSAGE, SAVE_SUCCESS_MESSAGE } from "src/common";
import { FormWrapper } from "src/components/form-wrapper";
import PsInput from "src/components/input";
import { LoadingContext } from "src/context/loading.context";
import { SnackbarContext } from "src/context/snackbar.context";
import { AppDispatch } from "src/store";

import * as _ from 'lodash';
import PsAutoComplete from "src/components/auto-complete";
import FileUploaderMultiple from "src/components/file-uploader/FileUploaderMultiple";
import { fetchAllCategories } from 'src/store/apps/categories';
import { addEntity, updateEntity } from "src/store/apps/products";
import * as yup from 'yup';

const schema = yup.object().shape({
  productName: yup.string().required('Product Name is required!'),
  originalPrice: yup.string().required('Original Price is required!'),
  size: yup.string().required('Size is required!'),
  quantity: yup.number().required('Quantity is required!'),
  categoriesId: yup.number().required('Categories is required!'),
})

export default function ProductComponent({ values, categories, onSubmit, onClose }: any) {
  const defaultValues = !_.isEmpty(values) ? values : {
    productName: '',
    description: '',
    originalPrice: '',
    size: '',
    quantity: '',
    images: '',
    categoriesId: values?.categoriesId || ''
  }

  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const dispatch = useDispatch<AppDispatch>()

  const { setLoading } = useContext(LoadingContext)
  const { openSnackbar } = useContext(SnackbarContext)
  const [productFiles, setProductFiles] = useState<File[]>([])
  const [categoryState, setCategoryState] = useState<any>([])

  const handleFormSubmit = (value: any) => {
    if (value) {
      const formData = new FormData();
      formData.append("productName", value.productName)
      formData.append("description", value.description)
      formData.append("originalPrice", value.originalPrice)
      formData.append("size", value.size)
      formData.append("quantity", value.quantity)
      formData.append("categoriesId", value.categoriesId)
      formData.append("isActive", 'true')
      for (let i = 0; i < productFiles.length; i++) {
        formData.append('images', productFiles[i]);
      }

      setLoading(true);
      dispatch(!_.isEmpty(values) ? updateEntity({ id: values.id, data: formData }) : addEntity(formData))
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

  const handleChangeFile = (files: any) => {
    setProductFiles(files)
  }

  useEffect(() => {
    if (_!.isEmpty(categories))
      setCategoryState(categories)
    else {
      dispatch(fetchAllCategories({
        keyword: '',
        page: 1,
        limit: 9999
      }))
        .unwrap()
        .then((res: any) => {

          console.log('ressssss', res)
          setCategoryState(categories)
        })

    }
  }, [values])

  return (
    <FormWrapper methods={methods} onSubmit={handleFormSubmit}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {
            !_.isEmpty(categories) &&
            <PsAutoComplete
              label="Category"
              size='small'
              options={categories}
              controller={{
                fullWidth: true,
                name: 'categoriesId'
              }}
            />
          }
        </Grid>
        <Grid item xs={12}>
          <PsInput
            size={'small'}
            label="Product Name"
            controller={{
              fullWidth: true,
              name: 'productName'
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
          <Box sx={{ mb: 10 }}></Box>
          <PsInput
            size={'small'}
            label="OriginalPrice"
            controller={{
              fullWidth: true,
              name: 'originalPrice'
            }}
          />
          <Box sx={{ mb: 10 }}></Box>
          <PsInput
            size={'small'}
            label="Size"
            controller={{
              fullWidth: true,
              name: 'size'
            }}
          />
          <Box sx={{ mb: 10 }}></Box>
          <PsInput
            size={'small'}
            label="Quantity"
            controller={{
              fullWidth: true,
              name: 'quantity'
            }}
          />
        </Grid>
        <Grid item xs={12} >
          <FileUploaderMultiple
            value={values?.images}
            onChange={handleChangeFile}
          />

        </Grid>
      </Grid>
      <Grid item xs={12} display={'flex'} justifyContent={'end'}>
        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
          <Button type='button' variant="outlined" color="secondary" sx={{ mr: 3 }} onClick={onClose}>Close</Button>
          <Button type='submit' variant="contained" color="primary" >Submit</Button>
        </Grid>
      </Grid>
    </FormWrapper >
  )
}
