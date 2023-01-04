import { useState } from 'react';
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
import { getToday, getFirstId } from '../../libs/common';
import { getBookTime, getBookId } from '../../libs/front/trainBook';
import {
	createdUser,
	updatedUser,
	getStudentNumber,
	getUserById,
} from '../../libs/front/user';
import { userValidate } from '../../libs/front/validate';
import { OnBlur, OnChange } from 'react-final-form-listeners';
import { YEAR } from '../../libs/front/constText';
import { SELECTFIELD, TEXTFIELD } from '../formItem';
import CommonSnackBar from '../../components/CommonSnackBar';

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
		studentNumber,
		setTrainTime,
		trainTime,
		submittedValues,
		data,
		setRows,
		source_id,
		teacher_id,
	} = props;

	const [snackOpen, setSnackOpen] = useState(false);
	const [uuid, setUuid] = useState(undefined);
	const [msg, setMsg] = useState();

	// console.log(`newForm : ${JSON.stringify(data)}`)
	const classes = useStyles();
	const thisYear = new Date().getFullYear() - YEAR;
	const user_born = getToday();
	const user_born_mg = getToday(1, user_born);
	const trainPeriodDetail = JSON.parse(data.trainPeriodDetail);
	const car_type_id = '5220aa08-5966-11ec-a655-528abe1c4f3a';
	const class_type_id = '47398668-5967-11ec-a655-528abe1c4f3a';
	// const source_id = '0641e268-5967-11ec-a655-528abe1c4f3a';
	const user_gender = '1';
	const model_title = `會員資料管理 - ${submittedValues ? '修改' : '新增'}`;
	let ADD = false;
	let train_period_id = data.thisPeriod;
	// let teacher_id = getFirstId(data.teacher);
	let train_period_start = '';
	let train_period_end = '';
	let train_period_exam = '';
	let user_stu_num = '';
	let user_id = '';

	if (!submittedValues) {
		// 新增

		console.log(trainPeriodDetail);
		if (!trainPeriodDetail.length === 0) {
			train_period_start =
				trainPeriodDetail[`${train_period_id}`].train_period_start;
			train_period_end =
				trainPeriodDetail[`${train_period_id}`].train_period_end;
			train_period_exam =
				trainPeriodDetail[`${train_period_id}`].train_period_exam;
		}
		user_stu_num = studentNumber;
		ADD = true;
	} else {
		//提供修改登入時取得時間數據
		train_period_id = submittedValues.train_period_id;
		teacher_id = submittedValues.teacher_id;
		user_id = submittedValues.user_id;
	}

	const initialValues = {
		teacher_id,
		train_period_id,
		train_period_start,
		train_period_end,
		train_period_exam,
		user_born,
		user_born_mg,
		car_type_id,
		class_type_id,
		source_id,
		user_gender,
		user_stu_num,
	};

	const fieldList = [
		{
			name: 'train_period_id',
			label: '期別',
			type: 'select',
			list: data.trainPeriod,
			xs: 4,
			required: true,
		},
		{
			name: 'teacher_id',
			label: '教練',
			type: 'select',
			list: data.teacher,
			xs: 4,
			required: true,
		},
		{
			name: 'time_id',
			label: '訓練時間',
			type: 'select',
			list: trainTime,
			xs: 4,
			required: true,
		},
		{
			name: 'train_period_start',
			label: '訓練起始',
			type: 'text',
			xs: 4,
			disabled: true,
		},
		{
			name: 'train_period_end',
			label: '訓練結束',
			type: 'text',
			xs: 4,
			disabled: true,
		},
		{
			name: 'train_period_exam',
			label: '考試日期',
			type: 'text',
			xs: 4,
			disabled: true,
		},
		{
			name: 'car_type_id',
			label: '汽車類別',
			type: 'select',
			list: data.carType,
			xs: 4,
		},
		{
			name: 'class_type_id',
			label: '課程類別',
			type: 'select',
			list: data.classType,
			xs: 4,
		},
		{
			name: 'source_id',
			label: '報名來源',
			type: 'select',
			list: data.source,
			xs: 4,
		},
		{
			name: 'user_stu_num',
			label: '學號',
			type: 'text',
			xs: 4,
			required: true,
		},
		{
			name: 'user_id',
			label: '身份證',
			type: 'text',
			xs: 4,
			required: true,
			inputProps: { maxLength: 10 },
		},
		{ name: 'user_name', label: '姓名', type: 'text', xs: 4, required: true },
		{
			name: 'user_gender',
			label: '性別',
			type: 'select',
			list: data.gender,
			xs: 2,
		},
		{ name: 'user_born', label: '出生年月', type: 'date', xs: 6 },
		{
			name: 'user_born_mg',
			label: '民國年月',
			type: 'text',
			xs: 4,
			disabled: true,
		},
		{
			name: 'user_tel',
			label: '電話',
			type: 'text',
			type: 'tel',
			xs: 4,
			inputProps: { maxLength: 10 },
		},
		{
			name: 'user_email',
			label: '電子信箱',
			type: 'email',
			xs: 8,
			required: true,
		},
		{ name: 'post_code_id', label: '區號', type: 'text', xs: 3 },
		{ name: 'user_addr', label: '地址', type: 'text', xs: 9 },
	];

	const handleSnackClose = () => {
		setSnackOpen(false);
	};

	const onSubmit = async (values, form) => {
		// const ADD = submittedValues === undefined ? true : false;
		// 刪除不必要資訊
		let {
			teacher_id,
			time_id,
			train_period_id,
			train_period_end,
			train_period_start,
			train_period_exam,
			train_period_name,
			max_book_num,
			user_born_mg,
			is_delete,
			score,
			last_play_time,
			...submitData
		} = values;

		let user_stu_num;
		let confirm = false;
		let result;
		let source_id = submitData.source_id;

		submitData.user_born = `${values.user_born}T00:00:00Z`;
		submitData.train_book_id = await getBookId(
			train_period_id,
			teacher_id,
			time_id
		);
		submitData.user_password = values.user_born_mg.replaceAll('-', '');
		submitData.user_id = values.user_id.toUpperCase();
		// train_period_id = values.train_period_id;

		// 取得過濾後UI數據
		const getUIData = (data) => {
			data.teacher_id = teacher_id;
			if (trainPeriodDetail[`${train_period_id}`]) {
				data.train_period_name =
					trainPeriodDetail[`${train_period_id}`]?.train_period_name;
			}
			data.train_period_id = train_period_id;
			data.time_id = time_id;
			data.train_period_start = train_period_start;
			data.train_period_end = train_period_end;
			data.train_period_exam = train_period_exam;
			return data;
		};

		const addRows = (result) => {
			setRows((prevRows) => {
				let newRows = [...prevRows];
				let data = result.data;
				data = getUIData(data);
				// console.log(`setRows add : ${JSON.stringify(data)}`)
				newRows.unshift(data);
				return newRows;
			});
		};

		const resetForm = async () => {
			user_stu_num = await getStudentNumber(train_period_id, source_id);
			form.reset({
				...values,
				user_stu_num,
				user_id: '',
				user_name: '',
				time_id: '',
				user_addr: '',
				post_code_id: '',
			});
		};

		if (ADD) {
			delete submitData.user_uuid; //預防新增時出現user_uuid的bug
			result = await createdUser(submitData);
			if (result) {
				addRows(result);
				confirm = window.confirm('新增完成,是否繼續');
				if (confirm) {
					resetForm();
				} else {
					handleClose();
				}
			} else {
				// console.log(`新增失敗 ${result}`);
				setSnackOpen(true);
				setMsg(`新增失敗 ${result}`);
			}
		} else {
			result = await updatedUser(submitData);
			if (result) {
				setRows((prevRows) => {
					let data = result.data;
					const rowToUpdateIndex = data.user_uuid;

					data = getUIData(data);
					return prevRows.map((row, index) => {
						// console.log(`${row.user_id} vs ${rowToUpdateIndex}`)
						return row.user_uuid == rowToUpdateIndex
							? { ...row, ...data }
							: row;
					});
				});
				handleClose();
				setSnackOpen(true);
				setMsg('修改完成');
			}
		}
		//JSON.stringify(values, 0, 2)
	};

	const trainPeriodOnChange = async (value, form, values) => {
		if (value !== '') {
			setTrainTime(await getBookTime(value, values.teacher_id, user_id));
			let train_period_end = trainPeriodDetail[value].train_period_end;
			let train_period_start = trainPeriodDetail[value].train_period_start;
			let train_period_exam = trainPeriodDetail[value].train_period_exam;
			form.reset({
				...values,
				train_period_start,
				train_period_end,
				train_period_exam,
				train_period_id: value,
				user_stu_num: await getStudentNumber(value, values.source_id),
			});
		}
	};

	const userBornOnChange = async (value, form, values) => {
		form.reset({
			...values,
			user_born_mg: getToday(1, value),
			user_born: value,
		});
	};

	const teacherOnChange = async (value, form, values) => {
		if (value !== '') {
			let time = await getBookTime(values.train_period_id, value, user_id);
			if (time == null) {
				window.alert(`${value} 已無時間可預約，請選其他教練`);
			} else {
				setTrainTime(time);
			}
		}
	};

	const sourceOnChange = async (value, form, values) => {
		form.reset({
			...values,
			user_stu_num: await getStudentNumber(values.train_period_id, value),
		});
	};

	const postOnBlur = async (value, form, values) => {
		// console.log(`postcode : ${values.post_code_id} ${data.postCode}`)
		form.reset({
			...values,
			user_addr: data.postCode[values.post_code_id],
		});
	};

	const userIdOnBlur = async (value, form, values) => {
		let user_gender = '1';
		let gender = values.user_id?.substr(1, 1);
		if (gender == '2' || gender == '9' || gender == 'D' || gender == 'd') {
			user_gender = '2';
		}

		// checkUser is already
		// 修改id 時的bug
		let user = await getUserById(values.user_id);
		if (user?.data?.statusCode !== '404') {
			setUuid(user.user_uuid);
		}
		console.log('checkuserout' + JSON.stringify(user));
		console.log(`uuid: ${uuid}`);
		console.log(`status: ${ADD}`);
		if (uuid !== undefined || !ADD) {
			console.log(`checkuserUPDATE: ${JSON.stringify(user.user_name)}`);

			ADD = false;
			user_born = user.user_born?.substr(0, 10);
			// 修改使用者
			if (uuid !== undefined && user.user_id) {
				form.reset({
					...values,
					user_addr: user.user_addr,
					user_tel: user.user_tel,
					user_email: user.user_email,
					post_code_id: user.post_code_id,
					user_name: user.user_name,
					user_uuid: user.user_uuid,
					user_gender,
				});

				form.reset({
					...values,
					user_born,
				});
			}
		} else {
			ADD = true;
			form.reset({
				...values,
				user_gender,
			});
		}
	};

	const onReset = (f, v) => {
		// console.log(`reset : ${JSON.stringify(f)} ${JSON.stringify(v)}`);
		f.reset({
			...v,
			user_id: 1234,
		});
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{model_title}</DialogTitle>
				<DialogContent>
					<Form
						onSubmit={onSubmit}
						initialValues={submittedValues ? submittedValues : initialValues}
						validate={userValidate}
						render={({
							form,
							handleSubmit,
							reset,
							submitting,
							pristine,
							values,
						}) => (
							<form onSubmit={handleSubmit} noValidate>
								<OnChange name='train_period_id'>
									{(value) => trainPeriodOnChange(value, form, values)}
								</OnChange>
								<OnChange name='user_born'>
									{async (value) => userBornOnChange(value, form, values)}
								</OnChange>
								<OnChange name='teacher_id'>
									{async (value) => teacherOnChange(value, form, values)}
								</OnChange>
								<OnChange name='source_id'>
									{async (value) => sourceOnChange(value, form, values)}
								</OnChange>
								<OnBlur name='post_code_id'>
									{async (value) => postOnBlur(value, form, values)}
								</OnBlur>
								<OnBlur name='user_id'>
									{async (value) => userIdOnBlur(value, form, values)}
								</OnBlur>

								<Grid
									container
									alignItems='center'
									spacing={2}
									className={classes.root}>
									{fieldList.map((el, i) => {
										if (el.type === 'select') {
											if (
												values.train_period_start &&
												el.name == 'train_period_id'
											) {
												if (values.train_period_start.includes(thisYear)) {
													return <SELECTFIELD key={i} el={el} i={i} />;
												} else {
													el.type = 'text';
													el.name = 'train_period_name';
													el.disabled = true;
													return <TEXTFIELD key={i} el={el} i={i} />;
												}
											}
											return <SELECTFIELD key={i} el={el} i={i} />;
										} else {
											return <TEXTFIELD key={i} el={el} i={i} />;
										}
									})}
									<Grid item style={{ marginTop: 16 }}>
										<Button
											type='button'
											variant='contained'
											onClick={() => onReset(form, values)}
											disabled={submitting || pristine}>
											Reset
										</Button>
									</Grid>
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
