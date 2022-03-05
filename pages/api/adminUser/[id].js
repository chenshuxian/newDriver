/* eslint-disable import/no-anonymous-default-export */
import { getAdminUserById, updateAdminUser, deleteAdminUser } from '../../../libs/adminUser'
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/adminUser/{id}:
 *   get:
 *     tags:
 *       - adminUser
 *     summary: Get a admin user
 *     description: Get a admin user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the admin user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: admin user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/adminUser'
 *   patch:
 *     tags:
 *       - adminUser
 *     summary: Update a admin user
 *     description: Update a admin user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the admin user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/adminUser'
 *     responses:
 *       200:
 *         description: admin user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/adminUser'
 *   delete:
 *     tags:
 *       - adminUser 
 *     summary: Delete a admin user
 *     description: Delete a admin user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the admin user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: admin user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/adminUser'
 */
export default async(req, res) => {
  const {
    query: { id },
    body: adminUserData,
    method,
  } = req

  if (!await isAdmin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  let adminUser
  switch (method) {
    case 'GET':
      try {
        adminUser = await getAdminUserById(id);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'PATCH':
      if (!adminUserData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        adminUser = await updateAdminUser(id, adminUserData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'DELETE':
      try {
        adminUser = await deleteAdminUser(id);
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

  if (adminUser) {
    res.status(200).json(adminUser);
    return;
  }

  res.status(500).json(errorCode.InternalServerError)
};