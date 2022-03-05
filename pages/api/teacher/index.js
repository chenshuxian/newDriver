/* eslint-disable import/no-anonymous-default-export */
import { getTeacher, createTeacher } from '../../../libs/teacher';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: teacher
 *     description: The teacher
 * 
 * definitions:
 *   teacher:
 *     type: object
 *     properties:
 *       teacher_id:
 *         type: string
 *         description: The teacher ID
 *         example: w100382213
 *       teacher_name:
 *         type: string
 *         description: The teacher name
 *         example: chenshuxian
 *       teacher_born:
 *         type: string
 *         description: The teacher born
 *         example: 1985/02/17
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The teacher created time
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The teacher updated time
 *         example: 2021-10-03T03:00:03.000Z
 *       is_delete:
 *         type: boolen
 *         description: The teacher is deleted
 *         example: false
 *   teacherList:
 *     type: object
 *     properties:
 *       teacherList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/teacher'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     teacher:
 *       $ref: '#/definitions/teacher'
 * 
 * /api/teacher:
 *   get:
 *     tags:
 *       - teacher
 *     summary: Get a list of teacher
 *     description: Get a list of teacher
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isDelete
 *         in: query
 *         description: Is the delete
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
 *         description: A list of teacher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/teacherList'
 *   post:
 *     tags:
 *       - teacher
 *     summary: Create a teacher
 *     description: Create a new teacher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/teacher'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/teacher'
 */
export default async(req, res) => {
  const {
    query: { isDelete, offset, limit },
    body: teacherData,
    method
  } = req

  let teacher;
  let total;
  switch (method) {
    case 'GET':
      let filter;
      let pagination;

      // if (!await isLogin(req)) {
      //   res.status(401).json(errorCode.Unauthorized);
      //   return;
      // }

      if (isDelete !== undefined) {
        filter = { is_delete: isDelete === 'true' ? true : false };
      }

      if (offset || limit) {
        pagination = { offset, limit };
      }

      try {
        ({ teacher, total } = await getTeacher(filter, pagination));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
    

      if (teacher) {
        res.status(200).json({ teacherList: teacher, total });
        return;
      }
      break
    case 'POST':
      // if (!await isAdmin(req)) {
      //   res.status(401).json(errorCode.Unauthorized);
      //   return;
      // }

      if (!teacherData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        ({teacher, total} = await createTeacher(teacherData));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (teacher) {
        res.status(201).json({teacher, trainBookTotal: total});
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