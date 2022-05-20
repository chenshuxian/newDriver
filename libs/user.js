import prisma from './prisma';
import errorCode from './errorCode';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { getTrainBookIdForBook } from '../libs/trainBook';
import { getTrainPeriodLimit } from './trainPeriod';

dayjs.extend(isToday);

const getUser = async function (filter, pagination) {
	let user;
	let total;
	let prismaArgs = {};

	let SELECT = `Select users.*, tp.*, tb.teacher_id, tb.time_id, (select score from score where score.user_id = users.user_id order by update_time desc limit 1) as score, (select update_time from score where score.user_id = users.user_id order by update_time desc limit 1) as last_play_time FROM users left join train_book as tb on tb.train_book_id = users.train_book_id left join train_period as tp on tp.train_period_id = tb.train_period_id where users.is_delete = false order by users.user_stu_num`;

	let COUNT = `Select count(*) as total FROM users left join train_book as tb on tb.train_book_id = users.train_book_id left join train_period as tp on tp.train_period_id = tb.train_period_id where users.is_delete = false`;

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

export {
	getUser,
	getUserByCredentials,
	getStudentNum,
	createUser,
	getUserById,
	updateUser,
	deleteUser,
};
