import { useCallback, useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import NewFormDialog from './carForm';
import { Button } from '@mui/material';
import { Article } from '@mui/icons-material';
import CommonSnackBar from '../../components/CommonSnackBar';
import { requestSearch, QuickSearchToolbar } from '../DataGridFunction';
import { deletedmCar } from '../../libs/front/mCar';

export const MCar = ({ cars, setCarId, roadCarOption, carTypeOption }) => {
	const [searchText, setSearchText] = useState('');
	const [totalRows, setTotalRows] = useState([]);
	const [rows, setRows] = useState(cars);
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState();
	const [snackOpen, setSnackOpen] = useState(false);
	const [msg, setMsg] = useState();

	useEffect(() => {
		setRows(cars);
	}, [cars]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleSnackClose = () => {
		setSnackOpen(false);
	};

	const del = useCallback(
		(row) => async () => {
			const id = row.id;
			const name = row.car_number;
			const confirm = window.confirm(`確認是否刪除 ${name}`);
			let index = -1;
			if (confirm) {
				const result = await deletedmCar(id);
				if (result) {
					// window.alert(`${name} 刪除成功`);
					setSnackOpen(true);
					setMsg(`${name} 刪除成功`);
					for await (const a of rows) {
						index++;
						if (a.id === id) {
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

	const edit = useCallback(
		(row) => async () => {
			setFormData(row);
			setOpen(true);
		},
		[]
	);

	const add = useCallback(
		() => async () => {
			console.log('add')
			setOpen(true);
		},
		[]
	);

	const columns = [
		{ field: 'car_number', headerName: '車牌' },
		{
			field: 'hand_auto',
			headerName: '自手排車',
			valueFormatter: (params) => {
				return carTypeOption[params.value];
			},
		},
		{
			field: 'road_car',
			headerName: '道駕車',
			valueFormatter: (params) => {
				return roadCarOption[params.value];
			},
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
					onClick={del(params.row)}
				/>,
				<GridActionsCellItem
					icon={<Edit />}
					label='Edit'
					onClick={edit(params.row)}
				/>,
			],
		},
	];

	return (
		<>
			<Button
				startIcon={<Article fontSize='small' />}
				sx={{ mr: 1 }}
				onClick={add()}>
				新增車輛
			</Button>
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
				getRowId={(r) => r.id}
				rows={rows}
				columns={columns}
				onSelectionModelChange={(ids) => {
					setCarId(ids);
				}}
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
				setRows={setRows}
				formData={formData}
				roadCarOption={roadCarOption}
				carTypeOption={carTypeOption}
			/>
			<CommonSnackBar
				open={snackOpen}
				handleClose={handleSnackClose}
				msg={msg}
			/>
		</>
	);
};
