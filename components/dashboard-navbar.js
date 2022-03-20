import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
	AppBar,
	Avatar,
	Badge,
	Box,
	IconButton,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Users as UsersIcon } from '../icons/users';
import { signOut, useSession } from 'next-auth/react';
import LogoutIcon from '@mui/icons-material/Logout';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	boxShadow: theme.shadows[3],
}));

export const DashboardNavbar = (props) => {
	const { onSidebarOpen, userName, ...other } = props;

	return (
		<>
			<DashboardNavbarRoot
				sx={{
					left: {
						lg: 280,
					},
					width: {
						lg: 'calc(100% - 280px)',
					},
				}}
				{...other}>
				<Toolbar
					disableGutters
					sx={{
						minHeight: 64,
						left: 0,
						px: 2,
					}}>
					<IconButton
						onClick={onSidebarOpen}
						sx={{
							display: {
								xs: 'inline-flex',
								lg: 'none',
							},
						}}>
						<MenuIcon fontSize='small' />
					</IconButton>
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
						onClick={() => signOut()}>
						<LogoutIcon />
					</Avatar>
				</Toolbar>
			</DashboardNavbarRoot>
		</>
	);
};

DashboardNavbar.propTypes = {
	onSidebarOpen: PropTypes.func,
};
