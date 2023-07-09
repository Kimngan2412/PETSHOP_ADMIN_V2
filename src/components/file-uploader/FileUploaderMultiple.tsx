// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import axios from "src/configs/axios-interceptor"

interface FileProp {
  name: string
  type: string
  size: number
}


const FileUploaderMultiple = ({ value, onChange }: any) => {
  // ** State
  const [files, setFiles] = useState<File[]>([])
  const [defaultFiles] = useState(value);

  useEffect(() => {
    const convertImageUrlToFile = async (files: any) => {
      const newFiles = []
      for (const file of files) {
        const imageUrl = `https://api.petshop.hieshop.click/${file?.url}`;
        try {
          const response = await axios.get(imageUrl, {
            responseType: 'blob', headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET',
              'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
            }
          });
          const convertedFile = new File([response.data], file?.url, { type: response.data.type });
          newFiles.push(convertedFile);
        } catch (error) {
          console.error('Error converting image URL to file:', error);
        }
      }
      setFiles(newFiles);

    }
    if (defaultFiles)
      convertImageUrlToFile(defaultFiles);
  }, [defaultFiles, value])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      const currentFiles = files;
      const dropFiles = acceptedFiles.map((file: File) => Object.assign(file))

      setFiles([...dropFiles, ...currentFiles])
      onChange && onChange([...dropFiles, ...currentFiles])
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='tabler:file-description' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
    onChange && onChange([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name} style={{
      border: '1px dashed red',
      marginBottom: '6px'
    }}>
      <div className='file-details file-upload-product'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='tabler:x' fontSize={20} />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
    onChange && onChange([])
  }

  return (
    <Fragment>
      {/* <div>
        <img src="https://api.petshop.hieshop.click/uploads/images-1685593894816-792129722.jpg" alt="" />
      </div> */}
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant='h5' sx={{ mb: 2.5 }}>
            Click here to upload image !
          </Typography>
        </Box>
      </div>
      {files.length ? (
        <Fragment>
          <List>{fileList}</List>
          <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default FileUploaderMultiple
