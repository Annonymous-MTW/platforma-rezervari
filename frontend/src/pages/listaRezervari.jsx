import { useState, useEffect } from 'react'
import {
  DataGrid,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'
import { styled } from '@mui/material/styles'
import Pagination from '@mui/material/Pagination'
import Button from '@mui/material/Button'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';

function CustomPagination() {
  const apiRef = useGridApiContext()
  const page = useGridSelector(apiRef, gridPageSelector)
  const pageCount = useGridSelector(apiRef, gridPageCountSelector)

  return (
    <Pagination
      color='primary'
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  )
}

const vehicleOptions = [
  { value: 'ATV1', label: 'ATV CFMOTO - 1' },
  { value: 'ATV2', label: 'ATV CFMOTO - 2' },
  { value: 'ATV3', label: 'ATV CFMOTO - 3' },
  { value: 'ATV4', label: 'ATV CFMOTO - 4' },
  { value: 'BIKE1', label: 'Bicicleta Electrica - 1' },
  { value: 'BIKE2', label: 'Bicicleta Electrica - 2' },
]

const columns = [
  {
    field: 'customerName',
    headerName: 'Nume',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    flex: 1,
    cellClassName: () => 'cell-center',
  },
  {
    field: 'date',
    headerName: 'Data Rezervarii',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    flex: 1,
    valueGetter: (params) =>
      params.row.date ? new Date(params.row.date).toLocaleDateString() : '',
    cellClassName: () => 'cell-center',
  },
  {
    field: 'startTime',
    headerName: 'Start Rezervare',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    flex: 1,
    cellClassName: () => 'cell-center',
  },
  {
    field: 'endTime',
    headerName: 'Sfarsit Rezervare',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    flex: 1,
    cellClassName: () => 'cell-center',
  },
  {
    field: 'atvModel',
    headerName: 'Model Vehicul',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    flex: 1,
    cellClassName: () => 'cell-center',
    valueFormatter: ({ value }) => {
      const option = vehicleOptions.find((option) => option.value === value)
      return option ? option.label : ''
    },
  },
  {
    field: 'numarClient',
    headerName: 'Număr Client',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    flex: 1,
    cellClassName: () => 'cell-center',
  },
  {
    field: 'sumaRon',
    headerName: 'Suma Ron',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    flex: 1,
    cellClassName: () => 'cell-center',
  },
  {
    field: 'telefon',
    headerName: 'Telefon',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    flex: 1,
    cellClassName: () => 'cell-center',
  },
  
]

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color:
    theme.palette.mode === 'light'
      ? 'rgba(0,0,0,.85)'
      : 'rgba(255,255,255,0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',
  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: `1px solid ${
      theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
    }`,
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: `1px solid ${
      theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
    }`,
  },
  '& .MuiDataGrid-cell': {
    color:
      theme.palette.mode === 'light'
        ? 'rgba(0,0,0,.85)'
        : 'rgba(255,255,255,0.65)',
  },
  '& .MuiPaginationItem-root': {
    borderRadius: '50%',
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  '& .cell-center': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .MuiDataGrid-toolbarContainer': {
    justifyContent: 'center',
  },
}))

const ListaRezervari = () => {
  const [rows, setRows] = useState([])
  

  
  
  
  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations/');
      const data = await response.json();
      console.log("Fetched data:", data);  // Log fetched data
      const rowsWithId = data.map((row) => ({
        ...row,
        id: row.id || uuidv4(),
        date: new Date(row.date).toLocaleDateString('de-DE'),
      }));
      setRows(rowsWithId);
    } catch (error) {
      console.error(error);
    }
  }
  


  useEffect(() => {
    fetchReservations()
  }, [])

  const [selectedRows, setSelectedRows] = useState([])

  const handleDeleteSelectedRows = async () => {
    const selectedReservations = selectedRows.map((selectedRow) =>
      rows.find((row) => row.id === selectedRow)
    )
    const idsToDelete = selectedReservations.map(
      (reservation) => reservation._id
    )
    try {
      await axios.delete('/api/reservations/', {
        data: { ids: idsToDelete },
      })
      const remainingRows = rows.filter((row) => !idsToDelete.includes(row._id))
      setRows(remainingRows)
      setSelectedRows([])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        >
      <StyledDataGrid
        checkboxSelection
        onSelectionModelChange={(selection) => setSelectedRows(selection)}
        pagination
        pageSize={5}
        rowsPerPageOptions={[5]}
        style={{
          width: '100%',
        }}
        rows={rows}
        columns={columns}
        autoHeight
        getRowClassName={(params) => {
          return params.rowIndex % 2 === 0 ? 'blue-row' : ''
        }}
        getRowId={(row) => row.id}
        components={{
          Toolbar: GridToolbar,
          Pagination: CustomPagination,
          Footer: () =>
            selectedRows.length > 0 ? (
              <Button
                onClick={handleDeleteSelectedRows}
                variant='contained'
                style={{
                  backgroundColor: 'rgb(66, 165, 245)',
                  borderRadius: '4px',
                  margin: '10px',
                }}
              >
                Stergeti Rezervarile Selectate
              </Button>
            ) : null,
        }}
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: 'primary.light',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
        }}
      />
    </div>
  )
}

export default ListaRezervari
