import { Grid, Button } from '@mui/material';
import { Form } from 'react-final-form';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { createdTeacher, updatedTeacher } from '../../libs/front/teacher';
import { teacherValidate } from '../../libs/front/validate';
import { SELECTFIELD, TEXTFIELD } from '../formItem';
import { getToday } from '../../libs/common';
import { TodaySharp, TodayTwoTone } from '@mui/icons-material';

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

export const TeacherForm = (props) => {
	const { handleClose, submittedValues, setRows, setMsg, setSnackOpen } = props;
	// const [snackOpen, setSnackOpen] = useState(false);
	// const [msg, setMsg] = useState();
	const classes = useStyles();
	const today = getToday();

	const initialValues = {
		teacher_id: '',
		teacher_name: '',
		teacher_born: today,
	};

	const fieldList = [
		{
			name: 'teacher_id',
			label: '教練身份證',
			xs: 12,
			required: true,
			inputProps: { maxLength: 10 },
		},
		{
			name: 'teacher_name',
			label: '姓名',
			xs: 12,
			required: true,
		},
		{
			name: 'teacher_born',
			label: '出生年月',
			type: 'date',
			xs: 12,
			required: true,
		},
	];

	const onSubmit = async (values, form) => {
		const ADD = submittedValues === undefined ? true : false;
		let confirm = false;
		let result;
		let submitData = values;

		submitData.teacher_born = `${values.teacher_born}`;
		submitData.teacher_id = values.teacher_id.toUpperCase();

		const addRows = (result) => {
			setRows((prevRows) => {
				let newRows = [...prevRows];
				let data = result.data.teacher;
				// console.log(`setRows add : ${JSON.stringify(data)}`);
				newRows.unshift(data);
				return newRows;
			});
		};

		const resetForm = async () => {
			form.reset({
				...values,
				teacher_id: '',
				teacher_name: '',
				teacher_born: today,
			});
		};

		if (ADD) {
			result = await createdTeacher(submitData);
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
			result = await updatedTeacher(submitData);
			if (result) {
				setRows((prevRows) => {
					let data = result.data;
					const rowToUpdateIndex = data.teacher_id;
					return prevRows.map((row, index) => {
						// console.log(`${row.user_id} vs ${rowToUpdateIndex}`)
						return row.teacher_id == rowToUpdateIndex
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

	const onReset = (f, v) => {
		f.reset({
			...v,
			teacher_id: '',
			teacher_name: '',
			teacher_born: today,
		});
	};

	return (
		<div>
			<Form
				onSubmit={onSubmit}
				initialValues={submittedValues ? submittedValues : initialValues}
				validate={teacherValidate}
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
									type='button'
									variant='contained'
									onClick={() => onReset(form, values)}>
									清空
								</Button>
							</Grid>
							<Grid item style={{ marginTop: 16 }}>
								<Button
									variant='contained'
									color='primary'
									type='submit'
									disabled={submitting}>
									送出
								</Button>
							</Grid>
						</Grid>
						{/* <Field>{fieldState => (<pre>{JSON.stringify(fieldState, undefined, 2)}</pre>)}</Field> */}
					</form>
				)}
			/>
		</div>
	);
};
