import {
	Box,
	Button,
	FormControl,
	InputLabel,
	Typography,
	Select,
	MenuItem,
} from '@mui/material';
import { useState } from 'react';
import { Article, CloudDownload } from '@mui/icons-material';
import { download } from '../../libs/common';
import { createCsv, getExamList } from '../../libs/front/user';

export const CustomerListToolbar = ({
	addUser,
	trainPeriod,
	thisPeriod,
	selectedRows,
	trainPeriodDetail,
}) => {
	const TITLE = '學員管理';
	const BUTTON_ONE = '建立CSV';
	const BUTTON_TWO = '下載CSV';
	const BUTTON_THREE = '新增學員';
	const BUTTON_FOUR = '學習記錄表';
	const EXAM_LIST = '考照清冊';
	const [period, setPeriod] = useState(thisPeriod);
	const [periodName, setPeriodName] = useState();
	const [periodExam, setPeriodExam] = useState();
	const [disabled, setDisabled] = useState(true);
	let url = `/static/download/`;

	const handleChange = (event) => {
		const name = trainPeriodDetail[event.target.value].train_period_name;
		const durl = `/${name}.zip`;
		// console.log(trainPeriodDetail[event.target.value].train_period_exam);
		setPeriod(event.target.value);
		setPeriodName(trainPeriodDetail[event.target.value].train_period_name);
		setPeriodExam(trainPeriodDetail[event.target.value].train_period_exam);
		download(durl, setDisabled);
	};

	const createCSV = () => {
		//console.log(`createcsv : ${period}`)
		createCsv(period, setDisabled);
	};

	const downExamList = async () => {
		let data = {
			per: period,
			perName: periodName,
			perExam: periodExam,
			list: selectedRows,
		};
		console.log(`getExamList: ${JSON.stringify(data)}`);
		let name = await getExamList(data);
		location.href = `/download/${name}.zip`;
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
						startIcon={<Article fontSize='small' />}
						sx={{ mr: 1 }}
						onClick={createCSV}>
						{BUTTON_ONE}
					</Button>
					<Button
						startIcon={<CloudDownload fontSize='small' />}
						sx={{ mr: 1 }}
						onClick={() =>
							(window.location.href = `/download/${trainPeriod[period]}.zip`)
						}
						disabled={disabled}>
						{BUTTON_TWO}
					</Button>
					{/* <Button startIcon={<CloudDownload fontSize='small' />} sx={{ mr: 1 }}>
						{BUTTON_FOUR}
					</Button> */}
					<Button
						startIcon={<CloudDownload fontSize='small' />}
						onClick={downExamList}
						sx={{ mr: 1 }}>
						{EXAM_LIST}
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
