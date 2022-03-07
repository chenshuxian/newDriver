import prisma from './prisma';
import errorCode from './errorCode';
import { selectList, getToday } from '../libs/common';
import { getTeacher } from './teacher';
import { getTime } from './time';
import { createManyTrainBook } from './trainBook';
import { YEAR } from './front/constText';

const getTeacherAndTime = async function () {
	let teacherData = await getTeacher();
	let timeData = await getTime();
	let teacher = teacherData.teacher;
	let time = timeData.time;

	return { teacher, time };
};

const getTrainPeriod = async function (filter, pagination) {
	let trainPeriod;
	let total;
	let prismaArgs = {};
	let thisYear = new Date().getFullYear() - YEAR;

	filter = { train_period_start: { startsWith: thisYear.toString() } };

	if (filter) {
		prismaArgs['where'] = filter;
	}

	if (pagination) {
		prismaArgs['skip'] = parseInt(pagination.offset) || 0;
		prismaArgs['take'] = parseInt(pagination.limit) || 50;
	}

	total = await getTrainPeriodCount(filter);
	if (!total) {
		throw errorCode.NotFound;
	}

	trainPeriod = await prisma.train_period.findMany(prismaArgs);

	return { trainPeriod, total };
};

// 取得本月期別
const getNearPeriod = async function () {
	let train_period_id;
	let today = await getToday(true);
	today = today.replaceAll('-', '/');
	today = today.substr(0, 6);

	let SQL = `SELECT train_period_id FROM train_period where train_period_start like '${today}%' limit 1`;
	[{ train_period_id }] = await prisma.$queryRawUnsafe(SQL);
	console.log(`nearPeriod ${train_period_id}`);
	if (train_period_id == null) {
		SQL = `SELECT train_period_id FROM train_period limit 1`;
		[{ train_period_id }] = await prisma.$queryRawUnsafe(SQL);
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
	let { teacher, time } = await getTeacherAndTime();
	try {
		trainPeriod = await prisma.train_period.createMany({
			data,
		});

		if (trainPeriod) {
			let trainPeriodData = await getTrainPeriod();
			let TPD = trainPeriodData.trainPeriod;
			createManyTrainBook(TPD, teacher, time);
		}
	} catch (e) {
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

export {
	getTrainPeriod,
	getNearPeriod,
	createTrainPeriod,
	createManyTrainPeriod,
	updateTrainPeriod,
	deleteTrainPeriod,
	getTrainPeriodById,
};
