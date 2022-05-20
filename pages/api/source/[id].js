import {
	getSourceById,
	updateSource,
	deleteSource,
} from '../../../libs/source';
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/source/{id}:
 *   get:
 *     tags:
 *       - source
 *     summary: Get a source
 *     description: Get a source
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the source
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: source
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/source'
 *   patch:
 *     tags:
 *       - source
 *     summary: Update a source
 *     description: Update a source
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the source
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/source'
 *     responses:
 *       200:
 *         description: source
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/source'
 *   delete:
 *     tags:
 *       - source
 *     summary: Delete a source
 *     description: Delete a source
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the source
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: source
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/source'
 */
export default async (req, res) => {
	const {
		query: { id },
		body: sourceData,
		method,
	} = req;

	// if (!await isAdmin(req)) {
	//   res.status(401).json(errorCode.Unauthorized);
	//   return;
	// }

	let source;
	let Id = id;
	let del = sourceData.del;
	let delForever = sourceData.forever;
	switch (method) {
		case 'GET':
			try {
				source = await getSourceById(Id);
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}
			break;
		case 'PATCH':
			if (!sourceData) {
				res.status(400).json(errorCode.BadRequest);
				return;
			}

			try {
				source = await updateSource(Id, sourceData);
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}
			break;
		case 'DELETE':
			try {
				source = await deleteSource(Id, del, delForever);
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

	if (source) {
		res.status(200).json(source);
		return;
	}

	res.status(500).json(errorCode.InternalServerError);
};
