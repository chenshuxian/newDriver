import { wordTemplate } from '../../../libs/wordTemplate';
import errorCode from '../../../libs/errorCode';

export default async (req, res) => {
	let wordTemp;
	const { body: userData } = req;

	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST']);
		res.status(405).json(errorCode.MethodNotAllowed);
		return;
	}

	if (!userData) {
		res.status(400).json(errorCode.BadRequest);
		return;
	}

	try {
		wordTemp = await wordTemplate(userData);
	} catch (e) {
		console.log(`wordTemp err: ${e}`);
		res.status(e.statusCode).json(e);
		return;
	}

	if (wordTemp) {
		res.status(200).json({ status: wordTemp });
		return;
	}

	res.status(500).json(errorCode.InternalServerError);
};
