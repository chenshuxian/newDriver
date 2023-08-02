import { Box, Container, Grid, Typography } from '@mui/material';
import { MCarDetail } from '../../components/dashboard/mCarDetail';
import { MCar } from '../../components/dashboard/mCar';
import { DashboardLayout } from '../../components/dashboard-layout';

import { useEffect, useState } from 'react';
import { getmCarList } from '../../libs/front/mCar';
import { MyToolbar } from '../../components/dashboard/myToolbar';

const carNumberOption = async (data) => {
	let option = {};
	data.forEach((entry) => {
		option[entry.id] = entry.car_number;
	});

	return option;
};

const Dashboard = () => {
	const [cars, setCars] = useState([]);
	const [carDetail, setCarDetail] = useState({});
	const [carOption, setCarOption] = useState({});
	const [carId, setCarId] = useState();
	const carTypeOption = { 1: '手排', 2: '自排' };
	const roadCarOption = { 1: '道駕', 2: '場內' };
	let carRows = [];
	let mapping = {};
	let option;
	useEffect(async () => {
		carRows = await getmCarList();
		option = await carNumberOption(carRows);
		carRows.forEach((entry) => {
			mapping[entry.id] = entry.mCarDetail;
		});
		setCarId(Object.keys(option)[0]);
		setCarOption(option);
		setCarDetail(mapping);
		setCars(carRows);
	}, []);
	return (
		<>
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					py: 8,
				}}>
				<Container maxWidth={false}>
					<MyToolbar carOption={carOption} carId={carId} setCarId={setCarId} />
					<Grid container spacing={3}>
						<Grid item sx={{ height: 550, width: '50%' }}>
							<MCar
								setCarId={setCarId}
								cars={cars}
								carTypeOption={carTypeOption}
								roadCarOption={roadCarOption}
								carOption={carOption}
							/>
						</Grid>
						<Grid item sx={{ height: 550, width: '50%' }}>
							<MCarDetail carDetail={carDetail} carId={carId} carOption={carOption} />
						</Grid>
					</Grid>
				</Container>
			</Box>
		</>
	);
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;

Dashboard.auth = {
	unauthorized: '/admin/login',
};
