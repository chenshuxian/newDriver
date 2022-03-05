/* eslint-disable import/no-anonymous-default-export */
import { getTrainBook, createTrainBook } from '../../../libs/trainBook';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: trainBook
 *     description: The trainBook
 * 
 * definitions:
 *   trainBook:
 *     type: object
 *     properties:
 *       train_book_id:
 *         type: string
 *         description: The trainBook ID
 *         example: 11c2b4f5-c270-454e-a834-ae569a31dc54
 *       train_period_id:
 *         type: string
 *         description: FK from train_period
 *         example: 11c2b4f5-c270-454e-a834-ae569a31dc33
 *       teacher_id:
 *         type: string
 *         format: string
 *         description: FK from teacher
 *         example: w100382213
 *       time_id:
 *         type: int
 *         format: int
 *         description: FK from time
 *         example: 2021-10-03T03:00:03.000Z
 *       user_id:
 *         type: string
 *         format: string
 *         description: FK from user
 *         example: w200382213
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The trainBook created trainBook
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The trainBook updated trainBook
 *         example: 2021-10-03T03:00:03.000Z
 *   trainBookList:
 *     type: object
 *     properties:
 *       trainBookList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/trainBook'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     trainBook:
 *       $ref: '#/definitions/trainBook'
 * 
 * /api/trainBook:
 *   get:
 *     tags:
 *       - trainBook
 *     summary: Get a list of trainBook
 *     description: Get a list of trainBook
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
 *       - name: trainPeriodId
 *         in: query
 *         description: trainPeriodId
 *         required: false
 *         schema:
 *           type: string
 *       - name: teacherId
 *         in: query
 *         description: teacherId
 *         required: false
 *         schema:
 *           type: string
 *       - name: userId
 *         in: query
 *         description: userId
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of trainBook
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/trainBookList'
 *   post:
 *     tags:
 *       - trainBook
 *     summary: Create a trainBook
 *     description: Create a new trainBook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/trainBook'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/trainBook'
 */
export default async(req, res) => {
  const {
    query: { offset, limit, trainPeriodId, teacherId, userId},
    body: trainBookData,
    method
  } = req

  let trainBook;
  let total;
  switch (method) {
    case 'GET':
      let filter = {};
      let pagination;

      // if (!await isLogin(req)) {
      //   res.status(401).json(errorCode.Unauthorized);
      //   return;
      // }
      if(trainPeriodId) {
        filter['train_period_id'] = trainPeriodId
      }

      if(teacherId){
        filter['teacher_id'] = teacherId
      }

      if(userId){
        filter['user_id'] = userId
      }

      if (offset || limit) {
        pagination = { offset, limit };
      }
     
      try {
        ({ trainBook, total } = await getTrainBook(filter, pagination));
      } catch (e) {
        console.log(`trainBook list err: ${e}`)
        res.status(e.statusCode).json(e);
        return;
      }
    

      if (trainBook) {
        res.status(200).json({ trainBookList: trainBook, total });
        return;
      }
      break
    case 'POST':
      // if (!await isAdmin(req)) {
      //   res.status(401).json(errorCode.Unauthorized);
      //   return;
      // }

      if (!trainBookData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        trainBook = await createtrainBook(trainBookData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (trainBook) {
        res.status(201).json(trainBook);
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