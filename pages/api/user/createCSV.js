/* eslint-disable import/no-anonymous-default-export */
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';
import { getCsvFile } from '../../../libs/createCsv';

/**
 * @swagger
 * /api/user/createCSV:
 *   get:
 *     tags:
 *       - user
 *     summary: create csv of user for gov of driver
 *     description: create csv of user for gov of driver
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: trainPeriodId
 *         in: query
 *         description: trianPeriodId
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: file name
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: csv tar file name
 *               example: 26000010246B.tar
 */
export default async(req, res) => {

    let csv;
    const {
        query: { trainPeriodId },
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
        csv = await getCsvFile(trainPeriodId);
    } catch (e) {
        res.status(e.statusCode).json(e);
        return;
    }

    if (csv) {
        res.status(200).json({success: true, msg: csv.message});
        return;
    } 

  res.status(500).json(errorCode.InternalServerError);
};