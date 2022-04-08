import Head from 'next/head';
import { Grid, Box, Container, Typography } from '@mui/material';
import { DashboardLayout } from '../../components/dashboard-layout';
import {
	SettingsTime,
	SettingsCarType,
	SettingsClassType,
	SettingsPeriod,
} from '../../components/settings/';

const Settings = () => (
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
					<Grid item xs={6}>
						<SettingsTime />
					</Grid>
					<Grid item xs={6}>
						<SettingsCarType />
					</Grid>
					<Grid item xs={6}>
						<SettingsClassType />
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

export default Settings;
