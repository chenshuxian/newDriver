/* eslint-disable import/no-anonymous-default-export */
import { getExam, createExam } from '../../../libs/exam';
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: exam
 *     description: The exam
 *
 * definitions:
 *   exam:
 *     type: object
 *     properties:
 *       exam_id:
 *         type: string
 *         description: The exam ID
 *         example: 11c2b4f5-c270-454e-a834-ae569a31dc54
 *       exam_number:
 *         type: BigInt
 *         description: 題庫號
 *         example: 1,2,3....16
 *       exam_title:
 *         type: string
 *         description: The exam title
 *         example: 題號 19. 小型車行駛高速公路或快速公路，前後兩車...
 *       exam_option:
 *         type: string
 *         description: The exam option
 *         items:
 *           type: string
 *           example: "選項一;選項二;選項三;"
 *       exam_ans:
 *         type: integer
 *         description: The exam answer
 *         example: 1
 *       exam_img_url:
 *         type: string
 *         description: The exam image url
 *         example: /assets/images/qa/1.jpg
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The exam created time
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The exam updated time
 *         example: 2021-10-03T03:00:03.000Z
 *       is_delete:
 *         type: boolean
 *         description: Is the exam deleted
 *         example: false
 *
 * components:
 *   schemas:
 *     Exam:
 *       $ref: '#/definitions/exam'
 *
 * /api/exam:
 *   get:
 *     tags:
 *       - exam
 *     summary: Get a list of exam
 *     description: Get a list of exam
 *     parameters:
 *       - name: isDelete
 *         in: query
 *         description: is delete
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: examNumber
 *         in: query
 *         description: 題庫號
 *         required: false
 *         schema:
 *           type: integer
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
 *         description: A list of exam
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/exam'
 *   post:
 *     tags:
 *       - exam
 *     summary: Create a exam
 *     description: Create a new exam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/exam'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/exam'
 */
export default async (req, res) => {
	const {
		query: { isDelete, examNumber, offset, limit },
		body: examData,
		method,
	} = req;

	let exam;
	let total;
	switch (method) {
		case 'GET':
			let filter = {};
			let pagination;

			// if (!await isAdmin(req)) {
			//   res.status(401).json(errorCode.Unauthorized);
			//   return;
			// }

			if (examNumber) {
				filter['exam_number'] = parseInt(examNumber);
			}

			if (isDelete !== undefined) {
				filter['is_delete'] = isDelete === 'true' ? true : false;
			}

			if (offset || limit) {
				pagination = { offset, limit };
			}

			try {
				({ exam, total } = await getExam(filter, pagination));
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}

			if (exam) {
				res.status(200).json({ examList: exam, total });
				return;
			}
			break;
		case 'POST':
			// if (!await isAdmin(req)) {
			//   res.status(401).json(errorCode.Unauthorized);
			//   return;
			// }

			if (!examData) {
				res.status(400).json(errorCode.BadRequest);
				return;
			}

			try {
				exam = await createExam(examData);
			} catch (e) {
				console.log(`create Exam err: ${JSON.stringify(e)}`);
				res.status(e.statusCode).json(e);
				return;
			}

			if (exam) {
				res.status(201).json(exam);
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
