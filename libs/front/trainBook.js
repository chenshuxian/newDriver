import axios from "axios";
import { objectFlat } from "../common";

const URL = '/api/trainBook';

const getBookTime = (tpId = '', tId = '', user_id = '') => {

    return axios.get(`${URL}?trainPeriodId=${tpId}&teacherId=${tId}&userId=${user_id}`
    ).then(async function(res) {
        return objectFlat(res.data.trainBookList, 'time_id', 'time_name');
    });
}

const getBookId = (tpId, tId, time_id) => {
    return axios.get(`${URL}/bookId?train_period_id=${tpId}&teacher_id=${tId}&time_id=${time_id}`
    ).then(async function(res) {
        return res.data.trainBookId[0].train_book_id;
    });
}

export { getBookTime, getBookId}