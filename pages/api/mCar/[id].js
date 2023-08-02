import { getmCarById, deletemCar, updatemCar } from '../../../libs/mCar'
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/mCar/{id}:
 *   get:
 *     tags:
 *       - mCar
 *     summary: Get a mCar
 *     description: Get a mCar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the mCar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: mCar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/mCar'
 *   patch:
 *     tags:
 *       - mCar
 *     summary: Update a mCar
 *     description: Update a mCar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the mCar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/mCar'
 *     responses:
 *       200:
 *         description: mCar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/mCar'
 *   delete:
 *     tags:
 *       - mCar 
 *     summary: Delete a mCar
 *     description: Delete a mCar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the mCar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: mCar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/mCar'
 */
export default async(req, res) => {
  const {
    query: { id },
    body: mCarData,
    method,
  } = req

  // if (!await isAdmin(req)) {
  //   res.status(401).json(errorCode.Unauthorized);
  //   return;
  // }

  let mCar
  switch (method) {
    case 'GET':
      try {
        mCar = await getmCarById(id);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'PATCH':
      if (!mCarData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        mCar = await updatemCar(id, mCarData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'DELETE':
      try {
        mCar = await deletemCar(id);
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

  if (mCar) {
    res.status(200).json(mCar);
    return;
  }

  res.status(500).json(errorCode.InternalServerError)
};