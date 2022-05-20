/* eslint-disable import/no-anonymous-default-export */
import { getUser, createUser } from '../../../libs/user';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: user
 *     description: The user
 *
 * definitions:
 *   user:
 *     type: object
 *     properties:
 *       user_id:
 *         type: string
 *         description: User ID
 *         example: w100382213
 *       user_name:
 *         type: string
 *         description: User name
 *         example: ZZ
 *       user_stu_num:
 *         type: string
 *         description: 學號
 *         example: 10972A21 期別號+順序
 *       user_gender:
 *         type: Int
 *         description: gender 1 boy  2 girl
 *         example: 1
 *       user_born:
 *         type: string
 *         format: date-time
 *         description: The exam type payDate time
 *         example: 2021-10-03T03:00:03.000Z
 *       user_email:
 *         type: string
 *         description: Address
 *         example: j109233312@gmail.com
 *       user_addr:
 *         type: string
 *         description: Address
 *         example: 金門縣金湖鎮....
 *       user_tel:
 *         type: string
 *         description: Home Tel
 *         example: 093282321
 *       user_mobile:
 *         type: string
 *         format: mobile
 *         description: Phone
 *         example: 0932812321
 *       user_payment_date:
 *         type: string
 *         format: date-time
 *         description: The payment_date time
 *         example: 2021-10-03T03:00:03.000Z
 *       user_payment:
 *         type: int
 *         description: 付款金額
 *         example: 13000
 *       user_memo:
 *         type: int
 *         description: memo
 *         example: 21312421490u90jasdfji
 *       class_type_id:
 *         type: string
 *         description: F_key 課程類別 1 普小
 *         example: 47398668-5967-11ec-a655-528abe1c4f3a
 *       post_code_id:
 *         type: string
 *         description: F_key post_code option
 *         example: 4f53854a-5964-11ec-a655-528abe1c4f3a
 *       car_type_id:
 *         type: string
 *         description: F_key car_type option
 *         example: 5220aa08-5966-11ec-a655-528abe1c4f3a
 *       source_id:
 *         type: string
 *         description: F_key 來源 學照 團報
 *         example: 0641878c-5967-11ec-a655-528abe1c4f3a
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The exam type create time
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The exam type updated time
 *         example: 2021-10-03T03:00:03.000Z
 *       is_delete:
 *         type: boolen
 *         description: The teacher is deleted
 *         example: false
 *   userList:
 *     type: object
 *     properties:
 *       userList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/user'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     user:
 *       $ref: '#/definitions/user'
 *
 * /api/user:
 *   get:
 *     tags:
 *       - user
 *     summary: Get a list of user
 *     description: Get a list of user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isDelete
 *         in: query
 *         description: Is the delete
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: offset
 *         in: query
 *         description: offset
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: limit
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/userList'
 *   post:
 *     tags:
 *       - user
 *     summary: Create a user
 *     description: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/user'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/user'
 */
export default async (req, res) => {
	const {
		query: { isDelete, offset, limit },
		body: userData,
		method,
	} = req;

	let user;
	let total;
	switch (method) {
		case 'GET':
			let filter;
			let pagination;

			// if (!await isLogin(req)) {
			//   res.status(401).json(errorCode.Unauthorized);
			//   return;
			// }

			if (isDelete !== undefined) {
				filter = { is_delete: isDelete === 'true' ? true : false };
			}

			if (offset || limit) {
				pagination = { offset, limit };
			}

			try {
				({ user, total } = await getUser(filter, pagination));
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}

			if (user) {
				res.status(200).json({ userList: user, total });
				return;
			}
			break;
		case 'POST':
			// if (!await isAdmin(req)) {
			//   res.status(401).json(errorCode.Unauthorized);
			//   return;
			// }

			if (!userData) {
				res.status(400).json(errorCode.BadRequest);
				return;
			}

			console.log(`user: ${userData}`);
			try {
				user = await createUser(userData);
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}

			if (user) {
				res.status(201).json(user);
				return;
			}
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).json(errorCode.MethodNotAllowed);
			return;
	}

	res.status(500).json(errorCode.InternalServerError);
};
