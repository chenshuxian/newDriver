import { useCallback, useState, useEffect } from 'react';
import { Box, Grid, Container } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import { TeacherForm } from './teacherForm';
import { TeacherToolbar } from './teacherToolbar';
import axios from 'axios';
import { deletedTeacher } from '../../libs/front/teacher';
import CommonSnackBar from '../../components/CommonSnackBar';
import { requestSearch, QuickSearchToolbar } from '../DataGridFunction';

export const TeacherDataGrid = () => {
	const [searchText, setSearchText] = useState('');
	const [totalRows, setTotalRows] = useState([]);
	const [rows, setRows] = useState([]);
	const [open, setOpen] = useState(false);
	const [snackOpen, setSnackOpen] = useState(false);
	const [msg, setMsg] = useState();
	const [submittedValues, setSubmittedValues] = useState(undefined);

	const handleClose = () => {
		setOpen(false);
	};

	const handleSnackClose = () => {
		setSnackOpen(false);
	};

	const deleteUser = useCallback(
		(row) => async () => {
			const id = row.teacher_id;
			const name = row.teacher_name;
			const confirm = window.confirm(`確認是否刪除 ${name}`);
			let index = -1;
			if (confirm) {
				const result = await deletedTeacher(id);
				if (result) {
					// window.alert(`${name} 刪除成功`);
					setSnackOpen(true);
					setMsg(`${name} 刪除成功`);
					for await (const a of rows) {
						index++;
						if (a.teacher_id === id) {
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
			row.teacher_born = row.teacher_born.replaceAll('/', '-');
			setSubmittedValues(row);
			setOpen(true);
		},
		[]
	);

	const addUser = useCallback(
		() => async () => {
			setSubmittedValues(undefined);
			setOpen(true);
		},
		[]
	);

	const columns = [
		{ field: 'teacher_id', headerName: '教師身份證' },
		{ field: 'teacher_name', headerName: '姓名' },
		{ field: 'teacher_born', headerName: '出生年月' },
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
			],
		},
	];

	useEffect(() => {
		axios
			.get(`/api/teacher?isDelete=false`)
			.then((res) => {
				const list = res.data.teacherList;
				setRows(list);
				setTotalRows(list);
			})
			.catch((e) => console.log(`loadExamErr: ${e}`));
	}, []);

	return (
		<>
			<TeacherToolbar addUser={addUser} />
			<Grid container spacing={3} sx={{ mt: 3 }}>
				<Grid item sx={{ height: 550, width: '50%' }}>
					<TeacherForm
						handleClose={handleClose}
						open={open}
						setRows={setRows}
						setSubmittedValues={setSubmittedValues}
						submittedValues={submittedValues}
						setSnackOpen={setSnackOpen}
						setMsg={setMsg}
					/>
				</Grid>
				<Grid item sx={{ height: 550, width: '50%' }}>
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
						getRowId={(r) => r.teacher_id}
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
					<CommonSnackBar
						open={snackOpen}
						handleClose={handleSnackClose}
						msg={msg}
					/>
				</Grid>
			</Grid>
		</>
	);
};
