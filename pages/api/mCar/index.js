/* eslint-disable import/no-anonymous-default-export */
import { getCars, createmCar } from '../../../libs/mCar';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: mCar
 *     description: The mCar
 *
 * definitions:
 *   mCar:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: The mCar ID
 *         example: 0175d130-eec8-4438-b57c-84324ec1458f
 *       car_number:
 *         type: string
 *         description: The mCar name
 *         example: 6698-JN
 *       car_maker:
 *         type: string
 *         description: The mCar maker
 *         example: 日產
 *       engin_id:
 *         type: string
 *         description: The mCar engin id
 *         example: 1985/02/17
 *       born_date:
 *         type: string
 *         description: The mCar born date
 *         example: 1985/02/17
 *       ins_date:
 *         type: string
 *         description: The mCar ins date
 *         example: 1985/02/17
 *       cc:
 *         type: string
 *         description: The mCar ins date
 *         example: 1275
 *       color:
 *         type: string
 *         description: The color of car
 *         example: 2
 *       lic_status:
 *         type:  string
 *         description: The color of lic
 *         example: 1
 *       hand_auto:
 *         type: string
 *         description: The type of car
 *         example: 2
 *       road_car:
 *         type: int
 *         description: The test of car
 *         example: 2
 *       created_time:
 *         type: string
 *         description: The teacher created time
 *         example: 1985/02/17
 *       updated_time:
 *         type: string
 *         description: The teacher updated time
 *         example: 1985/02/17
 *       version:
 *         type: int
 *         description: The teacher updated time
 *         example: 1
 *   mCarList:
 *     type: object
 *     properties:
 *       mCarList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/mCar'
 *
 * components:
 *   schemas:
 *     mCar:
 *       $ref: '#/definitions/mCar'
 *
 * /api/mCar:
 *   get:
 *     tags:
 *       - mCar
 *     summary: Get a list of mCar
 *     description: Get a list of mCar
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
 *         description: A list of mCar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/mCarList'
 *   post:
 *     tags:
 *       - mCar
 *     summary: Create a mCar
 *     description: Create a new mCar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/mCar'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/mCar'
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
				mCar = await getCars();
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}

			if (mCar) {
				res.status(200).json({ mCarList: mCar });
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
				mCar = await createmCar(mCarData);
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
