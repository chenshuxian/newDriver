import axios from "axios";

const URL = '/api/teacher';

const getTeacherList = async (setList) => {
    try {
		const res = await axios.get(`${URL}?isDelete=false`);
		return res.data.teacherList;
	} catch (e) {
		return console.log(`loadExamErr: ${e}`);
	}
}

const createdTeacher = async (data) => {
	try {
		const res = await axios.post(`${URL}`, data);
		return res;
	} catch (e) {
		return window.alert('新增失敗請與管理員連絡');
	}
};

const updatedTeacher = async (data) => {
	try {
		const res = await axios.patch(`${URL}/${data.teacher_id}`, data);
		return res;
	} catch (e) {
		return console.log(`updatedUser err: ${e}`);
	}
};

const deletedTeacher = async (id) => {
	try {
		const res = await axios.delete(`${URL}/${id}`);
		return res;
	} catch (e) {
		return console.log(`deletedUser err: ${e}`);
	}
};





export { getTeacherList, createdTeacher, updatedTeacher, deletedTeacher }
