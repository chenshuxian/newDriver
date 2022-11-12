/* eslint-disable import/no-anonymous-default-export */
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';
import { getExamList } from '../../../libs/user';
import { createTemplate } from '../../../libs/createTemp';
import { pureMakeFile, zipFile } from '../../../libs/file';

const fs = require('fs');
const path = require('path');

/**
 * @swagger
 * /api/user/getExamList:
 *   get:
 *     tags:
 *       - user
 *     summary: get doc list of exam
 *     description: get doc list of exam
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: trainPeriodId
 *         in: query
 *         description: trianPeriodId
 *         required: true
 *         schema:
 *           type: string
 *       - name: studentList
 *         in: query
 *         description: studentList
 *         required: false
 *         schema:
 *           type: string
 *       - name: perName
 *         in: query
 *         description: perName
 *         required: false
 *         schema:
 *           type: string
 *       - name: perExam
 *         in: query
 *         description: perExam
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: file name
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: csv tar file name
 *               example: 26000010246B.tar
 */
export default async (req, res) => {
	let data, inRoadBuf, outRoadBuf, exportName, folderName, folderPath;

	const {
		query: { trainPeriodId, studentList, perName, perExam },
	} = req;

	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		res.status(405).json(errorCode.MethodNotAllowed);
		return;
	}

	// if (!(await isAdmin(req))) {
	// 	res.status(401).json(errorCode.Unauthorized);
	// 	return;
	// }

	try {
		data = await getExamList(trainPeriodId, studentList);
		data.perExam = perExam;
		exportName = perName;
		folderName = `${perName}List`;
		folderPath = `static/download/${folderName}`;
		pureMakeFile(folderName);
		console.log(JSON.stringify(data));
		inRoadBuf = await createTemplate('inRoad', data);
		outRoadBuf = await createTemplate('outRoad', data);
	} catch (e) {
		res.status(e.statusCode).json(e);
		return;
	}

	try {
		fs.writeFileSync(
			path.resolve(`${folderPath}/${exportName}場考考試名冊.docx`),
			inRoadBuf
		);
		fs.writeFile(
			path.resolve(`${folderPath}/${exportName}道考考試名冊.docx`),
			outRoadBuf,
			(err) => {
				if (!err) {
					zipFile(folderName);
				}
			}
		);

		res.status(200).json({
			success: true,
			name: `${folderName}`,
		});
		return;
	} catch (e) {
		console.log(`write file err ==================== ${e}`);
		return '檔案產生失敗';
	}
};
