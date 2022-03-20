import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/react';
import UserLogin from '../components/user/user-login';
import { useRouter } from 'next/router';

const MainPage = () => {
	const { data: session } = useSession();
	const router = useRouter();

	if (session) {
		router.push('/exam');
	}

	return <UserLogin />;
};

export default MainPage;
