import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Snackbar from '@mui/material/Snackbar';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import CommonSnackBar from '../../components/CommonSnackBar';

const Login = () => {
	const { data: session } = useSession();
	const [open, setOpen] = useState(false);
	const handleClose = () => {
		setOpen(false);
	};
	const [error, setError] = useState();

	useEffect(() => {
		// console.log(`admin session: ${JSON.stringify(session)}`);
		if (session?.user.isAdmin) {
			router.push('/admin');
		}
	}, [session]);

	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			name: '',
			password: '',
		},
		validationSchema: Yup.object({
			name: Yup.string().max(255).required('name is required'),
			password: Yup.string().max(255).required('Password is required'),
		}),
		onSubmit: () => {
			console.log(`form: ${JSON.stringify(formik.values)}`);
			let data = formik.values;
			data.redirect = false;
			signIn('adminLogin', data)
				.then((data) => {
					console.log(`sigin data: ${JSON.stringify(data)}`);
					if (data.error) {
						setError('帳號密碼錯誤');
						setOpen(true);
					}
				})
				.catch((e) => console.log(`signin err: ${e}`));
		},
	});

	return (
		<>
			<Box
				component='main'
				sx={{
					alignItems: 'center',
					display: 'flex',
					flexGrow: 1,
					minHeight: '100%',
				}}>
				<Container maxWidth='sm'>
					<form onSubmit={formik.handleSubmit}>
						<Box sx={{ my: 3 }}>
							<Typography color='textPrimary' variant='h4'>
								登入
							</Typography>
							<Typography color='textSecondary' gutterBottom variant='body2'>
								駕訓班管理平台
							</Typography>
						</Box>

						<TextField
							error={Boolean(formik.touched.name && formik.errors.name)}
							fullWidth
							helperText={formik.touched.name && formik.errors.name}
							label='帳號'
							margin='normal'
							name='name'
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							value={formik.values.name}
							variant='outlined'
						/>
						<TextField
							error={Boolean(formik.touched.password && formik.errors.password)}
							fullWidth
							helperText={formik.touched.password && formik.errors.password}
							label='Password'
							margin='normal'
							name='password'
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							type='password'
							value={formik.values.password}
							variant='outlined'
						/>
						<Box sx={{ py: 2 }}>
							<Button
								color='primary'
								fullWidth
								size='large'
								type='submit'
								variant='contained'>
								登入
							</Button>
						</Box>
						<div>
							<CommonSnackBar
								open={open}
								handleClose={handleClose}
								msg={error}
							/>
							{/* <Snackbar
								anchorOrigin={{ vertical, horizontal }}
								open={open}
								onClose={handleClose}
								message={error}
								key={vertical + horizontal}
							/> */}
						</div>
					</form>
				</Container>
			</Box>
		</>
	);
};

export default Login;
