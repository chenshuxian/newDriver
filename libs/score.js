import prisma from './prisma';
import errorCode from './errorCode';

const getScore = async function (filter, pagination) {
	let score;
	let total;
	let prismaArgs = {};

	if (filter) {
		prismaArgs['where'] = filter;
	}

	if (pagination) {
		prismaArgs['skip'] = parseInt(pagination.offset) || 0;
		prismaArgs['take'] = parseInt(pagination.limit) || 50;
	}

	total = await getScoreCount(filter);
	if (!total) {
		throw errorCode.NotFound;
	}

	score = await prisma.score.findMany(prismaArgs);

	return { score, total };
};

const getScoreById = async function (score_id) {
	let score = await prisma.score.findUnique({
		where: {
			id: score_id,
		},
	});

	if (!score) {
		throw errorCode.NotFound;
	}

	return score;
};

const getScoreCount = async function (filter) {
	let count;
	let prismaArgs = {};

	prismaArgs['_count'] = { id: true };
	if (filter) {
		prismaArgs['where'] = filter;
	}

	count = await prisma.score.aggregate(prismaArgs);

	if (count) {
		return count._count.id;
	}

	return 0;
};

const createScore = async function (data) {
	let score;

	try {
		score = await prisma.score.create({
			data,
		});
	} catch (e) {
		console.log(`in score err: ${e}`);
		throw errorCode.InternalServerError;
	}

	return score;
};

const updateScore = async function (score_id, data) {
	let score;

	try {
		score = await prisma.score.update({
			where: {
				id: score_id,
			},
			data,
		});
	} catch (e) {
		if (e.code === 'P2025') {
			throw errorCode.NotFound;
		}
		throw errorCode.InternalServerError;
	}

	return score;
};

const deleteScore = async function (score_id) {
	let score;
	try {
		score = await prisma.score.update({
			where: {
				id: score_id,
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

	return score;
};

export { getScore, createScore, updateScore, deleteScore, getScoreById };
