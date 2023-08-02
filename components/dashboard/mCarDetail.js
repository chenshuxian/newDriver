import { useCallback, useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import CarDetailForm from './carDetailForm';
import { getToday, getFirstId } from '../../libs/common';
import { Button } from '@mui/material';
import { Article } from '@mui/icons-material';
import { deletedmCarDetail } from '../../libs/front/mCarDetail';
import CommonSnackBar from '../../components/CommonSnackBar';
import { requestSearch, QuickSearchToolbar } from '../DataGridFunction';

export const MCarDetail = ({ carDetail, carId, carOption }) => {
	const [rows, setRows] = useState([]);
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState();
	const [snackOpen, setSnackOpen] = useState(false);
	const [msg, setMsg] = useState();

	useEffect(() => {
		setRows(carDetail[carId] || []);
	}, [carDetail, carId]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleSnackClose = () => {
		setSnackOpen(false);
	};

	const del = useCallback(
		(row) => async () => {
			const id = row.id;
			const name = row.device;
			const confirm = window.confirm(`確認是否刪除 ${name}`);
			let index = -1;
			if (confirm) {
				const result = await deletedmCarDetail(id);
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
			setOpen(true);
		},
		[]
	);

	const columns = [
		{ field: 'device', headerName: '維修項目' },
		{ field: 'fix_date', headerName: '維修日期' },
		{ field: 'totalPrice', headerName: '維修金額' },
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
				onClick={add()}
				startIcon={<Article fontSize='small' />}
				sx={{ mr: 1 }}>
				新增維修項目
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
				getRowId={(r) => r.id}
				rows={rows}
				columns={columns}
				onSelectionModelChange={(ids) => {
					setSelectedRows(ids);
				}}
			/>
			<CarDetailForm
				handleClose={handleClose}
				setRows={setRows}
				formData={formData}
				open={open}
				carId={carId}
				carOption={carOption}
			/>
			<CommonSnackBar
				open={snackOpen}
				handleClose={handleSnackClose}
				msg={msg}
			/>
		</>
	);
};
