import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { theme } from '../theme';
import { WEBTITLE, YEAR } from '../libs/front/constText';
import '../src/main.css';
import { SessionProvider } from 'next-auth/react';

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
						{getLayout(<Component session={session} {...pageProps} />)}
					</SessionProvider>
				</ThemeProvider>
			</LocalizationProvider>
		</CacheProvider>
	);
};

export default App;
