import prisma from './prisma';
import errorCode from './errorCode';

const getCarDetail = async function (filter, page) {
	let cars;
	try {
		cars = await prisma.mCarDetail.findMany({
			where: {
				is_delete: 0,
			},
			include: {
				mCarDetail: true,
			},
		});
	} catch (e) {
		console.log(e);
		return null;
	}

	return cars;
};

const getmCarDetailCount = async function (filter) {
	let count;
	let prismaArgs = {};

	prismaArgs['_count'] = { car_id: true };
	if (filter) {
		prismaArgs['where'] = filter;
	}

	count = await prisma.mCarDetail.aggregate(prismaArgs);

	if (count) {
		return count._count.car_id;
	}

	return 0;
};

const createmCarDetail = async function (data) {
	let car;
	try {
		car = await prisma.mCarDetail.create({
			data,
		});
	} catch (e) {
		console.log(`create car err: ${e}`);
		throw errorCode.InternalServerError;
	}

	return car;
};

const getmCarDetailById = async function (id) {
	let car = await prisma.mCarDetail.findUnique({
		where: {
			id,
		},
	});

	if (!car) {
		throw errorCode.NotFound;
	}

	return car;
};

const updatemCarDetail = async function (id, data) {
	let car;
	try {
		car = await prisma.mCarDetail.update({
			where: {
				id,
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

	return car;
};

const deletemCarDetail = async function (id) {
	let car;
	try {
		car = await prisma.mCarDetail.delete({
			where: {
				id,
			}
		});
	} catch (e) {
		console.log(e);
		if (e.code === 'P2025') {
			throw errorCode.NotFound;
		}
		throw errorCode.InternalServerError;
	}

	return car;
};

export {  getCarDetail, createmCarDetail, getmCarDetailById, updatemCarDetail, deletemCarDetail };
