import prisma from './prisma';
import errorCode from './errorCode';
import { parse } from 'json2csv';
import { getToday } from './common';
import { makeFile, zipFile } from './file';

let trainPeriodName;
const FORMAT = 'utf8';

const createCsv = (fields, data, type) => {
	const opts = { fields, header: false, quote: '' };
	try {
		const csv = parse(data, opts);
		const result = makeFile(trainPeriodName, csv, FORMAT, type);
		return result;
	} catch (err) {
		console.error(`csv err: ${err}`);
	}
};

const csvData = async (train_period_id) => {
	let data;
	let SQL = `SELECT user_id, user_born, user_name, user_tel, user_email, user_addr, user_stu_num, source_name, car_type_name, teacher_name, teacher_born, train_period_name, train_period_exam, post_code_id
    FROM users 
    INNER JOIN train_book as tb on tb.train_book_id = users.train_book_id 
    INNER JOIN train_period as tp on tp.train_period_id = tb.train_period_id
    INNER JOIN source on source.source_id = users.source_id 
    INNER JOIN car_type as ct on ct.car_type_id = users.car_type_id
    INNER JOIN teacher on teacher.teacher_id = tb.teacher_id 
    WHERE tb.train_period_id = '${train_period_id}' order by users.user_stu_num`;

	data = await prisma.$queryRawUnsafe(SQL);

	if (!data) {
		throw errorCode.NotFound;
	}

	data = await addData(data);
	trainPeriodName = data[0].train_period_name;
	return data;
};

async function addData(csvJson) {
	for (var i in csvJson) {
		let group = Math.ceil(i / 25);
		group = group == 0 ? 1 : group;
		csvJson[i].user_born = getToday(true, csvJson[i].user_born).replaceAll(
			'-',
			''
		);
		csvJson[i].teacher_born = getToday(
			true,
			csvJson[i].teacher_born
		).replaceAll('-', '');
		csvJson[i].group = '0' + group;
		csvJson[i].group_num = parseInt(i) + 1;
		csvJson[i].road_item = 2;
	}

	return csvJson;
}

export const getCsvFile = async function (trainPeriodId) {
	let data;
	try {
		data = await csvData(trainPeriodId);
	} catch (e) {
		throw errorCode.NotFound;
	}

	let message = `${trainPeriodName} 建檔成功`;
	//申報資料
	//[身分證字號10碼],[出生日期6~7碼],[姓名],[電話10碼],,,,,,,[郵地區號],[地址],[E-mail]
	const applyField = [
		'user_id',
		'user_born',
		'user_name',
		'user_tel',
		'',
		'',
		'',
		'',
		'',
		'',
		'post_code_id',
		'user_addr',
		'user_email',
	];
	//开训名单
	//[身分證字號10碼],[出生日期6~7碼],[姓名],[電話10碼],[學號7碼以下],[來源 1 碼],[手自排 1 碼],[教練身分證字號 10 碼],[教練生日 6~7 碼]
	const startField = [
		'user_id',
		'user_born',
		'user_name',
		'user_tel',
		'user_stu_num',
		'source_name',
		'car_type_name',
		'teacher_id',
		'teacher_born',
	];
	//结训名单
	//[身分證字號 10 碼],[出生日期 6~7 碼],[手自排 1 碼],[教練身分證字號 10 碼],[教練生日 6~7 碼]
	const finishField = [
		'user_id',
		'user_born',
		'car_type_name',
		'teacher_id',
		'teacher_born',
	];
	//考试名单
	//[上課期別代碼 3~6 碼],[身分證字號 10 碼],[出生日期 6~7 碼],[組別],[筆試日期 6~7 碼],[組序號 1~3 碼(必為數字 1~999)]
	const examField = [
		'trian_period_name',
		'user_id',
		'user_born',
		'group',
		'train_period_exam',
		'group_num',
	];
	//路考名单
	// [上課期別代碼 3~6 碼][身分證字號 10 碼][出生日期 6~7 碼][組別][路考日期 6~7 碼][組序號 1~3 碼(必為數字 1~999)] [路考項目 1 碼 (1:只考道路考;2:場考+道路考;3:只考場考)] （使用逗號區隔）
	const roadField = [
		'trian_period_name',
		'user_id',
		'user_born',
		'group',
		'train_period_exam',
		'group_num',
		'road_item',
	];

	await createCsv(applyField, data, 'A');
	await createCsv(startField, data, 'B');
	await createCsv(finishField, data, 'C');
	await createCsv(examField, data, 'D');
	await createCsv(roadField, data, 'E');

	zipFile(trainPeriodName);

	return { message };
};
