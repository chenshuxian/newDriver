import {
	getClassTypeById,
	updateClassType,
	deleteClassType,
} from '../../../libs/classType';
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/classType/{id}:
 *   get:
 *     tags:
 *       - classType
 *     summary: Get a classType
 *     description: Get a classType
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the classType
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: classType
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/classType'
 *   patch:
 *     tags:
 *       - classType
 *     summary: Update a classType
 *     description: Update a classType
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the classType
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/classType'
 *     responses:
 *       200:
 *         description: classType
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/classType'
 *   delete:
 *     tags:
 *       - classType
 *     summary: Delete a classType
 *     description: Delete a classType
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the classType
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: classType
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/classType'
 */
export default async (req, res) => {
	const {
		query: { id },
		body: classTypeData,
		method,
	} = req;

	// if (!await isAdmin(req)) {
	//   res.status(401).json(errorCode.Unauthorized);
	//   return;
	// }

	let classType;
	let Id = id;
	let del = classTypeData.del;
	let delForever = classTypeData.forever;
	switch (method) {
		case 'GET':
			try {
				classType = await getClassById(Id);
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}
			break;
		case 'PATCH':
			if (!classTypeData) {
				res.status(400).json(errorCode.BadRequest);
				return;
			}

			try {
				classType = await updateClassType(Id, classTypeData);
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}
			break;
		case 'DELETE':
			try {
				classType = await deleteClassType(Id, del, delForever);
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

	if (classType) {
		res.status(200).json(classType);
		return;
	}

	res.status(500).json(errorCode.InternalServerError);
};
