import {
	Box,
	Button,
	FormControl,
	InputLabel,
	Typography,
	Select,
	MenuItem,
} from '@mui/material';
import React from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { download } from '../../libs/common';
import { createCsv } from '../../libs/front/user';

export const CustomerListToolbar = ({ addUser, trainPeriod, thisPeriod }) => {
	const TITLE = '學員管理';
	const BUTTON_ONE = '建立CSV';
	const BUTTON_TWO = '下載CSV';
	const BUTTON_THREE = '新增學員';
	const [period, setPeriod] = React.useState(thisPeriod);
	const [disabled, setDisabled] = React.useState(true);
	let url = `/static/download/`;

	const handleChange = (event) => {
		const durl = `/${trainPeriod[event.target.value]}.zip`;
		setPeriod(event.target.value);
		download(durl, setDisabled);
	};

	const createCSV = () => {
		//console.log(`createcsv : ${period}`)
		createCsv(period, setDisabled);
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
					{TITLE}
				</Typography>
				<Box sx={{ m: 1 }}>
					<FormControl sx={{ minWidth: 100 }}>
						<InputLabel id='train-period'>期別</InputLabel>
						<Select
							labelId='train-period-select-label'
							id='train-period-select'
							value={period}
							label='期別'
							onChange={handleChange}
							size='small'>
							{Object.entries(trainPeriod).map(([k, v]) => (
								<MenuItem key={k} value={k}>
									{v}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Button
						startIcon={<ArticleIcon fontSize='small' />}
						sx={{ mr: 1 }}
						onClick={createCSV}>
						{BUTTON_ONE}
					</Button>
					<Button
						startIcon={<CloudDownloadIcon fontSize='small' />}
						sx={{ mr: 1 }}
						onClick={() =>
							(window.location.href = `/${trainPeriod[period]}.zip`)
						}
						disabled={disabled}>
						{BUTTON_TWO}
					</Button>
					<Button
						color='primary'
						variant='contained'
						onClick={addUser()}
						size='small'>
						{BUTTON_THREE}
					</Button>
				</Box>
			</Box>
		</Box>
	);
};
