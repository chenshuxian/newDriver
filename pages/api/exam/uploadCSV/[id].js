import errorCode from '../../../../libs/errorCode';
import { isAdmin } from '../../../../libs/auth';
import { uploadCSV } from '../../../../libs/uploadFile';
import { importExam } from '../../../../libs/exam';

/**
 * @swagger
 * /api/exam/uploadCSV/{id}:
 *   post:
 *     tags:
 *       - exam
 *     summary: Upload a csv file to import exam
 *     description: Upload a csv filt to import exam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the exam type
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: A list of exam
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/examList'
 */
export default async(req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json(errorCode.MethodNotAllowed);
    return;
  }

  if (!await isAdmin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  return uploadCSV(req, res, importExam, { examTypeId: req.query.id });
};

export const config = {
  api: {
    bodyParser: false,
  },
}