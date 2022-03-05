import { getTeacherById, updateTeacher, deleteTeacher } from '../../../libs/teacher'
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/teacher/{id}:
 *   get:
 *     tags:
 *       - teacher
 *     summary: Get a teacher
 *     description: Get a teacher
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: teacher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/teacher'
 *   patch:
 *     tags:
 *       - teacher
 *     summary: Update a teacher
 *     description: Update a teacher
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/teacher'
 *     responses:
 *       200:
 *         description: teacher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/teacher'
 *   delete:
 *     tags:
 *       - teacher 
 *     summary: Delete a teacher
 *     description: Delete a teacher
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: teacher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/teacher'
 */
export default async(req, res) => {
  const {
    query: { id },
    body: teacherData,
    method,
  } = req

  // if (!await isAdmin(req)) {
  //   res.status(401).json(errorCode.Unauthorized);
  //   return;
  // }

  let teacher
  switch (method) {
    case 'GET':
      try {
        teacher = await getTeacherById(id);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'PATCH':
      if (!teacherData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        teacher = await updateTeacher(id, teacherData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'DELETE':
      try {
        teacher = await deleteTeacher(id);
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

  if (teacher) {
    res.status(200).json(teacher);
    return;
  }

  res.status(500).json(errorCode.InternalServerError)
};