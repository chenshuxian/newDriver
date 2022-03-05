import { getExamType, createExamType } from '../../../libs/examType';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: examType
 *     description: The exam type
 * 
 * definitions:
 *   examType:
 *     type: object
 *     properties:
 *       exam_type_id:
 *         type: string
 *         description: The exam type ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       exam_type_name:
 *         type: string
 *         description: The exam type name
 *         example: 文化
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The exam type created time
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The exam type updated time
 *         example: 2021-10-03T03:00:03.000Z
 *       is_delete:
 *         type: boolean 
 *         description: Is the exam type deleted
 *         example: false
 *   examTypeList:
 *     type: object
 *     properties:
 *       examTypeList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/examType'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     ExamType:
 *       $ref: '#/definitions/examType'
 * 
 * /api/examType:
 *   get:
 *     tags:
 *       - examType
 *     summary: Get a list of exam type
 *     description: Get a list of exam type
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isDelete
 *         in: query
 *         description: is delete
 *         required: false
 *         schema:
 *           type: boolean
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
 *         description: A list of exam type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/examTypeList'
 *   post:
 *     tags:
 *       - examType
 *     summary: Create a exam type
 *     description: Create a new exam type
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
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/examType'
 */
export default async(req, res) => {
  const {
    query: { isDelete, offset, limit },
    body: examTypeData,
    method
  } = req

  let examType;
  let total;
  switch (method) {
    case 'GET':
      let filter;
      let pagination;

      if (!await isLogin(req)) {
        res.status(401).json(errorCode.Unauthorized);
        return;
      }

      if (isDelete !== undefined) {
        filter = { is_delete: isDelete === 'true' ? true : false };
      }

      if (offset || limit) {
        pagination = { offset, limit };
      }

      try {
        ({ examType, total } = await getExamType(filter, pagination));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (examType) {
        res.status(200).json({ examTypeList: examType, total });
        return;
      }
      break
    case 'POST':
      if (!await isAdmin(req)) {
        res.status(401).json(errorCode.Unauthorized);
        return;
      }

      if (!examTypeData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        examType = await createExamType(examTypeData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (examType) {
        res.status(201).json(examType);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  res.status(500).json(errorCode.InternalServerError);
};