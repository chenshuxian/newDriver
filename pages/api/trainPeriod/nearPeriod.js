/* eslint-disable import/no-anonymous-default-export */
import { getNearPeriod } from '../../../libs/trainPeriod';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/trainPeriod/nearPeriod:
 *   get:
 *     tags:
 *       - trainPeriod
 *     summary: Get a this month of trainPeriod
 *     description: Get a trainPeriod
 *     produces:
 *       - application/json
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

    let train_period_id;

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
        train_period_id = await getNearPeriod();
    } catch (e) {
        res.status(e.statusCode).json(e);
        return;
    }


    if (train_period_id) {
        res.status(200).json({thisPeriod: train_period_id});
        return;
    }

  res.status(500).json(errorCode.InternalServerError);
};