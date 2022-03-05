import axios from "axios";

const URL = '/api/exam';

const createdExam = async (data) => {
    try {
    const res = await axios.post(`${URL}`, data);
    return res;
  } catch (e) {
    return window.alert('新增失敗請與管理員連絡');
  }
}

const updatedExam = async (data) => {
    try {
    const res = await axios.patch(`${URL}/${data.exam_id}`, data);
    return res;
  } catch (e) {
    return console.log(`updatedExam err: ${e}`);
  }
}

const deletedExam = async (id) => {
  try {
    const res = await axios.delete(`${URL}/${id}`);
    return res;
  } catch (e) {
    return console.log(`deletedExam err: ${e}`);
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

export { createdExam, updatedExam, deletedExam, createCsv }