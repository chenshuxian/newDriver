import prisma from './prisma';
import errorCode from './errorCode';
import { v4 as uuidv4 } from 'uuid';

const getClassType = async function (filter, pagination) {
	let classType;
	let total;
	let prismaArgs = {};

	if (filter) {
		prismaArgs['where'] = filter;
	}

	if (pagination) {
		prismaArgs['skip'] = parseInt(pagination.offset) || 0;
		prismaArgs['take'] = parseInt(pagination.limit) || 50;
	}

	total = await getClassTypeCount(filter);
	if (!total) {
		throw errorCode.NotFound;
	}

	classType = await prisma.class_type.findMany(prismaArgs);

	return { classType, total };
};

const getClassTypeById = async function (class_type_id) {
	let classType = await prisma.class_type.findUnique({
		where: {
			class_type_id,
		},
	});

	if (!classType) {
		throw errorCode.NotFound;
	}

	return classType;
};

const getClassTypeCount = async function (filter) {
	let count;
	let prismaArgs = {};

	prismaArgs['_count'] = { class_type_id: true };
	if (filter) {
		prismaArgs['where'] = filter;
	}

	count = await prisma.class_type.aggregate(prismaArgs);

	if (count) {
		return count._count.class_type_id;
	}

	return 0;
};

const createClassType = async function (data) {
	let classType;
	data.class_type_id = uuidv4();

	try {
		classType = await prisma.class_type.create({
			data,
		});
	} catch (e) {
		throw errorCode.InternalServerError;
	}

	return classType;
};

const updateClassType = async function (class_type_id, data) {
	let classType;

	try {
		classType = await prisma.class_type.update({
			where: {
				class_type_id,
			},
			data,
		});
	} catch (e) {
		if (e.code === 'P2025') {
			throw errorCode.NotFound;
		}
		throw errorCode.InternalServerError;
	}

	return classType;
};

const deleteClassType = async function (
	class_type_id,
	is_delete,
	delete_forever = false
) {
	let classType;
	if (delete_forever) {
		classType = await prisma.class_type.delete({
			where: {
				class_type_id,
			},
		});
	} else {
		try {
			classType = await prisma.class_type.update({
				where: {
					class_type_id,
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

	return classType;
};

export {
	getClassType,
	createClassType,
	updateClassType,
	deleteClassType,
	getClassTypeById,
};
