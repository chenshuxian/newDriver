import prisma from './prisma';
import errorCode from './errorCode';

const getCars = async function (filter, page) {
	let cars;
	try {
		cars = await prisma.mCar.findMany({
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

const getmCarCount = async function (filter) {
	let count;
	let prismaArgs = {};

	prismaArgs['_count'] = { car_id: true };
	if (filter) {
		prismaArgs['where'] = filter;
	}

	count = await prisma.mCar.aggregate(prismaArgs);

	if (count) {
		return count._count.car_id;
	}

	return 0;
};

const createmCar = async function (data) {
	let car;
	try {
		car = await prisma.mCar.create({
			data,
		});
	} catch (e) {
		console.log(`create car err: ${e}`);
		throw errorCode.InternalServerError;
	}

	return car;
};

const getmCarById = async function (car_id) {
	let car = await prisma.mCar.findUnique({
		where: {
			car_id,
		},
	});

	if (!car) {
		throw errorCode.NotFound;
	}

	return car;
};

const updatemCar = async function (id, data) {
	let car;
	try {
		car = await prisma.mCar.update({
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

const deletemCar = async function (id) {
	let car;
	try {
		car = await prisma.mCar.update({
			where: {
				id,
			},
			data: {
				is_delete: 1,
			},
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

export { getCars, createmCar, getmCarById, updatemCar, deletemCar };
