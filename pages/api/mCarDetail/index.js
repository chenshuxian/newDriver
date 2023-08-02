/* eslint-disable import/no-anonymous-default-export */
import { getCarDetail,createmCarDetail } from '../../../libs/mCarDetail';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: mCar
 *     description: The mCarDetail
 *
 * definitions:
 *   mCarDetail:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: The mCarDetail ID
 *         example: 0175d130-eec8-4438-b57c-84324ec1458f
 *       car_id:
 *         type: string
 *         description: The mCarDetail car_id
 *         example: 0175d130-eec8-4438-b57c
 *       teacher_id:
 *         type: string
 *         description: The mCarDetail teacher_id
 *         example: 0175d130-eec8-4438-b57c
 *       fix_date:
 *         type: string
 *         description: The mCarDetail fix_date
 *         example: 1985/02/17
 *       fix_store:
 *         type: string
 *         description: The mCarDetail fix_store
 *         example: 尚義
 *       device:
 *         type: string
 *         description: The mCarDetail device
 *         example: 引擎
 *       num:
 *         type: int
 *         description: The mCarDetail num
 *         example: 1
 *       price:
 *         type: int
 *         description: The price of carDetail
 *         example: 200
 *       salary:
 *         type:  int
 *         description: The salary of carDetail
 *         example: 100
 *       totalPrice:
 *         type: int
 *         description: The totalPrice of carDetail
 *         example: 2000
 *       createdAt:
 *         type: string
 *         description: The carDetail created time
 *         example: 1985/02/17
 *       updatedAt:
 *         type: string
 *         description: The carDetail updated time
 *         example: 1985/02/17
 *       version:
 *         type: int
 *         description: The carDetail updated time
 *         example: 1
 *   mCarDetailList:
 *     type: object
 *     properties:
 *       mCarDetailList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/mCarDetail'
 *
 * components:
 *   schemas:
 *     mCarDetail:
 *       $ref: '#/definitions/mCarDetail'
 *
 * /api/mCarDetail:
 *   get:
 *     tags:
 *       - mCarDetail
 *     summary: Get a list of mCarDetail
 *     description: Get a list of mCarDetail
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
 *         description: A list of mCarDetail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/mCarDetailList'
 *   post:
 *     tags:
 *       - mCarDetail
 *     summary: Create a mCarDetail
 *     description: Create a new mCarDetail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/mCarDetail'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/mCarDetail'
 */

export default async (req, res) => {
	const {
		query: { isDelete, offset, limit },
		body: mCarData,
		method,
	} = req;

	let mCar;
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
				mCar = await getCarDetail();
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}

			if (mCar) {
				res.status(200).json({ list: mCar });
				return;
			}
			break;
		case 'POST':
			// if (!await isAdmin(req)) {
			//   res.status(401).json(errorCode.Unauthorized);
			//   return;
			// }

			if (!mCarData) {
				res.status(400).json(errorCode.BadRequest);
				return;
			}

			try {
				mCar = await createmCarDetail(mCarData);
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}

			if (mCar) {
				res.status(200).json(mCar);
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
