import { getAllowPeriod } from '../../../libs/trainPeriod';
import errorCode from '../../../libs/errorCode';
export default async (req, res) => {
	let train_period_list;

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
		train_period_list = await getAllowPeriod();
	} catch (e) {
		res.status(e.statusCode).json(e);
		return;
	}

	if (train_period_list) {
		res.status(200).json({ train_period_list });
		return;
	}

	res.status(500).json(errorCode.InternalServerError);
};
