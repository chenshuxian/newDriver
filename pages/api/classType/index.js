/* eslint-disable import/no-anonymous-default-export */
import { getClassType, createClassType } from '../../../libs/classType';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: classType
 *     description: The classType
 * 
 * definitions:
 *   classType:
 *     type: object
 *     properties:
 *       class_type_id:
 *         type: string
 *         description: The class_type ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       class_type_name:
 *         type: string
 *         description: The class_type name
 *         example: chenshuxian
 *       create_time:
 *         type: string
 *         format: date-class_type
 *         description: The time created class_type
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-class_type
 *         description: The time updated class_type
 *         example: 2021-10-03T03:00:03.000Z
 *       is_delete:
 *         type: boolen
 *         description: The class_type is deleted
 *         example: false
 *   classTypeList:
 *     type: object
 *     properties:
 *       classTypeList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/classType'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     class_type:
 *       $ref: '#/definitions/classType'
 * 
 * /api/classType:
 *   get:
 *     tags:
 *       - classType
 *     summary: Get a list of classType
 *     description: Get a list of classType
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
 *         description: A list of classType
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/classTypeList'
 *   post:
 *     tags:
 *       - classType
 *     summary: Create a classType
 *     description: Create a new classType
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/classType'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/classType'
 */
export default async(req, res) => {
  const {
    query: { isDelete, offset, limit },
    body: classTypeData,
    method
  } = req

  let classType;
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
        ({ classType, total } = await getClassType(filter, pagination));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
    

      if (classType) {
        res.status(200).json({ classTypeList: classType, total });
        return;
      }
      break
    case 'POST':
      // if (!await isAdmin(req)) {
      //   res.status(401).json(errorCode.Unauthorized);
      //   return;
      // }

      if (!classTypeData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        classType = await createClassType(classTypeData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (classType) {
        res.status(201).json(classType);
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