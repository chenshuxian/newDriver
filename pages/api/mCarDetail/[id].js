import { getmCarDetailById, deletemCarDetail, updatemCarDetail } from '../../../libs/mCarDetail'
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/mCarDetail/{id}:
 *   get:
 *     tags:
 *       - mCarDetail
 *     summary: Get a mCarDetail
 *     description: Get a mCarDetail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the mCarDetail
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: mCarDetail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/mCarDetail'
 *   patch:
 *     tags:
 *       - mCarDetail
 *     summary: Update a mCarDetail
 *     description: Update a mCarDetail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the mCarDetail
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/mCarDetail'
 *     responses:
 *       200:
 *         description: mCarDetail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/mCarDetail'
 *   delete:
 *     tags:
 *       - mCarDetail 
 *     summary: Delete a mCarDetail
 *     description: Delete a mCarDetail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the mCarDetail
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: mCarDetail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/mCarDetail'
 */
export default async(req, res) => {
  const {
    query: { id },
    body: mCarDetailData,
    method,
  } = req

  // if (!await isAdmin(req)) {
  //   res.status(401).json(errorCode.Unauthorized);
  //   return;
  // }

  let mCarDetail
  switch (method) {
    case 'GET':
      try {
        mCarDetail = await getmCarDetailById(id);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'PATCH':
      if (!mCarDetailData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        mCarDetail = await updatemCarDetail(id, mCarDetailData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'DELETE':
      try {
        mCarDetail = await deletemCarDetail(id);
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

  if (mCarDetail) {
    res.status(200).json(mCarDetail);
    return;
  }

  res.status(500).json(errorCode.InternalServerError)
};