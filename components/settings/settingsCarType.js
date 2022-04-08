import {
	Box,
	Card,
	CardHeader,
	Divider,
	CardContent,
	Button,
} from '@mui/material';

const SettingsCarType = () => {
	let title = '汽車類別';
	return (
		<Card>
			<CardHeader subheader={`${title}管理`} title={title} />
			<Divider />
			<CardContent></CardContent>
			<Divider />
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					p: 2,
				}}>
				<Button color='primary' variant='contained'>
					Update
				</Button>
			</Box>
		</Card>
	);
};
export default SettingsCarType;
