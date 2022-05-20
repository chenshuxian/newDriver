import axios from 'axios';

const URL = '/api/trainPeriod';

const getTrainPeriodList = async () => {
	try {
		const res = await axios.get(`${URL}/trainPeriodList`);
		return res;
	} catch (e) {
		return console.log(`deletedUser err: ${e}`);
	}
};

export { getTrainPeriodList };
