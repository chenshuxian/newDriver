import axios from "axios";

const URL = '/api/user';

const getStudentNumber = async (tpId) => {
    try {
    const res = await axios.get(`${URL}/stuNum?trainPeriodId=${tpId}`);
    return res.data.studentNumber;
  } catch (e) {
    return console.log(`loadExamErr: ${e}`);
  }
}

const createdUser = async (data) => {
    try {
    const res = await axios.post(`${URL}`, data);
    return res;
  } catch (e) {
    return window.alert('新增失敗請與管理員連絡');
  }
}

const updatedUser = async (data) => {
    try {
    const res = await axios.patch(`${URL}/${data.user_id}`, data);
    return res;
  } catch (e) {
    return console.log(`updatedUser err: ${e}`);
  }
}

const deletedUser = async (id) => {
  try {
    const res = await axios.delete(`${URL}/${id}`);
    return res;
  } catch (e) {
    return console.log(`deletedUser err: ${e}`);
  }
}

const createCsv = (trainPeriodId, setDisabled) => {
  axios.get(`${URL}/createCSV?trainPeriodId=${trainPeriodId}`)
  .then((res)=>{
    if(res.data.success){
      window.alert(res.data.msg);
      setDisabled(false);
    }
  }).catch((e) => {
    window.alert(`建檔失敗`);
    setDisabled(true);
  })
}

export { getStudentNumber, createdUser, updatedUser, deletedUser, createCsv }