/* eslint-disable import/no-anonymous-default-export */
import { getPostCode, createPostCode } from '../../../libs/postCode';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: postCode
 *     description: The postCode
 * 
 * definitions:
 *   postCode:
 *     type: object
 *     properties:
 *       post_code_id:
 *         type: string
 *         description: The postCode ID
 *         example: w100382213
 *       post_code_name:
 *         type: string
 *         description: The postCode name
 *         example: chenshuxian
 *       post_code_addr:
 *         type: string
 *         description: The postCode addr
 *         example: 1985/02/17
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The postCode created time
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The postCode updated time
 *         example: 2021-10-03T03:00:03.000Z
 *       is_delete:
 *         type: boolen
 *         description: The postCode is deleted
 *         example: false
 *   postCodeList:
 *     type: object
 *     properties:
 *       postCodeList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/postCode'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     postCode:
 *       $ref: '#/definitions/postCode'
 * 
 * /api/postCode:
 *   get:
 *     tags:
 *       - postCode
 *     summary: Get a list of postCode
 *     description: Get a list of postCode
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
 *         description: A list of postCode
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/postCodeList'
 *   post:
 *     tags:
 *       - postCode
 *     summary: Create a postCode
 *     description: Create a new postCode
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/postCode'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/postCode'
 */
export default async(req, res) => {
  const {
    query: { isDelete, offset, limit },
    body: postCodeData,
    method
  } = req

  let postCode;
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
        ({ postCode, total } = await getPostCode(filter, pagination));
      } catch (e) {
        console.log(e)
        res.status(e.statusCode).json(e);
        return;
      }
    

      if (postCode) {
        res.status(200).json({ postCodeList: postCode });
        return;
      }
      break
    case 'POST':
      // if (!await isAdmin(req)) {
      //   res.status(401).json(errorCode.Unauthorized);
      //   return;
      // }

      if (!postCodeData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        ({postCode, total} = await createPostCode(postCodeData));
      } catch (e) {
        res.status(e.statusCode).json(e);
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