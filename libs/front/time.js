import axios from 'axios';

const URL = '/api/time';

const getTimeList = async () => {
	try {
		const res = await axios.get(`${URL}?isDelete=false`);
		return res.data.timeList;
	} catch (e) {
		return console.log(`loadExamErr: ${e}`);
	}
};

const createdTime = async (data) => {
	try {
		const res = await axios.post(`${URL}`, data);
		return res;
	} catch (e) {
		return window.alert('新增失敗請與管理員連絡');
	}
};

const updatedTime = async (data) => {
	try {
		const res = await axios.patch(`${URL}/${data.time_id}`, data);
		return res;
	} catch (e) {
		return console.log(`updatedTime err: ${e}`);
	}
};

const deletedTime = async (id, del, forever) => {
	try {
		const res = await axios.delete(`${URL}/${id}`, {
			data: {
				del,
				forever,
			},
		});
		return res;
	} catch (e) {
		return console.log(`deletedUser err: ${e}`);
	}
};

export { getTimeList, createdTime, updatedTime, deletedTime };
