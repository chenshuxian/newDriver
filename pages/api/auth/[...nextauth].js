import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUser, getUserById } from '../../../libs/user';
import { userLogin, adminLogin } from '../../../libs/auth';
import errorCode from '../../../libs/errorCode';
import { getAdminUserById } from '../../../libs/adminUser';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
	// https://next-auth.js.org/configuration/providers
	providers: [
		CredentialsProvider({
			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'Username' },
				password: { label: 'password', type: 'text', placeholder: 'Password' },
			},
			async authorize(credentials) {
				//console.log(`credentials11: ${credentials}`);
				const data = await userLogin(credentials);

				const user = {
					id: data.user_id,
					name: data.user_name,
					email: data.user_email,
				};
				return user;
			},
		}),
		CredentialsProvider({
			id: 'adminLogin',
			async authorize(credentials) {
				// console.log(`credentials22: ${JSON.stringify(credentials)}`);
				const data = await adminLogin(credentials);

				const user = {
					id: data.id,
					name: data.name,
				};
				return user;
			},
		}),
	],
	// Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
	// https://next-auth.js.org/configuration/databases
	//
	// Notes:
	// * You must install an appropriate node_module for your database
	// * The Email provider requires a database (OAuth providers do not)
	database: process.env.DATABASE_URL_AUTH,

	// The secret should be set to a reasonably long random string.
	// It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
	// a separate secret is defined explicitly for encrypting the JWT.
	secret: process.env.SECRET,

	session: {
		// Use JSON Web Tokens for session instead of database sessions.
		// This option can be used with or without a database for users/accounts.
		// Note: `jwt` is automatically set to `true` if no database is specified.
		jwt: true,

		// Seconds - How long until an idle session expires and is no longer valid.
		// maxAge: 30 * 24 * 60 * 60, // 30 days

		// Seconds - Throttle how frequently to write to database to extend a session.
		// Use it to limit write operations. Set to 0 to always update the database.
		// Note: This option is ignored if using JSON Web Tokens
		// updateAge: 24 * 60 * 60, // 24 hours
	},

	// JSON Web tokens are only used for sessions if the `jwt: true` session
	// option is set - or by default if no database is specified.
	// https://next-auth.js.org/configuration/options#jwt
	jwt: {
		// A secret to use for key generation (you should set this explicitly)
		// secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
		// Set to true to use encryption (default: false)
		// encryption: true,
		// You can define your own encode/decode functions for signing and encryption
		// if you want to override the default behaviour.
		// encode: async ({ secret, token, maxAge }) => {},
		// decode: async ({ secret, token, maxAge }) => {},
	},

	// You can define custom pages to override the built-in ones. These will be regular Next.js pages
	// so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
	// The routes shown here are the default URLs that will be used when a custom
	// pages is not specified for that route.
	// https://next-auth.js.org/configuration/pages
	pages: {
		// signIn: '/auth/signin', // Displays signin buttons
		// signOut: '/auth/signout', // Displays form with sign out button
		// error: '/auth/error', // Error code passed in query string as ?error=
		// verifyRequest: '/auth/verify-request', // Used for check email page
		// newUser: null // If set, new users will be directed here on first sign in
	},

	// Callbacks are asynchronous functions you can use to control what happens
	// when an action is performed.
	// https://next-auth.js.org/configuration/callbacks
	callbacks: {
		async signIn(user, account, profile, email, credentials) {
			let registeredUser;
			//console.log(`user Sign ${JSON.stringify(user)} `);
			if (user.account.type == 'credentials') {
				//console.log(`return user: ${JSON.stringify(user.user)}`);
				return user.user;
			}
		},
		async jwt({ token, account, user }) {
			// Persist the OAuth access_token to the token right after signin
			return token;
		},
		async session({ session, token, user }) {
			// Send properties to the client, like an access_token from a provider.
			let registeredUser;
			try {
				registeredUser = await getAdminUserById(token.sub);
				if (registeredUser) {
					console.log(`admin`);
					session.user.isAdmin = true;
				}
			} catch (e) {}

			session.user.user_id = token.sub;
			return session;
		},
	},

	// Events are useful for logging
	// https://next-auth.js.org/configuration/events
	events: {},

	// You can set the theme to 'light', 'dark' or use 'auto' to default to the
	// whatever prefers-color-scheme is set to in the browser. Default is 'auto'
	theme: 'light',

	// Enable debug messages in the console if you are having problems
	debug: false,
});
