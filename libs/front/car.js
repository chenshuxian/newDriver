import axios from 'axios';

const URL = '/api/carType';

const getCarList = async () => {
	try {
		const res = await axios.get(`${URL}`);
		return res.data;
	} catch (e) {
		return console.log(`loadExamErr: ${e}`);
	}
};

const createdCarType = async (data) => {
	try {
		const res = await axios.post(`${URL}`, data);
		return res;
	} catch (e) {
		return window.alert('新增失敗請與管理員連絡');
	}
};

const updatedCarType = async (data) => {
	try {
		const res = await axios.patch(`${URL}/${data.car_type_id}`, data);
		return res;
	} catch (e) {
		return console.log(`updatedCar err: ${e}`);
	}
};

const deletedCarType = async (id, del, forever) => {
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

export { getCarList, createdCarType, updatedCarType, deletedCarType };
