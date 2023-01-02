import prisma from './prisma';
import errorCode from './errorCode';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { getTrainBookIdForBook } from '../libs/trainBook';
import { getTrainPeriodLimit } from './trainPeriod';
import { func } from 'prop-types';

dayjs.extend(isToday);
let teacherOne = 'W100510271'; //薛弘
let teacherTwo = 'W100371863'; //薛逸華

// 取得考官教學人員總數
// 參數: 考官id, 考試期別
// 回傳 count 數
const getExamCount = async function (tId, tpId) {
	let count;
	let SQL = `select count(teacher_id) as count from users
			   inner join train_book as tb on tb.train_book_id = users.train_book_id
			   inner join train_period as tp on tp.train_period_id = tb.train_period_id
			   where tp.train_period_id = '${tpId}' and teacher_id = '${tId}'
			   `;

	[{ count }] = await prisma.$queryRawUnsafe(`${SQL}`);

	return count;
};

// 設定使用者考試群
// 依原廠考照教練分群
// 'W100510271' 薛弘  'W100371863' 薛逸華
// 若教練所教學員超過10人直接歸為一組，其於的進行合併
// 1. 先取得考官的教學人數，如小於10，將其補齊
const setGroupNum = async function (groupId, tpId, tId = false) {
	console.log(`groupid: ${groupId}`);
	let maxCount = 10;
	let sqladd;
	let sqlInit = `update users 
	inner join train_book as tb on tb.train_book_id = users.train_book_id
	inner join train_period as tp on tp.train_period_id = tb.train_period_id
	set exam_group = ${groupId}`;
	let sql = `${sqlInit} where tp.train_period_id = '${tpId}' and teacher_id = '${tId}'`;

	if (tId) {
		// 特殊考官設定
		let count = await getExamCount(tId, tpId);
		let sub = maxCount - count;
		await prisma.$queryRawUnsafe(`${sql}`);
		// 將 group 人數增加到10人
		if (sub > 0) {
			sqladd = `update users set exam_group = ${groupId} where 
			user_id in (
				select user_id from (
				select user_id from users
				inner join train_book as tb on tb.train_book_id = users.train_book_id
				inner join train_period as tp on tp.train_period_id = tb.train_period_id 
				where tp.train_period_id = '${tpId}' and exam_group = 0 and (teacher_id <> '${teacherOne}' or teacher_id <>'${teacherTwo}')
				limit ${sub}
				) as tmp )`;
			try {
				await prisma.$queryRawUnsafe(`${sqladd}`);
			} catch (e) {
				console.log(`err: ${e}`);
			}
		}
	} else {
		// 將剩於還沒設定的學員設為一個group
		sqladd = `${sqlInit} where tp.train_period_id = '${tpId}' and users.exam_group = 0`;
		try {
			await prisma.$queryRawUnsafe(`${sqladd}`);
		} catch (e) {
			console.log(e);
		}
	}
};

const getUser = async function (filter, page) {
	let user;
	let total, start, limit;
	let num = 100;
	let prismaArgs = {};

	//(select score from score where score.user_id = users.user_id order by update_time desc limit 1) as score, (select update_time from score where score.user_id = users.user_id order by update_time desc limit 1) as last_play_time

	let SELECT = `Select users.*, tp.*, tb.teacher_id, tb.time_id FROM users left join train_book as tb on tb.train_book_id = users.train_book_id left join train_period as tp on tp.train_period_id = tb.train_period_id where users.is_delete = false order by users.user_stu_num`;

	let COUNT = `Select count(*) as total FROM users left join train_book as tb on tb.train_book_id = users.train_book_id left join train_period as tp on tp.train_period_id = tb.train_period_id where users.is_delete = false`;

	if (page !== 'all') {
		start = page * num;
		limit = ` limit ${start}, ${num}`;
		SELECT = SELECT + limit;
	}

	[{ total }] = await prisma.$queryRawUnsafe(`${COUNT}`);
	console.log(`############ ${total} #############`);

	if (!total) {
		throw errorCode.NotFound;
	}

	try {
		user = await prisma.$queryRawUnsafe(`${SELECT}`);
	} catch (e) {
		console.log(`############ ${e} ############`);
	}

	return { user, total };
};

const getUserByCredentials = async function (user_id, user_password) {
	let user;
	try {
		user = await prisma.users.findFirst({
			where: {
				user_id,
				user_password,
			},
			select: {
				user_id: true,
				user_name: true,
				user_email: true,
				create_time: true,
				update_time: true,
			},
		});
	} catch (e) {
		return null;
	}

	return user;
};

const getStudentNum = async function (trainPeriodId, sourceId) {
	let stuNum;
	let user_stu_name;
	let train_period_name;
	let number;
	let numToStr;
	let xuezhao = '0641878c-5967-11ec-a655-528abe1c4f3a';

	const SQL = `SELECT max(user_stu_num) as user_stu_name, (select train_period_name from train_period where train_period_id ='${trainPeriodId}') as train_period_name FROM users 
  right join train_book as tb on tb.train_book_id = users.train_book_id
  where tb.train_period_id = '${trainPeriodId}' and source_id = '${sourceId}';`;

	// console.log(`sql: ${SQL}`)

	try {
		[{ user_stu_name, train_period_name }] = await prisma.$queryRawUnsafe(SQL);
	} catch (e) {
		console.log(`stuNum Err: ${e}`);
	}

	// 重組學號，期別+數字
	// 先取得當期最大數字+1返回
	if (user_stu_name == null) {
		stuNum = `${train_period_name}001`;
	} else {
		number = user_stu_name.substr(-2); // 01
		number = parseInt(number) + 1;
		numToStr = `0${number}`;
		if (number < 10) {
			numToStr = `00${number}`;
		}
		stuNum = `${train_period_name}${numToStr}`;
	}

	if (sourceId === xuezhao) {
		stuNum = `${stuNum}S`;
	}

	return stuNum;
};

const getUserCount = async function (filter) {
	let count;
	let prismaArgs = {};

	prismaArgs['_count'] = { user_id: true };
	if (filter) {
		prismaArgs['where'] = filter;
	}

	count = await prisma.users.aggregate(prismaArgs);

	if (count) {
		return count._count.user_id;
	}

	return 0;
};

const createUser = async function (data) {
	let user, trainBookData, count;
	let id = data.train_period_id;
	let userId = data.user_id;
	let limit = await getTrainPeriodLimit(id);
	let isAccount = await checkUser(userId);

	if (isAccount) {
		throw errorCode.PrimaryKeyError;
	}

	if (data.privacy) {
		trainBookData = await getTrainBookIdForBook(id);
		data.train_book_id = trainBookData.train_book_id;
		count = trainBookData.count;
		delete data.privacy;
		delete data.train_period_id;
	}

	if (count > limit) {
		throw errorCode.QuotaExceeded;
	}

	try {
		user = await prisma.users.create({
			data,
		});
	} catch (e) {
		console.log(`create user err: ${e}`);
		throw errorCode.InternalServerError;
	}

	return user;
};

const checkUser = async function (user_id) {
	let user = await prisma.users.findUnique({
		where: {
			user_id,
		},
	});

	return user;
};

const getUserById = async function (user_id) {
	let user = await prisma.users.findUnique({
		where: {
			user_id,
		},
	});

	if (!user) {
		throw errorCode.NotFound;
	}

	return user;
};

const updateUser = async function (user_uuid, data) {
	let user;
	try {
		user = await prisma.users.update({
			where: {
				user_uuid,
			},
			data,
		});
	} catch (e) {
		console.log(e);
		if (e.code === 'P2025') {
			throw errorCode.NotFound;
		}
		throw errorCode.InternalServerError;
	}

	return user;
};

const deleteUser = async function (user_uuid) {
	let user;
	try {
		user = await prisma.users.update({
			where: {
				user_uuid,
			},
			data: {
				is_delete: true,
			},
		});
	} catch (e) {
		console.log(e);
		if (e.code === 'P2025') {
			throw errorCode.NotFound;
		}
		throw errorCode.InternalServerError;
	}

	return user;
};

const getContractData = async function (userId) {
	let constractData;
	let SQL = `select user_name, user_stu_num, user_id, substr(user_born,1,10) as user_born, user_tel, user_email, user_gender, user_addr, class_type_name, 
	car_type_name, train_period_name, train_period_start, train_period_end  from users
	inner join class_type as ct on ct.class_type_id = users.class_type_id
	inner join car_type as cr on cr.car_type_id = users.car_type_id
	inner join train_book as tb on tb.train_book_id = users.train_book_id
	inner join train_period as tp on tp.train_period_id = tb.train_period_id
	where user_id = '${userId}'`;

	constractData = await prisma.$queryRawUnsafe(SQL);

	return constractData;
};

// 取得考試清單
const getExamList = async function (tpId, stuList) {
	let data = {};

	// 考試分組設定
	await setGroupNum(1, tpId, teacherOne);
	await setGroupNum(2, tpId, teacherTwo);
	await setGroupNum(3, tpId);

	let SQL = `SELECT user_name, user_id, train_period_exam, train_period_name, exam_group,
	case exam_group when 1 then '6662' when 2 then '6697' else '8358' end as car_num
	FROM users
	inner join train_book as tb on tb.train_book_id = users.train_book_id
	inner join train_period as tp on tp.train_period_id = tb.train_period_id
	where tp.train_period_id = '${tpId}' or user_id in ('${stuList}')
	order by exam_group desc`;
	try {
		data.exam = await prisma.$queryRawUnsafe(SQL);
	} catch (e) {
		console.log(e);
	}

	return data;
};

export {
	getUser,
	getUserByCredentials,
	getStudentNum,
	createUser,
	getUserById,
	updateUser,
	deleteUser,
	getContractData,
	getExamList,
};
