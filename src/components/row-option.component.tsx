import { IconButton } from "@mui/material"
import Icon from 'src/@core/components/icon';

const RowOptions = ({ value, onEdit, onDelete }: any) => {
  return (
    <>
      {
        onEdit && (
          <IconButton onClick={() => onEdit(value)}>
            <Icon icon='tabler:edit' fontSize={20} />
          </IconButton>
        )
      }
      {
        onDelete && (
          <IconButton onClick={() => onDelete(value)}>
            <Icon icon='tabler:trash' fontSize={20} />
          </IconButton>
        )
      }
    </>
  )
}

export default RowOptions;