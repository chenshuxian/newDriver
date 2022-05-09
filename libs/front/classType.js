import axios from 'axios';

const URL = '/api/classType';

const getClassList = async () => {
	try {
		const res = await axios.get(`${URL}`);
		return res.data;
	} catch (e) {
		return console.log(`loadExamErr: ${e}`);
	}
};

const createdClassType = async (data) => {
	try {
		const res = await axios.post(`${URL}`, data);
		return res;
	} catch (e) {
		return window.alert('新增失敗請與管理員連絡');
	}
};

const updatedClassType = async (data) => {
	try {
		const res = await axios.patch(`${URL}/${data.class_type_id}`, data);
		return res;
	} catch (e) {
		return console.log(`updatedClass err: ${e}`);
	}
};

const deletedClassType = async (id, del, forever) => {
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

export { getClassList, createdClassType, updatedClassType, deletedClassType };
