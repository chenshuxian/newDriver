import { useCallback, useState, useRef } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import CommonSnackBar from '../CommonSnackBar';
import { Box, Grid, Switch, TextField, Button } from '@mui/material';

export const CommonDataGrid = ({
	switchState,
	label,
	id,
	name,
	delFn,
	updateFn,
	createFn,
	list,
}) => {
	const [rows, setRows] = useState(list);
	const [snackOpen, setSnackOpen] = useState(false);
	const [msg, setMsg] = useState();
	const [state, setState] = useState(switchState);
	const [textValue, setTextValue] = useState('');
	const [textKey, setTextKey] = useState('');
	const textRef = useRef(null);

	let formState = textKey === '' ? '新增' : '修改';

	const handleSwitchChange = (event, id) => {
		let del = event.target.checked;
		delFn(id, del);
		setState({
			...state,
			[id]: del,
		});
	};

	const handleTextChange = (event) => {
		let text = event.target.value;
		setTextValue(text);
	};

	const handleSnackClose = () => {
		setSnackOpen(false);
	};

	const deleteCarType = useCallback(
		(row) => async () => {
			const delId = row[id];
			const delName = row[name];
			const confirm = window.confirm(`確認是否刪除 ${delName}`);
			let index = -1;
			if (confirm) {
				const result = await delFn(delId, delName, true);
				if (result) {
					setSnackOpen(true);
					setMsg(`${delName} 刪除成功`);
					for await (const a of rows) {
						index++;
						if (a[id] === delId) {
							break;
						}
					}

					setRows((prevRows) => {
						return [...rows.slice(0, index), ...rows.slice(index + 1)];
					});
				} else {
					setSnackOpen(true);
					setMsg(`${delName} 刪除失敗`);
				}
			}
		},
		[rows]
	);

	const editCarType = useCallback(
		(row) => async () => {
			setTextValue(row[name]);
			setTextKey(row[id]);
			textRef.current.focus();
		},
		[]
	);

	const submit = async () => {
		let data = { [id]: textKey, [name]: textValue };
		let result;
		if (textKey === '') {
			result = await createFn(data);
			console.log(`create JSON.stringify(result)`);
			setRows((prevRows) => {
				let newRows = [...prevRows];
				let data = result.data;
				newRows.unshift(data);
				return newRows;
			});
		} else {
			result = await updateFn(data);
			setRows((prevRows) => {
				let data = result.data;
				const rowToUpdateIndex = data[id];
				return prevRows.map((row, index) => {
					return row[id] == rowToUpdateIndex ? { ...row, ...data } : row;
				});
			});
		}

		if (result) {
			setSnackOpen(true);
			setMsg(`${formState}成功`);
			clean();
		}
	};

	const clean = () => {
		setTextKey('');
		setTextValue('');
	};

	const columns = [
		{ field: name, headerName: '名稱' },
		{
			field: id,
			headerName: '是否顯示',
			renderCell: (params) => (
				<Switch
					checked={state[params.value]}
					onChange={(event) => handleSwitchChange(event, params.value)}
					inputProps={{ 'aria-label': 'controlled' }}
				/>
			),
		},
		{
			field: 'actions',
			headerName: 'options',
			type: 'actions',
			width: 180,
			getActions: (params) => [
				<GridActionsCellItem
					icon={<Delete />}
					label='Delete'
					onClick={deleteCarType(params.row)}
				/>,
				<GridActionsCellItem
					icon={<Edit />}
					label='Edit'
					onClick={editCarType(params.row)}
				/>,
			],
		},
	];

	return (
		<Grid container direction='column' spacing={3}>
			<Grid item>
				<Grid container alignItems='center' spacing={3}>
					<Grid item>
						<Box component='form' noValidate autoComplete='off'>
							<TextField
								autoFocus
								inputRef={textRef}
								id='outlined-required'
								label={label}
								value={textValue}
								onChange={handleTextChange}
							/>
						</Box>
					</Grid>
					<Grid item>
						<Button variant='contained' onClick={submit}>
							{formState}
						</Button>
					</Grid>
					<Grid item>
						<Button variant='contained' color='error' onClick={clean}>
							清除
						</Button>
					</Grid>
				</Grid>
			</Grid>
			<Grid item sx={{ height: 550 }}>
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
					getRowId={(r) => r[id]}
					rows={rows}
					columns={columns}
				/>
				<CommonSnackBar
					open={snackOpen}
					handleClose={handleSnackClose}
					msg={msg}
				/>
			</Grid>
		</Grid>
	);
};
