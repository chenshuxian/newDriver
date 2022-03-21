/* eslint-disable import/no-anonymous-default-export */
import { checkAnswer, getExamTypeId } from '../../../libs/exam';
import { createScore } from '../../../libs/score';
import errorCode from '../../../libs/errorCode';
import { isLogin, getUserId } from '../../../libs/auth';
import { getUserById, updateUser } from '../../../libs/user';

const passScore = 85;

/**
 * @swagger
 * /api/exam/submitAnswer:
 *   post:
 *     tags:
 *       - exam
 *     summary: Submit an exam answer
 *     description: Submit an exam answer to create a ticket
 *     requestBody:
 *       required: true
 *       description: Submit an exam answer to create a ticket
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties:
 *               type: integer
 *               decription: Object key is exam_id, value is answer
 *               example: 1
 *     responses:
 *       201:
 *         description: Create a ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: integer
 *                   description: Score
 *                   example: 80
 *                 ansList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       exam_title:
 *                         type: string
 *                         description: The exam title
 *                         example: 烈嶼受東北季風侵擾，先民為驅除風害...
 *                       exam_ans:
 *                         type: string
 *                         description: Correct answer
 *                         example: 符籙
 *                       exam_ans_err:
 *                         type: string
 *                         description: User answer
 *                         example:  木魚
 *       400:
 *         description: It is not allowed to create a ticket because the answer is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: The error code
 *                   example: IncorrectAnswer
 *                 message:
 *                   type: string
 *                   description: The error message
 *                   example: It is not allowed to create a ticket because the answer is incorrect
 *       429:
 *         description: Daily quota exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: The error code
 *                   example: QuotaExceeded
 *                 message:
 *                   type: string
 *                   description: The error message
 *                   example: Daily quota exceeded
 */
export default async (req, res) => {
	const { body: answerData, method } = req;

	if (!(await isLogin(req))) {
		res.status(401).json(errorCode.Unauthorized);
		return;
	}

	switch (method) {
		case 'POST':
			let examAnsErr;
			let score;
			let userId;
			let user;
			let examNum;
			let scoreData;

			if (!answerData || typeof answerData !== 'object') {
				res.status(400).json(errorCode.BadRequest);
				return;
			}

			userId = await getUserId(req);

			try {
				user = await getUserById(userId);
			} catch (e) {
				if (e === errorCode.NotFound) {
					//console.log(`post auth err NotFound`)
					res.status(401).json(errorCode.Unauthorized);
					return;
				}
			}

			try {
				examAnsErr = await checkAnswer(answerData);
				if (examAnsErr) {
					score = (Object.keys(answerData).length - examAnsErr.length) * 2.5;
					examAnsErr = examAnsErr.map((exam) => {
						let exam_ans = exam.exam_option.split(';');
						examNum = exam.exam_number;
						return {
							exam_id: exam.exam_id,
							exam_title: exam.exam_title,
							exam_img_url: exam.exam_img_url,
							exam_ans: exam_ans[exam.exam_ans - 1],
							exam_ans_err: exam_ans[answerData[exam.exam_id] - 1],
						};
					});
				} else {
					score = 100;
				}
			} catch (e) {
				res.status(e.statusCode).json(e);
				return;
			}

			try {
				scoreData = {
					score: score.toString(),
					user_id: userId,
					exam_id: examNum,
				};
				await createScore(scoreData);
			} catch (e) {
				console.log(`createScoer err: ${e}`);
				res.status(e.statusCode).json(e);
				return;
			}

			res.status(200).json({
				score,
				ansList: examAnsErr,
			});
			return;
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).json(errorCode.MethodNotAllowed);
			return;
	}

	res.status(500).json(errorCode.InternalServerError);
};
