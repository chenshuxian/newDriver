import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import {
	DataGrid,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
	GridActionsCellItem,
} from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import NewFormDialog from './customer-list-dialog-new';
import axios from 'axios';
import { CustomerListToolbar } from './customer-list-toolbar';
import { getToday, getFirstId } from '../../libs/common';
import { getStudentNumber } from '../../libs/front/user';
import { getBookTime } from '../../libs/front/trainBook';
import { deletedUser } from '../../libs/front/user';

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
	{ defaultTheme }
);

function QuickSearchToolbar(props) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<TextField
				variant='standard'
				value={props.value}
				onChange={props.onChange}
				placeholder='Search…'
				className={classes.textField}
				InputProps={{
					startAdornment: <SearchIcon fontSize='small' />,
					endAdornment: (
						<IconButton
							title='Clear'
							aria-label='Clear'
							size='small'
							style={{ visibility: props.value ? 'visible' : 'hidden' }}
							onClick={props.clearSearch}>
							<ClearIcon fontSize='small' />
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

export const CustomerListResults = ({ data }) => {
	const [searchText, setSearchText] = React.useState('');
	const [totalRows, setTotalRows] = React.useState([]);
	const [rows, setRows] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [submittedValues, setSubmittedValues] = React.useState(undefined);
	const [studentNumber, setStudentNumber] = React.useState();
	const [trainTime, setTrainTime] = React.useState();
	const trainPeriodDetail = JSON.parse(data.trainPeriodDetail);

	const handleClose = () => {
		setOpen(false);
	};

	const deleteUser = React.useCallback(
		(row) => async () => {
			const id = row.user_uuid;
			const name = row.user_name;
			const confirm = window.confirm(`確認是否刪除 ${name}`);
			let index = -1;
			if (confirm) {
				const result = await deletedUser(id);
				if (result) {
					window.alert(`${name} 刪除成功`);
					for await (const a of rows) {
						index++;
						if (a.user_uuid === id) {
							break;
						}
					}

					setRows((prevRows) => {
						return [...rows.slice(0, index), ...rows.slice(index + 1)];
					});
				} else {
					window.alert(`${name} 刪除失敗`);
				}
			}
		},
		[rows]
	);

	const editUser = React.useCallback(
		(row) => async () => {
			row.user_born = row.user_born.substr(0, 10);
			row.teacher_id =
				row.teacher_id === null ? getFirstId(data.teacher) : row.teacher_id;
			row.user_born_mg = getToday(1, row.user_born);

			if (row.train_period_id === null) {
				row.train_period_id = getFirstId(data.trainPeriod);
				row.train_period_start =
					trainPeriodDetail[`${row.train_period_id}`].train_period_start;
				row.train_period_end =
					trainPeriodDetail[`${row.train_period_id}`].train_period_end;
				row.train_period_exam =
					trainPeriodDetail[`${row.train_period_id}`].train_period_exam;
			}

			const time = await getBookTime(
				row.train_period_id,
				row.teacher_id,
				row.user_id
			);
			setTrainTime(time);

			setSubmittedValues(row);
			setOpen(true);
		},
		[]
	);

	const addUser = React.useCallback(
		() => async () => {
			let trainPeriodId = data.thisPeriod;
			let teacherId = await getFirstId(data.teacher);
			const stuNum = await getStudentNumber(trainPeriodId);
			const time = await getBookTime(trainPeriodId, teacherId);

			setStudentNumber(stuNum);
			setTrainTime(time);
			setSubmittedValues(undefined);
			setOpen(true);
		},
		[]
	);

	const columns = [
		{ field: 'train_period_name', headerName: '期別' },
		{
			field: 'teacher_id',
			headerName: '教練',
			valueFormatter: (params) => {
				return data.teacher[`${params.value}`];
			},
		},
		{ field: 'user_id', headerName: '身份證' },
		{ field: 'user_name', headerName: '姓名' },
		{
			field: 'user_gender',
			headerName: '性別',
			width: 80,
			valueFormatter: (params) => {
				return params.value == '1' ? '男' : '女';
			},
		},
		// { field: 'user_born', headerName: '出生年月',
		//   valueFormatter: (params) => {
		//     if(params.value){
		//       return params.value.substr(0,10)
		//     }
		//     return ''
		//   }
		// },
		{ field: 'user_addr', headerName: '地址', width: 300 },
		{ field: 'user_tel', headerName: '手機' },
		{
			field: 'actions',
			headerName: 'options',
			type: 'actions',
			width: 180,
			getActions: (params) => [
				<GridActionsCellItem
					icon={<DeleteIcon />}
					label='Delete'
					onClick={deleteUser(params.row)}
				/>,
				<GridActionsCellItem
					icon={<EditIcon />}
					label='Edit'
					onClick={editUser(params.row)}
				/>,
			],
		},
	];

	React.useEffect(() => {
		axios
			.get(`/api/user`)
			.then((res) => {
				const userList = res.data.userList;
				setRows(userList);
				setTotalRows(userList);
			})
			.catch((e) => console.log(`loadExamErr: ${e}`));
	}, []);

	const requestSearch = (searchValue) => {
		setSearchText(searchValue);
		const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
		const filteredRows = totalRows.filter((row) => {
			return Object.keys(row).some((field) => {
				console.log(typeof row[field] === 'string');
				return searchRegex.test(
					typeof row[field] === 'string' ? row[field].toString() : row[field]
				);
			});
		});
		setRows(filteredRows);
	};

	return (
		<>
			<CustomerListToolbar
				addUser={addUser}
				trainPeriod={data.trainPeriod}
				thisPeriod={data.thisPeriod}
			/>
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
						getRowId={(r) => r.user_id}
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
					<NewFormDialog
						handleClose={handleClose}
						open={open}
						setStudentNumber={setStudentNumber}
						studentNumber={studentNumber}
						setRows={setRows}
						setTrainTime={setTrainTime}
						trainTime={trainTime}
						data={data}
						setSubmittedValues={setSubmittedValues}
						submittedValues={submittedValues}
					/>
				</Box>
			</Box>
		</>
	);
};
