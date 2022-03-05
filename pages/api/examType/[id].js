/* eslint-disable import/no-anonymous-default-export */
import { getExamTypeById, updateExamType, deleteExamType } from '../../../libs/examType'
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/examType/{id}:
 *   get:
 *     tags:
 *       - examType
 *     summary: Get a exam type
 *     description: Get a exam type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the exam type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: exam type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/examType'
 *   patch:
 *     tags:
 *       - examType
 *     summary: Update a exam type
 *     description: Update a exam type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the exam type
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exam_type_name:
 *                 type: string
 *                 description: The exam type name
 *                 example: 文化
 *     responses:
 *       200:
 *         description: exam type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/examType'
 *   delete:
 *     tags:
 *       - examType
 *     summary: Delete a exam type
 *     description: Delete a exam type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the exam type
 *         schema:
 *           type: string
 *       - name: isDelete
 *         in: query
 *         description: is delete
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: exam type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/examType'
 */
export default async(req, res) => {
  const {
    query: { id, isDelete },
    body: examTypeName,
    method,
  } = req

  if (!await isAdmin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  let examType
  switch (method) {
    case 'GET':
      try {
        examType = await getExamTypeById(id);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'PATCH':
      if (!examTypeName) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        examType = await updateExamType(id, examTypeName);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'DELETE':
      try {
        examType = await deleteExamType(id, isDelete === 'true' ? true : false);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  if (examType) {
    res.status(200).json(examType);
    return;
  }

  res.status(500).json(errorCode.InternalServerError)
};