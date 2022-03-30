import { useState } from 'react';
import {
	IconButton,
	Button,
	InputAdornment,
	TextField,
	Box,
	Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signIn } from 'next-auth/react';
import { WEBTITLE } from '../../libs/front/constText';
const UserLogin = () => {
	const [values, setValues] = useState({
		user_id: '',
		user_password: '',
		showPassword: false,
	});
	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleClickShowPassword = () => {
		setValues({
			...values,
			showPassword: !values.showPassword,
		});
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const submitData = async () => {
		let data = {
			redirect: false,
			username: values.user_id,
			password: values.user_password,
		};
		signIn('credentials', data)
			.then((data) => {
				console.log(`sigin data: ${JSON.stringify(data)}`);
			})
			.catch((e) => console.log(`signin err: ${e}`));
	};

	return (
		<Box
			component='section'
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundImage: 'url(../../static/images/car/car4.jpg)',
				minHeight: '100vh',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
			}}>
			<Grid
				container
				spacing={2}
				sx={{
					position: 'relative',
					padding: '20px',
					width: '360px',
					height: '360px',
					justifyContent: 'center',
					alignContent: 'center',
					background: 'rgba(255, 255, 255, 0.8)',
					borderRadius: '6px',
					boxShadow: '10px 5px 50px',
				}}>
				<Grid item>
					<h2>{WEBTITLE}-考試系統</h2>
				</Grid>
				<Grid item xs={12}>
					<TextField
						id='user_id'
						label='身份證'
						value={values.user_id}
						onChange={handleChange('user_id')}
						fullWidth
						variant='filled'
						inputProps={{
							maxLength: 10,
						}}
						placeholder='ex: W100382222'
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						id='user_password'
						type={values.showPassword ? 'text' : 'password'}
						value={values.user_password}
						onChange={handleChange('user_password')}
						variant='filled'
						placeholder='ex: 0850702'
						InputProps={{
							maxLength: 7,
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge='end'>
										{values.showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
						label='出生年月日'
						fullWidth
					/>
				</Grid>
				<Grid item>
					<Button variant='outlined' onClick={submitData}>
						登入
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};
export default UserLogin;
