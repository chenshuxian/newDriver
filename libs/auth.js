import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import { getAdminByCredentials } from './adminUser';
import { getUserByCredentials } from './user';

const secret = process.env.SECRET;

const getUserToken = async function (req) {
	const token = await getToken({ req, secret });

	return token;
};

const getUserSession = async function (req) {
	const session = await getSession({ req });

	return session;
};

const isLogin = async function (req) {
	const session = await getUserSession(req);

	return session ? true : false;
};

const getUserId = async function (req) {
	const session = await getUserSession(req);

	return session?.user.user_id || '';
};

const adminLogin = async function (credentials) {
	const admin = await getAdminByCredentials(
		credentials.username,
		credentials.password
	);

	return admin || null;
};

const isAdmin = async function (req) {
	const session = await getUserSession(req);

	return session?.isAdmin || false;
};

const userLogin = async function (credentials) {
	const user = await getUserByCredentials(
		credentials.username,
		credentials.password
	);

	return user || null;
};

export { isLogin, getUserId, adminLogin, isAdmin, userLogin };
