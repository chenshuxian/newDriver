import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react'
import { getAdminByCredentials } from './adminUser';

const secret = process.env.SECRET

const getUserToken = async function(req) {
  const token = await getToken({ req, secret });

  return token;
}

const getUserSession = async function(req) {
  const session = await getSession({ req });

  return session;
}

const isLogin = async function(req) {
  const session = await getUserSession(req);

  return session ? true : false;
}

const getUserId = async function(req) {
  const session = await getUserSession(req);

  return session?.userId || '';
}

const adminLogin = async function(credentials) {
  const admin = await getAdminByCredentials(credentials.username, credentials.password);

  return admin || null;
}

const isAdmin = async function(req) {
  const session = await getUserSession(req);

  return session?.isAdmin || false;
}

export { isLogin, getUserId, adminLogin, isAdmin };