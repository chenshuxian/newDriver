import { getTrainPeriodById, updateTrainPeriod, deleteTrainPeriod } from '../../../libs/trainPeriod'
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/trainPeriod/{id}:
 *   get:
 *     tags:
 *       - trainPeriod
 *     summary: Get a trainPeriod
 *     description: Get a trainPeriod
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the trainPeriod
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: trainPeriod
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/trainPeriod'
 *   patch:
 *     tags:
 *       - trainPeriod
 *     summary: Update a trainPeriod
 *     description: Update a trainPeriod
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the trainPeriod
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/trainPeriod'
 *     responses:
 *       200:
 *         description: trainPeriod
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/trainPeriod'
 *   delete:
 *     tags:
 *       - trainPeriod 
 *     summary: Delete a trainPeriod
 *     description: Delete a trainPeriod
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the trainPeriod
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: trainPeriod
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/trainPeriod'
 */
export default async(req, res) => {
  const {
    query: { id },
    body: trainPeriodData,
    method,
  } = req

  // if (!await isAdmin(req)) {
  //   res.status(401).json(errorCode.Unauthorized);
  //   return;
  // }

  let trainPeriod
  switch (method) {
    case 'GET':
      try {
        trainPeriod = await getTrainPeriodById(id);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'PATCH':
      if (!trainPeriodData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        trainPeriod = await updateTrainPeriod(id, trainPeriodData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'DELETE':
      try {
        trainPeriod = await deleteTrainPeriod(id);
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

  if (trainPeriod) {
    res.status(200).json(trainPeriod);
    return;
  }

  res.status(500).json(errorCode.InternalServerError)
};