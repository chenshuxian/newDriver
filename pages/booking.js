import { useState, useEffect } from 'react';
import {
	Box,
	Container,
	Grid,
	Card,
	Divider,
	CardHeader,
	CardContent,
	FormControl,
	InputLabel,
	Select,
	Button,
	MenuItem,
} from '@mui/material';
import {
	carTypeSelect,
	classTypeSelect,
	sourceSelect,
	timeSelect,
	postCodeSelect,
	teacherSelect,
} from '../libs/selectOption';
import { getAllowPeriod } from '../libs/trainPeriod';
import { getFirstId } from '../libs/common';
const Booking = ({ data }) => {
	const [carList, setCarList] = useState(data.carType);
	const [classList, setClassList] = useState(data.classType);
	const [carValue, setCarValue] = useState(getFirstId(data.carType));
	const [classValue, setClassValue] = useState(getFirstId(data.classType));

	const title = '線上報名預約';
	let tp = JSON.parse(data.trainPeriod);

	return (
		<>
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					py: 8,
				}}>
				<Container>
					<Card>
						<CardHeader subheader={`${title}管理`} title={title} />
						<FormControl sx={{ m: 1, width: 300 }}>
							<InputLabel id='class-type-select-label'>自排/手排</InputLabel>
							<Select
								labelId='class-type-select-label'
								id='class-type-select'
								value={carValue}
								label='自排/手排'>
								{Object.entries(carList).map(([k, v]) => (
									<MenuItem key={k} value={k}>
										{v}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl sx={{ m: 1, width: 300 }}>
							<InputLabel id='car-type-select-label'>汽車型別</InputLabel>
							<Select
								labelId='c-type-select-label'
								id='car-type-select'
								value={classValue}
								label='汽車型別'>
								{Object.entries(classList).map(([k, v]) => (
									<MenuItem key={k} value={k}>
										{v}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<Divider />
						<CardContent>
							<Grid container alignItems='center' spacing={2}>
								{tp.map((o, i) => (
									<Grid item md={6}>
										<Button
											key={i}
											sx={{ minWidth: '100%', minHeight: 60, fontSize: 18 }}
											variant='contained'
											color={i == 0 ? 'error' : 'success'}>
											{`期別: ${o['train_period_name']} 開訓: ${o['train_period_start']} 考試: ${o['train_period_exam']}`}
										</Button>
									</Grid>
								))}
							</Grid>
						</CardContent>
					</Card>
				</Container>
			</Box>
		</>
	);
};

export async function getServerSideProps(context) {
	let data = {};
	let tp = await getAllowPeriod();
	data.trainPeriod = JSON.stringify(tp);
	data.teacher = await teacherSelect();
	data.time = await timeSelect();
	data.classType = await classTypeSelect();
	data.carType = await carTypeSelect();
	data.source = await sourceSelect();
	data.postCode = await postCodeSelect();
	data.gender = { 1: '男', 2: '女' };

	if (!data) {
		return {
			notFound: true,
		};
	}

	return {
		props: { data }, // will be passed to the page component as props
	};
}

export default Booking;
