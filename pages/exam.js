import { useSession, signIn, signOut } from 'next-auth/react';

const Exam = () => {
	const { data: session, status } = useSession();
	console.log(`accessToken: ${JSON.stringify(session)}`);
	if (status === 'authenticated') {
		return (
			<>
				{/* Signed in as {session.user} <br /> */}
				<button onClick={() => signOut()}>Sign out</button>
			</>
		);
	}
	return <div>Not Login</div>;
};
export default Exam;
