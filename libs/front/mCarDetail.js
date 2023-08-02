import axios from 'axios';

const URL = '/api/mCarDetail';

const getmCarDetailList = async () => {
	try {
		const res = await axios.get(`${URL}`);
		return res.data.list;
	} catch (e) {
		return console.log(`loadExamErr: ${e}`);
	}
};

const createdmCarDetail = async (data) => {
	try {
		const res = await axios.post(`${URL}`, data);
		return res;
	} catch (e) {
		return window.alert('新增失敗請與管理員連絡');
	}
};

const updatedmCarDetail = async (data) => {
	try {
		const res = await axios.patch(`${URL}/${data.id}`, data);
		return res;
	} catch (e) {
		return console.log(`updatedCar err: ${e}`);
	}
};

const deletedmCarDetail = async (id, del, forever) => {
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

export { getmCarDetailList, createdmCarDetail, updatedmCarDetail, deletedmCarDetail };
