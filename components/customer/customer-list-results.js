import { useCallback, useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { FolderSpecial, Delete, Edit } from '@mui/icons-material';
import NewFormDialog from './customer-list-dialog-new';
import axios from 'axios';
import { CustomerListToolbar } from './customer-list-toolbar';
import { getToday, getFirstId } from '../../libs/common';
import {
	getStudentNumber,
	deletedUser,
	getWordTemp,
} from '../../libs/front/user';
import { getBookTime } from '../../libs/front/trainBook';
import CommonSnackBar from '../../components/CommonSnackBar';
import { requestSearch, QuickSearchToolbar } from '../DataGridFunction';

export const CustomerListResults = ({ data }) => {
	const [searchText, setSearchText] = useState('');
	const [totalRows, setTotalRows] = useState([]);
	const [rows, setRows] = useState([]);
	const [open, setOpen] = useState(false);
	const [snackOpen, setSnackOpen] = useState(false);
	const [msg, setMsg] = useState();
	const [submittedValues, setSubmittedValues] = useState(undefined);
	const [studentNumber, setStudentNumber] = useState();
	const [trainTime, setTrainTime] = useState();
	const trainPeriodDetail = JSON.parse(data.trainPeriodDetail);
	let sourceId = '0641e268-5967-11ec-a655-528abe1c4f3a'; //當期

	const handleClose = () => {
		setOpen(false);
	};

	const handleSnackClose = () => {
		setSnackOpen(false);
	};

	const deleteUser = useCallback(
		(row) => async () => {
			const id = row.user_uuid;
			const name = row.user_name;
			const confirm = window.confirm(`確認是否刪除 ${name}`);
			let index = -1;
			if (confirm) {
				const result = await deletedUser(id);
				if (result) {
					// window.alert(`${name} 刪除成功`);
					setSnackOpen(true);
					setMsg(`${name} 刪除成功`);
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
					setSnackOpen(true);
					setMsg(`${name} 刪除失敗`);
				}
			}
		},
		[rows]
	);

	const editUser = useCallback(
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

	const addUser = useCallback(
		() => async () => {
			let trainPeriodId = data.thisPeriod;
			let teacherId = await getFirstId(data.teacher);
			const stuNum = await getStudentNumber(trainPeriodId, sourceId);
			const time = await getBookTime(trainPeriodId, teacherId);
			if (time == null) {
				console.log('time is null');
				let newTeacherId = await getFirstId(data.teacher, 1);
				time = await getBookTime(trainPeriodId, newTeacherId);
			}

			setStudentNumber(stuNum);
			setTrainTime(time);
			setSubmittedValues(undefined);
			setOpen(true);
		},
		[]
	);

	const contract = async (row) => {
		let url = await getWordTemp(row.user_id, 'contract');
		location.href = `/word/${url.data.url}`;
	};

	const columns = [
		{ field: 'train_period_name', headerName: '期別' },
		{ field: 'user_stu_num', headerName: '學號' },
		{
			field: 'teacher_id',
			headerName: '教練',
			valueFormatter: (params) => {
				return data.teacher[`${params.value}`];
			},
		},
		{ field: 'user_id', headerName: '身份證' },
		{ field: 'user_name', headerName: '姓名' },
		{ field: 'score', headerName: '考試成績' },
		{
			field: 'last_play_time',
			headerName: '考試時間',
			width: 150,
			valueFormatter: (params) => {
				return params.value?.substr(0, 10);
			},
		},
		{
			field: 'user_gender',
			headerName: '性別',
			width: 80,
			valueFormatter: (params) => {
				return params.value == '1' ? '男' : '女';
			},
		},

		{ field: 'user_addr', headerName: '地址', width: 300 },
		{ field: 'user_tel', headerName: '手機' },
		{
			field: 'actions',
			headerName: 'options',
			type: 'actions',
			width: 180,
			getActions: (params) => [
				<GridActionsCellItem
					icon={<Delete />}
					label='Delete'
					onClick={deleteUser(params.row)}
				/>,
				<GridActionsCellItem
					icon={<Edit />}
					label='Edit'
					onClick={editUser(params.row)}
				/>,
				<GridActionsCellItem
					icon={<FolderSpecial />}
					label='contract'
					onClick={() => contract(params.row)}
				/>,
			],
		},
	];

	useEffect(() => {
		axios
			.get(`/api/user`)
			.then((res) => {
				const userList = res.data.userList;
				setRows(userList);
				setTotalRows(userList);
			})
			.catch((e) => console.log(`loadExamErr: ${e}`));
	}, []);

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
								onChange: (event) =>
									requestSearch(
										event.target.value,
										setRows,
										setSearchText,
										totalRows
									),
								clearSearch: () =>
									requestSearch('', setRows, setSearchText, totalRows),
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
						source_id={sourceId}
					/>
					<CommonSnackBar
						open={snackOpen}
						handleClose={handleSnackClose}
						msg={msg}
					/>
				</Box>
			</Box>
		</>
	);
};
