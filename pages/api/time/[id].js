import { getTimeById, updateTime, deleteTime } from '../../../libs/time'
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/time/{id}:
 *   get:
 *     tags:
 *       - time
 *     summary: Get a time
 *     description: Get a time
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the time
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: time
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/time'
 *   patch:
 *     tags:
 *       - time
 *     summary: Update a time
 *     description: Update a time
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the time
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/time'
 *     responses:
 *       200:
 *         description: time
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/time'
 *   delete:
 *     tags:
 *       - time 
 *     summary: Delete a time
 *     description: Delete a time
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the time
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: time
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/time'
 */
export default async(req, res) => {
  const {
    query: { id },
    body: timeData,
    method,
  } = req

  // if (!await isAdmin(req)) {
  //   res.status(401).json(errorCode.Unauthorized);
  //   return;
  // }

  let time
  let Id = parseInt(id)
  switch (method) {
    case 'GET':
      try {
        time = await getTimeById(Id);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'PATCH':
      if (!timeData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        time = await updateTime(Id, timeData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'DELETE':
      try {
        time = await deleteTime(Id);
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

  if (time) {
    res.status(200).json(time);
    return;
  }

  res.status(500).json(errorCode.InternalServerError)
};