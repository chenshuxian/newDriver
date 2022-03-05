import { getPostCodeById, updatePostCode, deletePostCode } from '../../../libs/postCode'
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/postCode/{id}:
 *   get:
 *     tags:
 *       - postCode
 *     summary: Get a postCode
 *     description: Get a postCode
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the postCode
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: postCode
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/postCode'
 *   patch:
 *     tags:
 *       - postCode
 *     summary: Update a postCode
 *     description: Update a postCode
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the postCode
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/postCode'
 *     responses:
 *       200:
 *         description: postCode
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/postCode'
 *   delete:
 *     tags:
 *       - postCode 
 *     summary: Delete a postCode
 *     description: Delete a postCode
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the postCode
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: postCode
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/postCode'
 */
export default async(req, res) => {
  const {
    query: { id },
    body: postCodeData,
    method,
  } = req

  // if (!await isAdmin(req)) {
  //   res.status(401).json(errorCode.Unauthorized);
  //   return;
  // }

  let postCode
  switch (method) {
    case 'GET':
      try {
        postCode = await getPostCodeById(id);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'PATCH':
      if (!postCodeData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        postCode = await updatePostCode(id, postCodeData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'DELETE':
      try {
        postCode = await deletePostCode(id);
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

  if (postCode) {
    res.status(200).json(postCode);
    return;
  }

  res.status(500).json(errorCode.InternalServerError)
};