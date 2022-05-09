import {
	Box,
	Card,
	CardHeader,
	Divider,
	CardContent,
	Button,
} from '@mui/material';

const SettingsPeriod = () => {
	let title = '考試期別';
	return (
		<Card>
			<CardHeader subheader={`${title}管理`} title={title} />
			<Divider />
			<CardContent></CardContent>
		</Card>
	);
};
export default SettingsPeriod;
