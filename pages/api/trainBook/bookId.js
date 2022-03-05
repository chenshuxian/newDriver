/* eslint-disable import/no-anonymous-default-export */
import { getTrainBookId } from '../../../libs/trainBook';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/trainBook/bookId:
 *   get:
 *     tags:
 *       - trainBook
 *     summary: Get a Id of trainBook
 *     description: Get a trainBookId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: train_period_id
 *         in: query
 *         description: train_period_id
 *         required: false
 *         schema:
 *           type: string
 *       - name: teacher_id
 *         in: query
 *         description: teacher_id
 *         required: false
 *         schema:
 *           type: string
 *       - name: time_id
 *         in: query
 *         description: time_id
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A of trainPeriod
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: The trainPeriod Id
 *               example: ED202101
 */
export default async(req, res) => {

    let train_book_id;
    const {
        query: {train_period_id, teacher_id, time_id},
      } = req

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        res.status(405).json(errorCode.MethodNotAllowed);
        return;
    }

//   if (!await isAdmin(req)) {
//     res.status(401).json(errorCode.Unauthorized);
//     return;
//   }
    try {
        train_book_id = await getTrainBookId(train_period_id, teacher_id, time_id);
    } catch (e) {
        console.log(e)
        res.status(e.statusCode).json(e);
        return;
    }

    if (train_book_id) {
        res.status(200).json({trainBookId: train_book_id});
        return;
    }

  res.status(500).json(errorCode.InternalServerError);
};