import { useState } from 'react';
import {
	Grid,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
} from '@mui/material';
import { Form, Field } from 'react-final-form';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { createdUser, getStudentNumber } from '../../libs/front/user';
import { OnBlur } from 'react-final-form-listeners';
import { CHECKBOX, SELECTFIELD, TEXTFIELD } from '../formItem';
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

export default function FormDialog(props) {
	const {
		handleClose,
		open,
		fieldList,
		initialValues,
		model_title,
		validate,
		onSubmit,
		postCode,
		setSnackOpen,
		snackOpen,
		msg,
	} = props;

	const classes = useStyles();
	const handleSnackClose = () => {
		setSnackOpen(false);
	};

	const postOnBlur = async (value, form, values) => {
		// console.log(`postcode : ${values.post_code_id} ${data.postCode}`)
		form.reset({
			...values,
			user_addr: postCode[values.post_code_id],
		});
	};

	const userIdOnBlur = async (value, form, values) => {
		let user_gender = '1';
		let gender = values.user_id?.substr(1, 1);
		if (gender == '2' || gender == '9' || gender == 'D' || gender == 'd') {
			user_gender = '2';
		}

		form.reset({
			...values,
			user_gender,
		});
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{model_title}</DialogTitle>
				<DialogContent dividers>
					<Form
						onSubmit={onSubmit}
						initialValues={initialValues}
						validate={validate}
						render={({
							form,
							handleSubmit,
							reset,
							submitting,
							pristine,
							values,
						}) => (
							<form onSubmit={handleSubmit} noValidate>
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
											return <SELECTFIELD key={i} el={el} i={i} />;
										} else if (el.type === 'checkbox') {
											return <CHECKBOX key={i} el={el} i={i} />;
										}
										return <TEXTFIELD key={i} el={el} i={i} />;
									})}
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
								{/* <Field>
									{(fieldState) => (
										<pre>{JSON.stringify(values, undefined, 2)}</pre>
									)}
								</Field> */}
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
