/* eslint-disable import/no-anonymous-default-export */
import { deleteExam } from '../../../libs/exam';
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/exam/batchDelete:
 *   post:
 *     tags:
 *       - exam
 *     summary: Batch delete exam
 *     description: Batch delete a exam
 *     parameters:
 *       - in: query
 *         name: isDelete
 *         description: is delete
 *         required: false
 *         schema:
 *           type: boolean
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exam_id_list:
 *                 type: array
 *                 description: The exam ID list
 *                 items:
 *                   type: string
 *                   description: The exam ID
 *                   example: '11c2b4f5-c270-454e-a834-ae569a31dc54'
 *     responses:
 *       200:
 *         description: exam
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: string
 *                   description: The count of deleted records
 *                   example: 2
 */
export default async(req, res) => {
  const {
    query: { isDelete },
    body: examData,
    method,
  } = req

  // if (!await isAdmin(req)) {
  //   res.status(401).json(errorCode.Unauthorized);
  //   return;
  // }

  let exam
  switch (method) {
    case 'POST':
      if (!examData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        exam = await deleteExam(examData.exam_id_list, isDelete === 'true' ? true : false);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      break
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  if (exam) {
    res.status(200).json(exam);
    return;
  }

  res.status(500).json(errorCode.InternalServerError);
};