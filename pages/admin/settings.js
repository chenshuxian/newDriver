import Head from 'next/head';
import { Grid, Box, Container, Typography } from '@mui/material';
import { DashboardLayout } from '../../components/dashboard-layout';
import {
	SettingsTimeCk,
	SettingsCarType,
	SettingsClassType,
	SettingsPeriod,
} from '../../components/settings/';

import { getTime } from '../../libs/time';
import { getCarType } from '../../libs/carType';
import { getClassType } from '../../libs/classType';

const Settings = ({ data }) => (
	<>
		<Box
			component='main'
			sx={{
				flexGrow: 1,
				py: 8,
			}}>
			<Container>
				<Typography sx={{ mb: 3 }} variant='h4'>
					Settings
				</Typography>
				<Grid container justifyContent='center' spacing={2}>
					<Grid item xs={12} md={6}>
						<SettingsTimeCk timeList={data.timeList} />
					</Grid>
					<Grid item xs={12} md={6}>
						<SettingsCarType carList={data.carList} />
					</Grid>
					<Grid item xs={6}>
						<SettingsClassType classList={data.classList} />
					</Grid>
					<Grid item xs={6}>
						<SettingsPeriod />
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
);

Settings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export async function getServerSideProps(context) {
	let data = {};

	let time = await getTime();
	let timeList = JSON.stringify(time.time);

	let carType = await getCarType();
	let carList = JSON.stringify(carType.carType);

	let classType = await getClassType();
	let classList = JSON.stringify(classType.classType);

	data.timeList = timeList;
	data.carList = carList;
	data.classList = classList;

	if (!data) {
		return {
			notFound: true,
		};
	}

	return {
		props: { data }, // will be passed to the page component as props
	};
}

export default Settings;
