/* eslint-disable import/no-anonymous-default-export */
import { getTime, createTime } from '../../../libs/time';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: time
 *     description: The time
 * 
 * definitions:
 *   time:
 *     type: object
 *     properties:
 *       time_id:
 *         type: int
 *         description: The time ID
 *         example: 17
 *       time_name:
 *         type: string
 *         description: The time name
 *         example: chenshuxian
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The time created time
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The time updated time
 *         example: 2021-10-03T03:00:03.000Z
 *       is_delete:
 *         type: boolen
 *         description: The time is deleted
 *         example: false
 *   timeList:
 *     type: object
 *     properties:
 *       timeList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/time'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     time:
 *       $ref: '#/definitions/time'
 * 
 * /api/time:
 *   get:
 *     tags:
 *       - time
 *     summary: Get a list of time
 *     description: Get a list of time
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
 *         description: A list of time
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/timeList'
 *   post:
 *     tags:
 *       - time
 *     summary: Create a time
 *     description: Create a new time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/time'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/time'
 */
export default async(req, res) => {
  const {
    query: { isDelete, offset, limit },
    body: timeData,
    method
  } = req

  let time;
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
        ({ time, total } = await getTime(filter, pagination));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
    

      if (time) {
        res.status(200).json({ timeList: time, total });
        return;
      }
      break
    case 'POST':
      // if (!await isAdmin(req)) {
      //   res.status(401).json(errorCode.Unauthorized);
      //   return;
      // }

      if (!timeData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        time = await createTime(timeData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (time) {
        res.status(201).json(time);
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