import { signOut } from 'next-auth/react';
import styled from '@emotion/styled';
import {
	Avatar,
	AppBar,
	Box,
	Typography,
	Toolbar,
	Tooltip,
	Button,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	boxShadow: theme.shadows[3],
}));

const ExamPageToolbar = ({ userName }) => {
	const router = useRouter();
	return (
		<DashboardNavbarRoot>
			<Toolbar
				disableGutters
				sx={{
					minHeight: 64,
					left: 0,
					px: 2,
				}}>
				{router.pathname.includes('score') ? (
					<Button variant='contained' onClick={() => router.push('exam')}>
						繼續考試
					</Button>
				) : null}

				<Box sx={{ flexGrow: 1 }} />
				<Tooltip title='singOut'>
					<Typography sx={{ color: '#111' }}>Hello, {userName}</Typography>
				</Tooltip>
				<Avatar
					sx={{
						height: 40,
						width: 40,
						ml: 1,
						cursor: 'pointer',
					}}
					onClick={() => signOut({ callbackUrl: 'http://kinmen.im:3000/' })}>
					<LogoutIcon />
				</Avatar>
			</Toolbar>
		</DashboardNavbarRoot>
	);
};
export default ExamPageToolbar;
