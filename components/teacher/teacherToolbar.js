import { Box, Button, Typography } from '@mui/material';

export const TeacherToolbar = ({ addUser }) => {
	const TITLE = '教師管理';

	return (
		<Box>
			<Box
				sx={{
					alignItems: 'center',
					display: 'flex',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					m: -1,
				}}>
				<Typography sx={{ m: 1 }} variant='h4'>
					{TITLE}
				</Typography>
			</Box>
		</Box>
	);
};
