/* eslint-disable import/no-anonymous-default-export */
import { checkAnswer, getExamNum } from '../../../libs/exam';
import { createScore } from '../../../libs/score';
import errorCode from '../../../libs/errorCode';
import { isLogin, getUserId } from '../../../libs/auth';
import { getUserById } from '../../../libs/user';

const passScore = 85;

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

			examNum = await getExamNum(Object.keys(answerData)[0]);
			//console.log(`examNum==========:${examNum}`);

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
				// examNum = await getExamNum(Object.keys(answerData)[0]);
				//console.log(`exam number : ${examNum}`);
				if (examAnsErr) {
					score = (Object.keys(answerData).length - examAnsErr.length) * 2.5;
					examAnsErr = examAnsErr.map((exam) => {
						let exam_ans = exam.exam_option.split(';');
						//examNum = exam.exam_number;
						return {
							exam_id: exam.exam_id,
							exam_title: exam.exam_title,
							exam_img_url: exam.exam_img_url,
							exam_ans: exam_ans[exam.exam_ans - 1],
							exam_ans_err: exam_ans[answerData[exam.exam_id] - 1],
						};
					});
				} else {
					//examNum = await getExamNum(Object.keys(answerData)[0]);
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
};
