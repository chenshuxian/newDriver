import { useEffect, useState } from 'react';
import {
	Grid,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
} from '@mui/material';
import { Form } from 'react-final-form';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { createdmCar, updatedmCar } from '../../libs/front/mCar';
import { SELECTFIELD, TEXTFIELD } from '../formItem';
import CommonSnackBar from '../CommonSnackBar';
import { getToday } from '../../libs/common';

const defaultTheme = createTheme();
const useStyles = makeStyles(
	(theme) =>
		createStyles({
			root: {
				padding: theme.spacing(1, 1),
			},
		}),
	{ defaultTheme }
);

export default function NewFormDialog(props) {
	let {
		handleClose,
		open,
		car_number,
		formData,
		carTypeOption,
		roadCarOption,
		setRows,
	} = props;

	console.log(formData);

	const [snackOpen, setSnackOpen] = useState(false);
	const [msg, setMsg] = useState();
	const classes = useStyles();
	const model_title = `車輛資料管理`;

	const initialFormValues = {
		car_number,
		engin_id: '',
		hand_auto: 2,
		road_car: 1,
	};

	const [initV, setInitV] = useState(initialFormValues);

	useEffect(() => {
		if (formData) {
			setInitV(formData);
		} else {
			setInitV(initialFormValues);
		}
	}, [formData]);

	const fieldList = [
		{
			name: 'car_number',
			label: '車牌',
			type: 'text',
			xs: 4,
			required: true,
		},
		{
			name: 'engin_id',
			label: '引擎碼號',
			xs: 4,
			required: true,
		},
		{
			name: 'cc',
			label: 'CC 數',
			xs: 4,
			required: true,
		},
		{
			name: 'hand_auto',
			label: '自手排車',
			type: 'select',
			list: carTypeOption,
			xs: 4,
			required: true,
		},
		{
			name: 'road_car',
			label: '道駕車',
			type: 'select',
			list: roadCarOption,
			xs: 4,
			disabled: true,
		},
	];

	const handleSnackClose = () => {
		setSnackOpen(false);
	};

	const onSubmit = async (values, form) => {
		// const ADD = submittedValues === undefined ? true : false;
		// 刪除不必要資訊

		console.log(`submit ${JSON.stringify(values)}`);
		let formData = values;
		delete formData.mCarDetail;
		let result;

		const addRows = (result) => {
			setRows((prevRows) => {
				let newRows = [...prevRows];
				let data = result.data;
				newRows.unshift(data);
				return newRows;
			});
		};

		const resetForm = async () => {
			form.reset();
		};

		console.log(`submit ${JSON.stringify(formData.id)}`);
		if (formData.id == undefined) {
			console.log('add');
			formData.hand_auto = formData.hand_auto.toString();
			formData.createdAt = getToday();
			formData.updatedAt = getToday();
			result = await createdmCar(formData);
			if (result) {
				addRows(result);
				setSnackOpen(true);
				setMsg(`新增成功`);
				resetForm();
			    handleClose();
				
			} else {
				// console.log(`新增失敗 ${result}`);
				setSnackOpen(true);
				setMsg(`新增失敗 ${result}`);
			}
		} else {
			result = await updatedmCar(formData);
			if (result) {
				setRows((prevRows) => {
					let data = result.data;
					const rowToUpdateIndex = data.id;
					return prevRows.map((row, index) => {
						return row.id == rowToUpdateIndex ? { ...row, ...data } : row;
					});
				});
				handleClose();
				setSnackOpen(true);
				setMsg('修改完成');
			}
		}
		//JSON.stringify(values, 0, 2)
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{model_title}</DialogTitle>
				<DialogContent>
					<Form
						onSubmit={onSubmit}
						initialValues={initV}
						render={({
							form,
							handleSubmit,
							reset,
							submitting,
							pristine,
							values,
						}) => (
							<form onSubmit={handleSubmit} noValidate>
								<Grid
									container
									alignItems='center'
									spacing={2}
									className={classes.root}>
									{fieldList.map((el, i) => {
										if (el.type === 'select') {
											return <SELECTFIELD key={i} el={el} i={i} />;
										} else {
											return <TEXTFIELD key={i} el={el} i={i} />;
										}
									})}

									<Grid item style={{ marginTop: 16 }}>
										<Button
											variant='contained'
											color='primary'
											type='submit'
											disabled={submitting}>
											Submit
										</Button>
									</Grid>
								</Grid>
								{/* <Field>{fieldState => (<pre>{JSON.stringify(fieldState, undefined, 2)}</pre>)}</Field> */}
							</form>
						)}
					/>
				</DialogContent>
			</Dialog>
			<CommonSnackBar
				open={snackOpen}
				handleClose={handleSnackClose}
				msg={msg}
			/>
		</div>
	);
}
