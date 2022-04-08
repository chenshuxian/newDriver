import {
	Box,
	Card,
	CardHeader,
	Divider,
	CardContent,
	Button,
} from '@mui/material';

const SettingsTime = () => {
	return (
		<Card>
			<CardHeader subheader='上課時間管理' title='時間' />
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
export default SettingsTime;
