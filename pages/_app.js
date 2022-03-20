import Head from 'next/head';
import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { theme } from '../theme';
import { WEBTITLE, YEAR } from '../libs/front/constText';
import { SessionProvider } from 'next-auth/react';
import router from 'next/router';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
	const {
		Component,
		emotionCache = clientSideEmotionCache,
		session,
		pageProps,
	} = props;

	const getLayout = Component.getLayout ?? ((page) => page);

	Date.prototype.addDays = function (days) {
		const date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		let d = date.getDate();

		m = m < 10 ? `0${m}` : m;
		d = d < 10 ? `0${d}` : d;
		return `${y}/${m}/${d}`;
	};

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>{WEBTITLE}</title>
				<meta name='viewport' content='initial-scale=1, width=device-width' />
			</Head>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<ThemeProvider theme={theme}>
					<SessionProvider session={session}>
						<CssBaseline />
						{Component.auth ? (
							<Auth url={Component.auth.unauthorized}>
								{getLayout(<Component session={session} {...pageProps} />)}
							</Auth>
						) : (
							getLayout(<Component session={session} {...pageProps} />)
						)}
					</SessionProvider>
				</ThemeProvider>
			</LocalizationProvider>
		</CacheProvider>
	);
};

function Auth({ children, url }) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const isUser = !!session?.user;
	const isAdmin = session?.user.isAdmin;
	const pathName = router.pathname;

	React.useEffect(() => {
		if (status === 'loading') return;
		if (!isUser) {
			router.push(url);
		}

		if (pathName.includes('admin') && !isAdmin) {
			router.push('/');
		}
	}, [isUser, status]);

	if (isUser) {
		// console.log(`have user url : ${pathName}`);
		return children;
	}

	// Session is being fetched, or no user.
	// If no user, useEffect() will redirect.
	return <div>Loading...</div>;
}

export default App;
