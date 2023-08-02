import {
	Box,
	Button,
	FormControl,
	InputLabel,
	Typography,
	Select,
	MenuItem,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Article } from '@mui/icons-material';

export const MyToolbar = ({ addUser, carOption, carId, setCarId }) => {
	const TITLE = '車輛管理';

	useEffect(() => {
		setCarId(carId);
	}, [carId]);

	const handleChange = (event) => {
		setCarId(event.target.value);
	};

	return (
		<Box>
			<Box
				sx={{
					alignItems: 'center',
					display: 'flex',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					m: -1,
				}}>
				<Typography sx={{ m: 1 }} variant='h4'>
					{TITLE}-{carOption[carId]}
				</Typography>
				<Box sx={{ m: 1 }}>
					<FormControl sx={{ minWidth: 100 }}>
						<InputLabel id='car-number'>車牌號碼</InputLabel>
						<Select
							labelId='car-number-select-label'
							id='carNumber'
							value={carId || ''}
							label='車牌號碼'
							onChange={handleChange}
							size='small'>
							{Object.entries(carOption).map(([k, v]) => (
								<MenuItem key={k} value={k}>
									{v}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</Box>
		</Box>
	);
};
