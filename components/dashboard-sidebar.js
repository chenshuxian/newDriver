import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { Cog as CogIcon } from '../icons/cog';
import { Lock as LockIcon } from '../icons/lock';
import { Selector as SelectorIcon } from '../icons/selector';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { User as UserIcon } from '../icons/user';
import { UserAdd as UserAddIcon } from '../icons/user-add';
import { Users as UsersIcon } from '../icons/users';
import { XCircle as XCircleIcon } from '../icons/x-circle';
import { Logo } from './logo';
import { NavItem } from './nav-item';
import { WEBTITLE } from '../libs/front/constText';

const items = [
	{
		href: '/admin',
		icon: <ChartBarIcon fontSize='small' />,
		title: '車輛管理',
	},
	{
		href: '/admin/customers',
		icon: <UsersIcon fontSize='small' />,
		title: '學員管理',
	},
	{
		href: '/admin/exams',
		icon: <MenuBookIcon fontSize='small' />,
		title: '考題管理',
	},
	{
		href: '/admin/teacher',
		icon: <UserIcon fontSize='small' />,
		title: '教師管理',
	},
	{
		href: '/admin/account',
		icon: <UserIcon fontSize='small' />,
		title: '管理員管理',
	},
	{
		href: '/admin/settings',
		icon: <CogIcon fontSize='small' />,
		title: '設定',
	},
	{
		href: '/admin/login',
		icon: <LockIcon fontSize='small' />,
		title: 'Login',
	},
	{
		href: '/admin/register',
		icon: <UserAddIcon fontSize='small' />,
		title: 'Register',
	},
	{
		href: '/404',
		icon: <XCircleIcon fontSize='small' />,
		title: 'Error',
	},
];

export const DashboardSidebar = (props) => {
	const { open, onClose } = props;
	const router = useRouter();
	const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
		defaultMatches: true,
		noSsr: false,
	});

	useEffect(
		() => {
			if (!router.isReady) {
				return;
			}

			if (open) {
				onClose?.();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[router.asPath]
	);

	const content = (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}>
				<div>
					<Box sx={{ p: 3 }}>
						<NextLink href='/' passHref>
							<a>
								<Logo
									sx={{
										height: 42,
										width: 42,
									}}
								/>
							</a>
						</NextLink>
					</Box>
					<Box sx={{ px: 2 }}>
						<Box
							sx={{
								alignItems: 'center',
								backgroundColor: 'rgba(255, 255, 255, 0.04)',
								cursor: 'pointer',
								display: 'flex',
								justifyContent: 'space-between',
								px: 3,
								py: '11px',
								borderRadius: 1,
							}}>
							<div>
								<Typography color='inherit' variant='subtitle1'>
									{WEBTITLE}
								</Typography>
								<Typography color='neutral.400' variant='body2'>
									Your tier : Premium
								</Typography>
							</div>
							<SelectorIcon
								sx={{
									color: 'neutral.500',
									width: 14,
									height: 14,
								}}
							/>
						</Box>
					</Box>
				</div>
				<Divider
					sx={{
						borderColor: '#2D3748',
						my: 3,
					}}
				/>
				<Box sx={{ flexGrow: 1 }}>
					{items.map((item) => (
						<NavItem
							key={item.title}
							icon={item.icon}
							href={item.href}
							title={item.title}
						/>
					))}
				</Box>
			</Box>
		</>
	);

	if (lgUp) {
		return (
			<Drawer
				anchor='left'
				open
				PaperProps={{
					sx: {
						backgroundColor: 'neutral.900',
						color: '#FFFFFF',
						width: 280,
					},
				}}
				variant='permanent'>
				{content}
			</Drawer>
		);
	}

	return (
		<Drawer
			anchor='left'
			onClose={onClose}
			open={open}
			PaperProps={{
				sx: {
					backgroundColor: 'neutral.900',
					color: '#FFFFFF',
					width: 280,
				},
			}}
			sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
			variant='temporary'>
			{content}
		</Drawer>
	);
};

DashboardSidebar.propTypes = {
	onClose: PropTypes.func,
	open: PropTypes.bool,
};
