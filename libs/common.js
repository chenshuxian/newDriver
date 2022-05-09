import { YEAR } from './front/constText';
import axios from 'axios';

const selectList = (arr, id, value) => {
	let newArr;
	newArr = arr.reduce((a, c) => [...a, { [c[`${id}`]]: c[`${value}`] }], []);

	return newArr;
};

const objectFlat = (arr, key, value) => {
	let b = {};
	arr.map((c) => {
		b[c[`${key}`]] = c[`${value}`];
	}, b);

	return b;
};

const objectAutoComp = (arr, key, value) => {
	let newA;
	newA = arr.map((c) => {
		return { label: c.time_name, id: c.time_id };
	});

	return newA;
};

const getToday = (mi = false, day) => {
	let today = new Date();
	if (day) {
		today = new Date(day);
	}
	let y = today.getFullYear();
	let m = today.getMonth() + 1;
	let d = today.getDate();

	if (mi) {
		y = y - YEAR;
		if (y < 100) {
			y = `0${y}`;
		}
	}

	m = m < 10 ? `0${m}` : m;
	d = d < 10 ? `0${d}` : d;

	return `${y}-${m}-${d}`;
};

const getFirstId = (obj) => {
	return Object.keys(obj)[0];
};

//1110112 => 111/01/12
const strToDate = (str) => {
	let y = str.substr(0, 3);
	let m = str.substr(3, 2);
	let d = str.substr(5, 2);

	return `${y}/${m}/${d}`;
};

function download(url, setDisabled) {
	axios({
		url,
		method: 'GET',
		responseType: 'blob',
	})
		.then((response) => {
			console.log(response);
			setDisabled(false);
		})
		.catch((err) => setDisabled(true));
}

export {
	selectList,
	objectFlat,
	objectAutoComp,
	getToday,
	getFirstId,
	strToDate,
	download,
};
