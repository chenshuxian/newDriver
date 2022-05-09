import { Box, Container } from '@mui/material';
import { CustomerListResults } from '../../components/customer/customer-list-results';
import { DashboardLayout } from '../../components/dashboard-layout';
import { getTrainPeriod, getNearPeriod } from '../../libs/trainPeriod';
import {
	carTypeSelect,
	classTypeSelect,
	sourceSelect,
	timeSelect,
	trainPeriodSelect,
	postCodeSelect,
	teacherSelect,
} from '../../libs/selectOption';

const Customers = ({ data }) => {
	// console.log(data.trainPeriodDetail);
	return (
		<>
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					py: 8,
				}}>
				<Container maxWidth={false}>
					<Box sx={{ mt: 3 }}>
						<CustomerListResults data={data} />
					</Box>
				</Container>
			</Box>
		</>
	);
};

Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export async function getServerSideProps(context) {
	let data = {};
	let b = {};
	const train = await getTrainPeriod();
	const period = await getNearPeriod();

	data.teacher = await teacherSelect();
	data.trainPeriod = await trainPeriodSelect();
	data.time = await timeSelect();
	data.classType = await classTypeSelect();
	data.carType = await carTypeSelect();
	data.source = await sourceSelect();
	data.postCode = await postCodeSelect();
	data.gender = { 1: '男', 2: '女' };
	data.thisPeriod = period;

	// console.log(data.time);

	await train.trainPeriod.map((c) => {
		b[`${c.train_period_id}`] = c;
	}, b);

	data.trainPeriodDetail = JSON.stringify(b);

	if (!data) {
		return {
			notFound: true,
		};
	}

	return {
		props: { data }, // will be passed to the page component as props
	};
}

export default Customers;

Customers.auth = {
	unauthorized: '/admin/login',
};
