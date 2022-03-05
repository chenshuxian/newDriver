/* eslint-disable import/no-anonymous-default-export */
import { getTrainPeriod, createTrainPeriod } from '../../../libs/trainPeriod';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: trainPeriod
 *     description: The trainPeriod
 * 
 * definitions:
 *   trainPeriod:
 *     type: object
 *     properties:
 *       train_period_id:
 *         type: string
 *         description: The trainPeriod ID
 *         example: 11c2b4f5-c270-454e-a834-ae569a31dc54
 *       train_period_name:
 *         type: string
 *         description: The trainPeriod name
 *         example: 11243A
 *       train_period_start:
 *         type: string
 *         format: date-time
 *         description: The start date of train
 *         example: 2021-10-03T03:00:03.000Z
 *       train_period_end:
 *         type: string
 *         format: date-time
 *         description: The end date of train
 *         example: 2021-10-03T03:00:03.000Z
 *       train_period_exam:
 *         type: string
 *         format: date-time
 *         description: The date of exam
 *         example: 2021-10-03T03:00:03.000Z
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The trainPeriod created trainPeriod
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The trainPeriod updated trainPeriod
 *         example: 2021-10-03T03:00:03.000Z
 *   trainPeriodList:
 *     type: object
 *     properties:
 *       trainPeriodList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/trainPeriod'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     trainPeriod:
 *       $ref: '#/definitions/trainPeriod'
 * 
 * /api/trainPeriod:
 *   get:
 *     tags:
 *       - trainPeriod
 *     summary: Get a list of trainPeriod
 *     description: Get a list of trainPeriod
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
 *       - name: year 
 *         in: query
 *         description: year
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: A list of trainPeriod
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/trainPeriodList'
 *   post:
 *     tags:
 *       - trainPeriod
 *     summary: Create a trainPeriod
 *     description: Create a new trainPeriod
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/trainPeriod'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/trainPeriod'
 */
export default async(req, res) => {
  const {
    query: { offset, limit, year },
    body: trainPeriodData,
    method
  } = req

  let trainPeriod;
  let total;
  switch (method) {
    case 'GET':
      let filter;
      let pagination;

      // if (!await isLogin(req)) {
      //   res.status(401).json(errorCode.Unauthorized);
      //   return;
      // }
 


      if (offset || limit) {
        pagination = { offset, limit };
      } 

      try {
        ({ trainPeriod, total } = await getTrainPeriod(filter, pagination));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
    

      if (trainPeriod) {
        res.status(200).json({ trainPeriodList: trainPeriod, total });
        return;
      }
      break
    case 'POST':
      // if (!await isAdmin(req)) {
      //   res.status(401).json(errorCode.Unauthorized);
      //   return;
      // }

      if (!trainPeriodData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        trainPeriod = await createTrainPeriod(trainPeriodData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (trainPeriod) {
        res.status(201).json(trainPeriod);
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