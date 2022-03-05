/* eslint-disable import/no-anonymous-default-export */
import { getStudentNum } from '../../../libs/user';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/user/stuNum:
 *   get:
 *     tags:
 *       - user
 *     summary: Get a max stuNum of period
 *     description: Get a max stuNum
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
 *         description: student number 
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Auto create student number
 *               example: 期別 + 數字 10247A035
 */
export default async(req, res) => {

    let stu_num;
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
        stu_num = await getStudentNum(trainPeriodId);
    } catch (e) {
        res.status(e.statusCode).json(e);
        return;
    }


    if (stu_num) {
        res.status(200).json({studentNumber: stu_num});
        return;
    }

  res.status(500).json(errorCode.InternalServerError);
};