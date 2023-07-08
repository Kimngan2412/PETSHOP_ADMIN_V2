import { Box, Pagination } from "@mui/material";
import { DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid"

export default function PSDatagrid(props: any) {
  const { data, total, pageIndex, pageSize, columns, onRowsSelectionHandler, onPageChange } = props;

  return (
    <DataGrid
      autoHeight
      rowHeight={50}
      checkboxSelection
      pagination
      paginationMode="server"
      onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
      rowCount={total ?? 0}
      rowsPerPageOptions={[10]}
      hideFooterSelectedRowCount={true}
      page={pageIndex}
      pageSize={pageSize}
      rows={data ?? []}
      columns={columns}
      disableColumnSelector
      disableColumnMenu
      disableColumnFilter
      components={{
        Pagination: CustomPagination
      }}
      onPageChange={(data) => {
        onPageChange(data)
      }}
    />
  )
}

function CustomPagination() {
  const maxRowNumberInPage = 10;
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const total = apiRef.current.getRowsCount()

  return (
    <Box
      display={"flex"}
      width="100%"
      justifyContent={'space-between'}
      alignItems={"center"}
      ml={4}
    >
      <Box>
        {maxRowNumberInPage > total ? `${total}/${total}` : `${page + 1}-${maxRowNumberInPage}/${total}`}
      </Box>
      <Box>
        <Pagination
          shape='rounded'
          color='primary'
          count={pageCount}
          page={page + 1}
          onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
      </Box>
    </Box>
  );
}
