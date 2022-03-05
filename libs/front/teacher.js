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

function singleDel(id, list, setModalShow, setList) {
  axios.delete(`/api/exam/${id}`)
    .then((res) => {
      if (res.data) {
        setModalShow(false);
        list.filter(function (item, index, array) {
          if (item.exam_id === res.data.exam_id) {
            let newList = [...list];
            newList.splice(index, 1);
            setList(newList);
            alert('刪除成功');
          }
        });

      }
    })
    .catch((e) => console.log(`upload img ERR: ${e}`));
}

const batchDel = (data, setList) => {

    axios.post('/api/exam/batchDelete',data)
    .then((res) => {
        if(res.data.count){
            getList(setList)
        }
    })
    .catch((e)=> console.log(`exam delete batch err: ${e}`))
}

const updateData = (data, list, setModalShow, setList) => {
    axios.patch(`/api/exam/${data.exam_id}`,data)
    .then((res) => {
      if(res.data){
        setModalShow(false)
        list.filter(function(item, index, array){
          if(item.exam_id === res.data.exam_id){
            let newList = [...list];
            newList[index] = res.data
            setList(newList);
            alert('修改成功')
          }
        })
      
       }
    })
    .catch((e) => console.log(`upload img ERR: ${e}`))
}

const addData = (data, list, setModalShow, setList) => {
    axios.post('/api/exam',data)
    .then((res) => {
      console.log(res);
      setModalShow(false)
      let newList = [...list];
      newList.unshift(res.data)
      setList(newList);
      alert('新增成功')
    })
    .catch((e) => console.log(`insert exam data ERR: ${e}`))
}



export { getTeacherList, getTeacherSelect, singleDel, batchDel, updateData, addData }
