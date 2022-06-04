import axios from 'axios';

const URL = '/api/user';

const getStudentNumber = async (tpId, sId) => {
	try {
		const res = await axios.get(
			`${URL}/stuNum?trainPeriodId=${tpId}&sourceId=${sId}`
		);
		return res.data.studentNumber;
	} catch (e) {
		return console.log(`loadExamErr: ${e}`);
	}
};

const getUserById = async (id) => {
	try {
		const res = await axios.get(`${URL}/${id}`);
		return res.data;
	} catch (e) {
		return e.response;
	}
};

const createdUser = async (data) => {
	try {
		const res = await axios.post(`${URL}`, data);
		return res;
	} catch (e) {
		return e.response;
	}
};

const updatedUser = async (data) => {
	try {
		const res = await axios.patch(`${URL}/${data.user_uuid}`, data);
		return res;
	} catch (e) {
		return console.log(`updatedUser err: ${e}`);
	}
};

const deletedUser = async (id) => {
	try {
		const res = await axios.delete(`${URL}/${id}`);
		return res;
	} catch (e) {
		return console.log(`deletedUser err: ${e}`);
	}
};

const createCsv = (trainPeriodId, setDisabled) => {
	axios
		.get(`${URL}/createCSV?trainPeriodId=${trainPeriodId}`)
		.then((res) => {
			if (res.data.success) {
				window.alert(res.data.msg);
				setDisabled(false);
			}
		})
		.catch((e) => {
			window.alert(`建檔失敗`);
			setDisabled(true);
		});
};

const getWordTemp = async (userId) => {
	try {
		const res = await axios.get(`${URL}/wordTemp?userId=${userId}`);
		return res;
	} catch (e) {
		return window.alert('取得檔案失敗請與管理員連絡');
	}
};

export {
	getStudentNumber,
	createdUser,
	updatedUser,
	deletedUser,
	createCsv,
	getWordTemp,
	getUserById,
};
