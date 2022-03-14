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

	// <section>
	// 	<div className='box'>
	// 		<div className='form'>
	// 			<h2>金門駕訓班-考試系統</h2>
	// 			<form id='myForm' name='myForm'>
	// 				<div className='inputBx'>
	// 					<input
	// 						type='text'
	// 						id='user_id'
	// 						name='user_id'
	// 						placeholder='身份證字號'
	// 					/>
	// 					<img src='../static/images/car/user.png' />
	// 				</div>
	// 				<div className='inputBx'>
	// 					<input
	// 						type='password'
	// 						id='user_password'
	// 						name='user_password'
	// 						placeholder='出生年月日'
	// 					/>
	// 					<img src='../static/images/car/lock.png' />
	// 				</div>
	// 				<div className='inputBx'>
	// 					<input type='submit' value='登入' onClick={submitData} />
	// 				</div>
	// 			</form>
	// 		</div>
	// 	</div>
	// </section>
};

export default MainPage;
