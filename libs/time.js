import prisma from './prisma';
import errorCode from './errorCode';
import { createManyTrainBook } from './trainBook';
import { getTrainPeriod } from './trainPeriod';
import { getTeacher } from './teacher';

const getTime = async function (filter, pagination) {
	let time;
	let total;
	let prismaArgs = {};

	if (filter) {
		prismaArgs['where'] = filter;
	}

	if (pagination) {
		prismaArgs['skip'] = parseInt(pagination.offset) || 0;
		prismaArgs['take'] = parseInt(pagination.limit) || 50;
	}

	total = await getTimeCount(filter);
	if (!total) {
		throw errorCode.NotFound;
	}

	time = await prisma.time.findMany(prismaArgs);

	return { time, total };
};

const getTimeById = async function (time_id) {
	let time = await prisma.time.findUnique({
		where: {
			time_id,
		},
	});

	if (!time) {
		throw errorCode.NotFound;
	}

	return time;
};

const getTimeCount = async function (filter) {
	let count;
	let prismaArgs = {};

	prismaArgs['_count'] = { time_id: true };
	if (filter) {
		prismaArgs['where'] = filter;
	}

	count = await prisma.time.aggregate(prismaArgs);

	if (count) {
		return count._count.time_id;
	}

	return 0;
};

const createTime = async function (data) {
	let time;
	let teacherData = await getTeacher();
	let trainPeriodData = await getTrainPeriod();

	data.time_id = await getTimeId();

	try {
		time = await prisma.time.create({
			data,
		});

		if (time) {
			let teacher = teacherData.teacher;
			let trainPeriod = trainPeriodData.trainPeriod;
			createManyTrainBook(trainPeriod, teacher, [data]);
		}
	} catch (e) {
		throw errorCode.InternalServerError;
	}

	return time;
};

const getTimeId = async function () {
	let id;
	try {
		[{ id }] = await prisma.$queryRawUnsafe(
			`SELECT max(time_id)+1 as id FROM time;`
		);
	} catch (e) {
		throw errorCode.InternalServerError;
	}

	return id;
};

const updateTime = async function (time_id, data) {
	let time;

	try {
		time = await prisma.time.update({
			where: {
				time_id,
			},
			data,
		});
	} catch (e) {
		if (e.code === 'P2025') {
			throw errorCode.NotFound;
		}
		throw errorCode.InternalServerError;
	}

	return time;
};

const deleteTime = async function (time_id, is_delete, delete_forever = false) {
	let time;
	if (delete_forever) {
		time = await prisma.time.delete({
			where: {
				time_id,
			},
		});
	} else {
		try {
			time = await prisma.time.update({
				where: {
					time_id,
				},
				data: {
					is_delete,
				},
			});
		} catch (e) {
			console.log(e);
			if (e.code === 'P2025') {
				throw errorCode.NotFound;
			}
			throw errorCode.InternalServerError;
		}
	}

	return time;
};

export { getTime, createTime, updateTime, deleteTime, getTimeById };
