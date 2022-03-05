/* eslint-disable import/no-anonymous-default-export */
import { getSource, createSource } from '../../../libs/source';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: source
 *     description: user apply from 
 * 
 * definitions:
 *   source:
 *     type: object
 *     properties:
 *       source_id:
 *         type: string
 *         description: The source ID
 *         example: 11c2b4f5-c270-454e-a834-ae569a31dc54
 *       source_name:
 *         type: string
 *         description: The source name
 *         example: 團體報名
 *       create_source:
 *         type: string
 *         format: date-source
 *         description: The source created source
 *         example: 2021-10-03T03:00:03.000Z
 *       update_source:
 *         type: string
 *         format: date-source
 *         description: The source updated source
 *         example: 2021-10-03T03:00:03.000Z
 *       is_delete:
 *         type: boolen
 *         description: The source is deleted
 *         example: false
 *   sourceList:
 *     type: object
 *     properties:
 *       sourceList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/source'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     source:
 *       $ref: '#/definitions/source'
 * 
 * /api/source:
 *   get:
 *     tags:
 *       - source
 *     summary: Get a list of source
 *     description: Get a list of source
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
 *         description: A list of source
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/sourceList'
 *   post:
 *     tags:
 *       - source
 *     summary: Create a source
 *     description: Create a new source
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/source'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/source'
 */
export default async(req, res) => {
  const {
    query: { isDelete, offset, limit },
    body: sourceData,
    method
  } = req

  let source;
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
        ({ source, total } = await getSource(filter, pagination));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
    

      if (source) {
        res.status(200).json({ sourceList: source, total });
        return;
      }
      break
    case 'POST':
      // if (!await isAdmin(req)) {
      //   res.status(401).json(errorCode.Unauthorized);
      //   return;
      // }

      if (!sourceData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        source = await createSource(sourceData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (source) {
        res.status(201).json(source);
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