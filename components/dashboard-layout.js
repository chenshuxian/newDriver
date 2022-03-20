import { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import { useSession } from 'next-auth/react';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
	display: 'flex',
	flex: '1 1 auto',
	maxWidth: '100%',
	paddingTop: 64,
	[theme.breakpoints.up('lg')]: {
		paddingLeft: 280,
	},
}));

export const DashboardLayout = (props) => {
	const { children } = props;
	const [isSidebarOpen, setSidebarOpen] = useState(true);
	const { data: session, status } = useSession();
	const userName = session?.user.name;

	return (
		<>
			<DashboardLayoutRoot>
				<Box
					sx={{
						display: 'flex',
						flex: '1 1 auto',
						flexDirection: 'column',
						width: '100%',
					}}>
					{children}
				</Box>
			</DashboardLayoutRoot>
			<DashboardNavbar
				userName={userName}
				onSidebarOpen={() => setSidebarOpen(true)}
			/>
			<DashboardSidebar
				onClose={() => setSidebarOpen(false)}
				open={isSidebarOpen}
			/>
		</>
	);
};
