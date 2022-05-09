import { Box, Container } from '@mui/material';
import { CustomerListResults } from '../../components/customer/customer-list-results';
import { DashboardLayout } from '../../components/dashboard-layout';
import { getTeacher } from '../../libs/teacher';
import { getTrainPeriod, getNearPeriod } from '../../libs/trainPeriod';
import { getTime } from '../../libs/time';
import { getCarType } from '../../libs/carType';
import { getPostCode } from '../../libs/postCode';
import { getClassType } from '../../libs/classType';
import { getSource } from '../../libs/source';
import { objectFlat } from '../../libs/common';

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
	const t = await getTeacher({ is_delete: false });
	const time = await getTime();
	const train = await getTrainPeriod();
	const carType = await getCarType();
	const classType = await getClassType();
	const source = await getSource();
	const period = await getNearPeriod();
	const postCode = await getPostCode();

	data.teacher = await objectFlat(t.teacher, 'teacher_id', 'teacher_name');
	data.trainPeriod = await objectFlat(
		train.trainPeriod,
		'train_period_id',
		'train_period_name'
	);
	data.time = await objectFlat(time.time, 'time_id', 'time_name');
	data.classType = await objectFlat(
		classType.classType,
		'class_type_id',
		'class_type_name'
	);
	data.carType = await objectFlat(
		carType.carType,
		'car_type_id',
		'car_type_name'
	);
	data.source = await objectFlat(source.source, 'source_id', 'source_name');
	data.postCode = objectFlat(
		postCode.postCode,
		'post_code_name',
		'post_code_addr'
	);
	data.gender = { 1: '男', 2: '女' };
	data.thisPeriod = period;

	// console.log(data.time);

	await train.trainPeriod.map((c) => {
		b[`${c.train_period_id}`] = c;
	}, b);

	data.trainPeriodDetail = JSON.stringify(b);

	// console.log(`data.trainPeriodDetail==========${data.trainPeriodDetail}`)

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
