import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import expressions from 'angular-expressions';
import { merge, map } from 'lodash';
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

function angularParser(tag) {
	if (tag === '.') {
		return {
			get: function (s) {
				return s;
			},
		};
	}
	const expr = expressions.compile(tag.replace(/(’|“|”|‘)/g, "'"));
	return {
		get: function (scope, context) {
			let obj = {};
			const scopeList = context.scopeList;
			const num = context.num;
			for (let i = 0, len = num + 1; i < len; i++) {
				obj = merge(obj, scopeList[i]);
			}
			return expr(scope, obj);
		},
	};
}

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

export const wordTemplate = async function (data) {
	let type = data.train_period_name.substr(-1);
	let fileName = `${data.user_name}_${data.user_id}.docx`;
	let startDay = data.train_period_start;
	data.today = getToday(1);
	data.school_name = WEBTITLE;
	data.invoice_title = INVOICENUMBER;
	data.xd = getXuDate(startDay, 5);
	data.sd = getSuDate(startDay, 24);

	const content = fs.readFileSync(
		path.resolve(`static/word/contract.docx`),
		'binary'
	);

	const zip = new PizZip(content);

	const doc = new Docxtemplater(zip, {
		paragraphLoop: true,
		linebreaks: true,
		parser: angularParser,
	});

	// Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
	doc.render(data);

	const buf = doc.getZip().generate({
		type: 'nodebuffer',
		// compression: DEFLATE adds a compression step.
		// For a 50MB output document, expect 500ms additional CPU time
		compression: 'DEFLATE',
	});

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
