import prisma from './prisma';
import errorCode from './errorCode';
import { getToday } from '../libs/common';
import { getTeacher } from './teacher';
import { getTime } from './time';
import { createManyTrainBook } from './trainBook';
import { YEAR } from './front/constText';

const getTeacherAndTime = async function () {
	console.log(`t0`);
	let teacherData = await getTeacher();
	console.log(`t1`);
	let timeData = await getTime();
	let teacher = teacherData.teacher;
	let time = timeData.time;

	return { teacher, time };
};

const getTrainPeriod = async function (filter, pagination) {
	let trainPeriod;
	let total;
	let prismaArgs = {};
	let month = new Date().getMonth();
	let thisYear = new Date().getFullYear() - YEAR;
	let filter = { train_period_start: { startsWith: thisYear.toString() } };
	if (month == 0) {
		// 1月時取得今年期別和前年12月的期別
		filter = {
			OR: [
				({ train_period_start: { startsWith: thisYear.toString() } },
				{ train_period_start: { startsWith: thisYear.toString + '/12' } }),
			],
		};
	}

	// let thisYear = 113;

	if (filter) {
		prismaArgs['where'] = filter;
	}

	if (pagination) {
		prismaArgs['skip'] = parseInt(pagination.offset) || 0;
		prismaArgs['take'] = parseInt(pagination.limit) || 50;
	}

	total = await getTrainPeriodCount(filter);
	// if (!total) {
	// 	console.log('debug 2023');
	// 	throw errorCode.NotFound;
	// }

	trainPeriod = await prisma.train_period.findMany(prismaArgs);

	return { trainPeriod, total };
};

const getAllowPeriod = async function (carType, classType, month) {
	let trian_period;
	let today = await getToday(true);
	today = today.split('-').join('/');

	let SQL = `SELECT * ,max_book_num - (SELECT count(*) FROM train_book where train_period_id = train_period.train_period_id and
	train_book_id in (select train_book_id from users where train_book_id is not null)) as count FROM train_period where train_period_start > '${today}'`;
	trian_period = await prisma.$queryRawUnsafe(SQL);

	return trian_period;
};

// 取得本月期別
const getNearPeriod = async function () {
	let train_period_id, result;
	let today = await getToday(true);
	today = today.split('-').join('/');
	today = today.substr(0, 6);

	let SQL = `SELECT train_period_id FROM train_period where train_period_start like '${today}%' limit 1`;
	console.log(SQL);
	result = await prisma.$queryRawUnsafe(SQL);

	if (result == '') {
		SQL = `SELECT train_period_id FROM train_period limit 1`;
		[{ train_period_id }] = await prisma.$queryRawUnsafe(SQL);
	} else {
		train_period_id = result[0].train_period_id;
	}

	return train_period_id;
};

const getTrainPeriodById = async function (train_period_id) {
	let trainPeriod = await prisma.train_period.findUnique({
		where: {
			train_period_id,
		},
	});

	if (!trainPeriod) {
		throw errorCode.NotFound;
	}

	return trainPeriod;
};

const getTrainPeriodCount = async function (filter) {
	let count;
	let prismaArgs = {};

	prismaArgs['_count'] = { train_period_id: true };
	if (filter) {
		prismaArgs['where'] = filter;
	}

	count = await prisma.train_period.aggregate(prismaArgs);

	if (count) {
		return count._count.train_period_id;
	}

	return 0;
};

const createTrainPeriod = async function (data) {
	let trainPeriod;
	let { teacher, time } = await getTeacherAndTime();
	try {
		trainPeriod = await prisma.train_period.create({
			data,
		});
		if (trainPeriod) {
			createManyTrainBook([data], teacher, time);
		}
	} catch (e) {
		throw errorCode.InternalServerError;
	}

	return trainPeriod;
};

const createManyTrainPeriod = async function (data) {
	let trainPeriod;
	console.log(`cmt: data0`);
	let { teacher, time } = await getTeacherAndTime();
	try {
		console.log(`cmt: data1`);
		trainPeriod = await prisma.train_period.createMany({
			data,
		});

		console.log(`cmt: data2`);
		if (trainPeriod) {
			let trainPeriodData = await getTrainPeriod();
			let TPD = trainPeriodData.trainPeriod;
			createManyTrainBook(TPD, teacher, time);
		}
	} catch (e) {
		console.log(e);
		if (e.code == 'P2002') {
			throw errorCode.PrimaryKeyError;
		}
		throw errorCode.InternalServerError;
	}

	return trainPeriod;
};

const updateTrainPeriod = async function (train_period_id, data) {
	let trainPeriod;

	try {
		trainPeriod = await prisma.train_period.update({
			where: {
				train_period_id,
			},
			data,
		});
	} catch (e) {
		if (e.code === 'P2025') {
			throw errorCode.NotFound;
		}
		throw errorCode.InternalServerError;
	}

	return trainPeriod;
};

const deleteTrainPeriod = async function (train_period_id) {
	let trainPeriod;

	try {
		if (Array.isArray(train_period_id)) {
			trainPeriod = await prisma.train_period.deleteMany({
				where: {
					train_period_id: { in: train_period_id },
				},
			});
		} else {
			trainPeriod = await prisma.train_period.delete({
				where: {
					train_period_id,
				},
			});
		}
	} catch (e) {
		console.log(e);
		if (e.code === 'P2025') {
			throw errorCode.NotFound;
		}
		throw errorCode.InternalServerError;
	}

	return trainPeriod;
};

const getTrainPeriodLimit = async function (train_period_id) {
	let max_book_num;
	try {
		[{ max_book_num }] = await prisma.train_period.findMany({
			where: {
				train_period_id,
			},
			select: {
				max_book_num: true,
			},
		});
	} catch (e) {
		console.log({ e });
	}

	return max_book_num;
};

export {
	getTrainPeriod,
	getNearPeriod,
	createTrainPeriod,
	createManyTrainPeriod,
	updateTrainPeriod,
	deleteTrainPeriod,
	getTrainPeriodById,
	getAllowPeriod,
	getTrainPeriodLimit,
};
