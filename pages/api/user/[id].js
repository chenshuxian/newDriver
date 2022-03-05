import { getUserById, updateUser, deleteUser } from '../../../libs/user'
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     tags:
 *       - user
 *     summary: Get a user
 *     description: Get a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/user'
 *   patch:
 *     tags:
 *       - user
 *     summary: Update a user
 *     description: Update a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/user'
 *     responses:
 *       200:
 *         description: user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/user'
 *   delete:
 *     tags:
 *       - user 
 *     summary: Delete a user
 *     description: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/user'
 */
export default async(req, res) => {
  const {
    query: { id },
    body: userData,
    method,
  } = req

  // if (!await isAdmin(req)) {
  //   res.status(401).json(errorCode.Unauthorized);
  //   return;
  // }

  let user
  switch (method) {
    case 'GET':
      try {
        user = await getUserById(id);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'PATCH':
      if (!userData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        user = await updateUser(id, userData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'DELETE':
      try {
        user = await deleteUser(id);
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

  if (user) {
    res.status(200).json(user);
    return;
  }

  res.status(500).json(errorCode.InternalServerError)
};