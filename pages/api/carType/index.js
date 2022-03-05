/* eslint-disable import/no-anonymous-default-export */
import { getCarType, createCarType } from '../../../libs/carType';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: carType
 *     description: The carType
 * 
 * definitions:
 *   carType:
 *     type: object
 *     properties:
 *       car_type_id:
 *         type: string
 *         description: The carType ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       car_type_name:
 *         type: string
 *         description: The carType name
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
 *         description: The carType is deleted
 *         example: false
 *   carTypeList:
 *     type: object
 *     properties:
 *       carTypeList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/carType'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     carType:
 *       $ref: '#/definitions/carType'
 * 
 * /api/carType:
 *   get:
 *     tags:
 *       - carType
 *     summary: Get a list of carType
 *     description: Get a list of carType
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
 *         description: A list of carType
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/carTypeList'
 *   post:
 *     tags:
 *       - carType
 *     summary: Create a carType
 *     description: Create a new carType
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/carType'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/carType'
 */
export default async(req, res) => {
  const {
    query: { isDelete, offset, limit },
    body: carTypeData,
    method
  } = req

  let carType;
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
        ({ carType, total } = await getCarType(filter, pagination));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
    

      if (carType) {
        res.status(200).json({ carTypeList: carType, total });
        return;
      }
      break
    case 'POST':
      // if (!await isAdmin(req)) {
      //   res.status(401).json(errorCode.Unauthorized);
      //   return;
      // }

      if (!carTypeData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        carType = await createCarType(carTypeData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (carType) {
        res.status(201).json(carType);
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