import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import expressions from 'angular-expressions';
import { merge, map } from 'lodash';
import { createTemplate } from './createTemp';
// import PizZipUtils from 'pizzip/utils/index.js';

const fs = require('fs');
const path = require('path');
import { getToday } from './common';
import { INVOICENUMBER, WEBTITLE } from './front/constText';
import {
	nextSaturday,
	nextTuesday,
	isFriday,
	isSaturday,
	addDays,
	isTuesday,
} from 'date-fns';


function getMonDate(d) {
	return getToday('', d).substring(5);
}

function getXuDate(start_day, num) {
	let xd = new Array();
	let days = start_day.split('/');
	let y = parseInt(days[0]) + 1911;
	let m = parseInt(days[1]) - 1;
	let d = days[2];
	xd.push(nextTuesday(new Date(y, m, d)));
	for (let i = 0; i < num; i++) {
		xd.push(nextSaturday(xd[i]));
	}

	return map(xd, getMonDate);
}

function checkSuDate(d, i) {
	// console.log(d);
	d = addDays(d, 1);
	if ((i > 5 && isSaturday(d)) || isFriday(d) || (i < 10 && isTuesday(d))) {
		return checkSuDate(d, i);
	} else {
		return d;
	}
}
// 取得术科时间
function getSuDate(start_day, num) {
	let xd = new Array();
	let days = start_day.split('/');
	let y = parseInt(days[0]) + 1911;
	let m = parseInt(days[1]) - 1;
	let d = days[2];
	xd.push(new Date(y, m, d));
	for (let i = 0; i < num; i++) {
		xd.push(checkSuDate(xd[i], i));
	}

	return map(xd, getMonDate);
}


const wordTemplate = async function (data, tempName) {
	let fileName = `${data.user_name}_${data.user_id}.docx`;
	let startDay = data.train_period_start;
	data.today = getToday(1);
	data.school_name = WEBTITLE;
	data.invoice_title = INVOICENUMBER;
	data.xd = getXuDate(startDay, 5);
	data.sd = getSuDate(startDay, 24);

	const buf = createTemplate(tempName, data);

	// buf is a nodejs Buffer, you can either write it to a
	// file or res.send it with express for example.
	try {
		fs.writeFileSync(path.resolve(`static/word/${fileName}`), buf);
		return `${fileName}`;
	} catch (e) {
		console.log(`write file err ==================== ${e}`);
		return '檔案產生失敗';
	}
};


export {wordTemplate};