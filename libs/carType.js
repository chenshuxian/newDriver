import prisma from './prisma';
import errorCode from './errorCode';
import { v4 as uuidv4 } from 'uuid';

const getCarType = async function (filter, pagination) {
	let carType;
	let total;
	let prismaArgs = {};

	if (filter) {
		prismaArgs['where'] = filter;
	}

	if (pagination) {
		prismaArgs['skip'] = parseInt(pagination.offset) || 0;
		prismaArgs['take'] = parseInt(pagination.limit) || 50;
	}

	total = await getCarTypeCount(filter);
	if (!total) {
		throw errorCode.NotFound;
	}

	carType = await prisma.car_type.findMany(prismaArgs);

	return { carType, total };
};

const getCarTypeById = async function (car_type_id) {
	let carType = await prisma.car_type.findUnique({
		where: {
			car_type_id,
		},
	});

	if (!carType) {
		throw errorCode.NotFound;
	}

	return carType;
};

const getCarTypeCount = async function (filter) {
	let count;
	let prismaArgs = {};

	prismaArgs['_count'] = { car_type_id: true };
	if (filter) {
		prismaArgs['where'] = filter;
	}

	count = await prisma.car_type.aggregate(prismaArgs);

	if (count) {
		return count._count.car_type_id;
	}

	return 0;
};

const createCarType = async function (data) {
	let carType;
	data.car_type_id = uuidv4();

	try {
		carType = await prisma.car_type.create({
			data,
		});
	} catch (e) {
		throw errorCode.InternalServerError;
	}

	return carType;
};

const updateCarType = async function (car_type_id, data) {
	let carType;

	try {
		carType = await prisma.car_type.update({
			where: {
				car_type_id,
			},
			data,
		});
	} catch (e) {
		if (e.code === 'P2025') {
			throw errorCode.NotFound;
		}
		throw errorCode.InternalServerError;
	}

	return carType;
};

const deleteCarType = async function (
	car_type_id,
	is_delete,
	delete_forever = false
) {
	let carType;
	if (delete_forever) {
		carType = await prisma.car_type.delete({
			where: {
				car_type_id,
			},
		});
	} else {
		try {
			carType = await prisma.car_type.update({
				where: {
					car_type_id,
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

	return carType;
};

export {
	getCarType,
	createCarType,
	updateCarType,
	deleteCarType,
	getCarTypeById,
};
