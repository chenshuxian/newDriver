import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import {
  DataGrid,
  GridActionsCellItem
} from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import ExamFormDialog from './exam-list-dialog';
import { ExamListToolbar } from './exam-list-toolbar';
import { deletedExam } from  '../../libs/front/exam';


function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      },
      textField: {
        [theme.breakpoints.down('xs')]: {
          width: '100%',
        },
        margin: theme.spacing(1, 0.5, 1.5),
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(0.5),
        },
        '& .MuiInput-underline:before': {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      },
    }),
  { defaultTheme },
);

function QuickSearchToolbar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        className={classes.textField}
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export const ExamListResults = ({data}) => {
  
  const rowData = JSON.parse(data.exam);
  const [searchText, setSearchText] = React.useState('');
  const [totalRows, setTotalRows] = React.useState(rowData);
  const [rows, setRows] = React.useState(rowData);
  const [open, setOpen] = React.useState(false);
  const [submittedValues, setSubmittedValues] = React.useState(undefined);

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUser = React.useCallback((row) => async () => {
    const id = row.exam_id;
    const name = row.exam_title;
    const confirm = window.confirm(`確認是否刪除 ${name}`);
    let index = -1;
    if (confirm) {
      const result = await deletedExam(id);
       if (result) {
        window.alert(`${name} 刪除成功`);
        for await (const a of rows){
          index ++;
          if(a.exam_id === id){
            break;
          }
        }
      
        setRows((prevRows) => {
          return [
            ...rows.slice(0, index),
            ...rows.slice(index + 1)
          ];
        });
      } else {
        window.alert(`${name} 刪除失敗`);
      }
    }
   
   
  },[rows])

  const editUser = React.useCallback((row) => async () => {
    setSubmittedValues(row);
    setOpen(true);
  },[])

  const addUser = React.useCallback(() => async () => {
    setSubmittedValues(undefined)
    setOpen(true);
  },[])

  const columns = [
    { field: "exam_number", headerName: "題庫組別" },
    { field: "exam_title", headerName: "題目", width: 300}, 
    { field: "exam_option", headerName: "選項", width: 300 },
    { field: "exam_ans", headerName: "答案", width: 80 },
    {
      field: "actions",
      headerName: "編輯區",
      type: "actions",
      width: 180,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={deleteUser(params.row)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={editUser(params.row)}
        />,
      ]
    }
  ];

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = totalRows.filter((row) => {
      return Object.keys(row).some((field) => {
        console.log(typeof row[field] === 'string');
        return searchRegex.test(typeof row[field] === 'string' ? row[field].toString() : row[field]);
      });
    });
    setRows(filteredRows);
  };

  return (
    <>
    <ExamListToolbar addUser={addUser} />
    <Box sx={{ mt: 3 }}>
      <Box style={{ height: 550, width: '100%' }}>
        <DataGrid
           sx={{
            p: 2,
            boxShadow: 2,
            border: 2,
            borderColor: 'primary.light',
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
          components={{ Toolbar: QuickSearchToolbar }}
          getRowId={(r) => r.exam_id}
          rows={rows}
          columns={columns}
          checkboxSelection
          componentsProps={{
            toolbar: {
              value: searchText,
              onChange: (event) => requestSearch(event.target.value),
              clearSearch: () => requestSearch(''),
            },
          }}
        />
        <ExamFormDialog 
        handleClose={handleClose} 
        open={open} 
        setRows={setRows}
        data={data}
        setSubmittedValues={setSubmittedValues}
        submittedValues={submittedValues} />
      </Box>
    </Box>
    </>
  );
}


