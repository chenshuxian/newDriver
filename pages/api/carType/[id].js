import {
	getCarTypeById,
	updateCarType,
	deleteCarType,
} from '../../../libs/carType';
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/carType/{id}:
 *   get:
 *     tags:
 *       - carType
 *     summary: Get a carType
 *     description: Get a carType
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the carType
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: carType
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/carType'
 *   patch:
 *     tags:
 *       - carType
 *     summary: Update a carType
 *     description: Update a carType
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the carType
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/carType'
 *     responses:
 *       200:
 *         description: carType
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/carType'
 *   delete:
 *     tags:
 *       - carType
 *     summary: Delete a carType
 *     description: Delete a carType
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the carType
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: carType
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/carType'
 */
export default async (req, res) => {
	const {
		query: { id },
		body: carTypeData,
		method,
	} = req;

	// if (!await isAdmin(req)) {
	//   res.status(401).json(errorCode.Unauthorized);
	//   return;
	// }

	let carType;
	let Id = id;
	let del = carTypeData.del;
	let delForever = carTypeData.forever;
	switch (method) {
		case 'GET':
			try {
				carType = await getCarById(Id);
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}
			break;
		case 'PATCH':
			if (!carTypeData) {
				res.status(400).json(errorCode.BadRequest);
				return;
			}

			try {
				carType = await updateCarType(Id, carTypeData);
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}
			break;
		case 'DELETE':
			try {
				carType = await deleteCarType(Id, del, delForever);
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}
			break;
		default:
			res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
			res.status(405).json(errorCode.MethodNotAllowed);
			return;
	}

	if (carType) {
		res.status(200).json(carType);
		return;
	}

	res.status(500).json(errorCode.InternalServerError);
};
