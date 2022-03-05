/* eslint-disable import/no-anonymous-default-export */
import { getAdminUser, createAdminUser } from '../../../libs/adminUser';
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: adminUser
 *     description: The admin user
 * 
 * definitions:
 *   adminUser:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: The admin user ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       name:
 *         type: string
 *         description: The admin user name
 *         example: admin
 *       password:
 *         type: string
 *         description: The admin user password
 *         example: admin
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The admin user created time
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The admin user updated time
 *         example: 2021-10-03T03:00:03.000Z
 *   adminUserList:
 *     type: object
 *     properties:
 *       adminUserList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/adminUser'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     AdminUser:
 *       $ref: '#/definitions/adminUser'
 * 
 * /api/adminUser:
 *   get:
 *     tags:
 *       - adminUser
 *     summary: Get a list of admin user
 *     description: Get a list of admin user
 *     produces:
 *       - application/json
 *     parameters:
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
 *         description: A list of admin user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/adminUserList'
 *   post:
 *     tags:
 *       - adminUser
 *     summary: Create a admin user
 *     description: Create a new admin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/adminUser'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/adminUser'
 */
export default async(req, res) => {
  const {
    query: { offset, limit },
    body: adminUserData,
    method
  } = req

  if (!await isAdmin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  let adminUser;
  let total;
  switch (method) {
    case 'GET':
      let filter;
      let pagination;

      if (offset || limit) {
        pagination = { offset, limit };
      }

      try {
        ({ adminUser, total } = await getAdminUser(filter, pagination));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (adminUser) {
        res.status(200).json({ adminUserList: adminUser, total });
        return;
      }
      break
    case 'POST':
      if (!adminUserData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        adminUser = await createAdminUser(adminUserData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (adminUser) {
        res.status(201).json(adminUser);
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