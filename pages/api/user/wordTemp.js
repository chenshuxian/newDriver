import { getContractData } from '../../../libs/user';
import errorCode from '../../../libs/errorCode';
import { wordTemplate } from '../../../libs/wordTemplate';

export default async (req, res) => {
	let wordTemp, data;
	const {
		query: { userId, fileName },
	} = req;

	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		res.status(405).json(errorCode.MethodNotAllowed);
		return;
	}

	try {
		[data] = await getContractData(userId);
		data.user_gender = data.user_gender == 1 ? '男' : '女';
		wordTemp = await wordTemplate(data,fileName);
	} catch (e) {
		console.log(`wordTemp err: ${e}`);
		res.status(e.statusCode).json(e);
		return;
	}

	if (wordTemp) {
		res.status(200).json({ url: wordTemp });
		return;
	}

	res.status(500).json(errorCode.InternalServerError);
};
