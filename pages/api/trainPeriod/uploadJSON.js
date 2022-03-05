import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';
import { uploadJSON } from '../../../libs/uploadFile';
import { createManyTrainPeriod } from '../../../libs/trainPeriod';

/**
 * @swagger
 * /api/trainPeriod/uploadJSON:
 *   post:
 *     tags:
 *       - trainPeriod 
 *     summary: Upload a json
 *     description: Upload a json
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The trainPeriod
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               properties:
 *                 trainPeriod:
 *                   type: string
 *                   description: The trainPeriod count
 *                   example: 10
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json(errorCode.MethodNotAllowed);
    return;
  }

//   if (!await isAdmin(req)) {
//     res.status(401).json(errorCode.Unauthorized);
//     return;
//   } 

  return uploadJSON(req, res, createManyTrainPeriod);
};

export const config = {
  api: {
    bodyParser: false,
  },
}