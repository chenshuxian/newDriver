import axios from 'axios';

const URL = '/api/source';

const getSourceList = async () => {
	try {
		const res = await axios.get(`${URL}`);
		return res.data;
	} catch (e) {
		return console.log(`loadExamErr: ${e}`);
	}
};

const createdSource = async (data) => {
	try {
		const res = await axios.post(`${URL}`, data);
		return res;
	} catch (e) {
		return window.alert('新增失敗請與管理員連絡');
	}
};

const updatedSource = async (data) => {
	try {
		const res = await axios.patch(`${URL}/${data.source_id}`, data);
		return res;
	} catch (e) {
		return console.log(`updatedSource err: ${e}`);
	}
};

const deletedSource = async (id, del, forever) => {
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

export { getSourceList, createdSource, updatedSource, deletedSource };
