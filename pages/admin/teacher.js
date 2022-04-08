import { Box, Container } from '@mui/material';
import { DashboardLayout } from '../../components/dashboard-layout';
import { TeacherDataGrid } from '../../components/teacher/teacherDataGrid';
const Teacher = () => {
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
						<TeacherDataGrid />
					</Box>
				</Container>
			</Box>
		</>
	);
};

Teacher.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Teacher;

Teacher.auth = {
	unauthorized: '/admin/login',
};
