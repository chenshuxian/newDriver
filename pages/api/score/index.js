/* eslint-disable import/no-anonymous-default-export */
import { getScore, createScore } from '../../../libs/score';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: score
 *     description: The score
 *
 * definitions:
 *   score:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: The score ID
 *         example: 11c2b4f5-c270-454e-a834-ae569a31dc54
 *       score:
 *         type: string
 *         description: The score
 *         example: 85
 *       wrongQ:
 *         type: string
 *         description: The wrong answer
 *         example: 11c2b4f5-c270-454e-a834-ae569a31dc54
 *       exam_id:
 *         type: string
 *         description: The group number of exam
 *         example: 10
 *       user_id:
 *         type: string
 *         description: The id of user
 *         example: W100382213
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The time created time
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The time updated time
 *         example: 2021-10-03T03:00:03.000Z
 *   scoreList:
 *     type: object
 *     properties:
 *       scoreList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/score'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     score:
 *       $ref: '#/definitions/score'
 *
 * /api/score:
 *   get:
 *     tags:
 *       - score
 *     summary: Get a list of score
 *     description: Get a list of score
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user_id
 *         in: query
 *         description: userId
 *         required: false
 *         schema:
 *           type: string
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
 *         description: A list of score
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/scoreList'
 *   post:
 *     tags:
 *       - score
 *     summary: Create a score
 *     description: Create a new score
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/score'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/score'
 */
export default async (req, res) => {
	const {
		query: { user_id, offset, limit },
		body: scoreData,
		method,
	} = req;

	let score;
	let total;
	switch (method) {
		case 'GET':
			let filter;
			let pagination;

			// if (!await isLogin(req)) {
			//   res.status(401).json(errorCode.Unauthorized);
			//   return;
			// }

			if (user_id !== undefined) {
				filter = { user_id };
			}

			if (offset || limit) {
				pagination = { offset, limit };
			}

			try {
				({ score, total } = await getScore(filter, pagination));
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}

			if (score) {
				res.status(200).json({ scoreList: score, total });
				return;
			}
			break;
		case 'POST':
			// if (!await isAdmin(req)) {
			//   res.status(401).json(errorCode.Unauthorized);
			//   return;
			// }

			if (!scoreData) {
				res.status(400).json(errorCode.BadRequest);
				return;
			}

			try {
				score = await createScore(scoreData);
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}

			if (score) {
				res.status(201).json(score);
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
