import axios from "axios";

const URL = '/api/teacher';

const getTeacherList = (setList) => {
    return axios.get(`${URL}?isDelete=false`)
    .then((res)=>
    { 
        //console.log(`examList: ${JSON.stringify(res.data.examList)}`)
        return res.data.teacherList
    })
    .catch((e)=>console.log(`loadExamErr: ${e}`))
}

const getTeacherSelect = () => {
  return axios.get(`${URL}?isDelete=false&list=true`)
  .then((res)=>
  { 
      //console.log(`examList: ${JSON.stringify(res.data.examList)}`)
      return res.data.teacherList
  })
  .catch((e)=>console.log(`loadExamErr: ${e}`))
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





export { getTeacherList, getTeacherSelect, createdTeacher, updatedTeacher, deletedTeacher }
