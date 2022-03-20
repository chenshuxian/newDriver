import prisma from './prisma';
import errorCode from './errorCode';
import { collapseClasses } from '@mui/material';

const getExam = async function (filter, pagination) {
	let exam;
	let total;
	let prismaArgs = {};

	if (filter) {
		prismaArgs['where'] = filter;
	}

	if (pagination) {
		prismaArgs['skip'] = parseInt(pagination.offset) || 0;
		prismaArgs['take'] = parseInt(pagination.limit) || 50;
	}

	prismaArgs['orderBy'] = { exam_number: 'asc' };

	total = await getExamCount(filter);
	if (!total) {
		throw errorCode.NotFound;
	}

	exam = await prisma.exam.findMany(prismaArgs);

	return { exam, total };
};

const getExamById = async function (id) {
	let exam = await prisma.exam.findUnique({
		where: {
			exam_id: id,
		},
	});

	if (!exam) {
		throw errorCode.NotFound;
	}

	return exam;
};

const getExamCount = async function (filter) {
	let count;
	let prismaArgs = {};

	prismaArgs['_count'] = { exam_id: true };
	if (filter) {
		prismaArgs['where'] = filter;
	}

	count = await prisma.exam.aggregate(prismaArgs);

	if (count) {
		return count._count.exam_id;
	}

	return 0;
};

const getExamUnDeletedCount = async function (filter) {
	let count;
	let prismaArgs = {};

	if (filter) {
		prismaArgs['where'] = Object.assign({ is_delete: false }, filter);
	}

	count = await getExamCount(filter);

	return count;
};

const createExam = async function (data) {
	let exam;

	try {
		exam = await prisma.exam.create({
			data,
		});
	} catch (e) {
		console.log(e);
		throw errorCode.InternalServerError;
	}

	return exam;
};

const updateExam = async function (examId, data) {
	let exam;

	try {
		exam = await prisma.exam.update({
			where: {
				exam_id: examId,
			},
			data,
		});
	} catch (e) {
		if (e.code === 'P2025') {
			throw errorCode.NotFound;
		}
		throw errorCode.InternalServerError;
	}

	return exam;
};

const deleteExam = async function (examId, isDelete = false) {
	let exam;

	try {
		if (isDelete) {
			if (Array.isArray(examId)) {
				exam = await prisma.exam.deleteMany({
					where: {
						exam_id: { in: examId },
					},
				});
			} else {
				exam = await prisma.exam.delete({
					where: {
						exam_id: examId,
					},
				});
			}
		} else {
			if (Array.isArray(examId)) {
				exam = await prisma.exam.updateMany({
					where: {
						exam_id: { in: examId },
					},
					data: {
						is_delete: true,
					},
				});
			} else {
				exam = await prisma.exam.update({
					where: {
						exam_id: examId,
					},
					data: {
						is_delete: true,
					},
				});
			}
		}
	} catch (e) {
		console.log(`exam delete err: ${e}`);
		if (e.code === 'P2025') {
			throw errorCode.NotFound;
		}
		throw errorCode.InternalServerError;
	}

	return exam;
};

const getExamRandom = async function (id) {
	let exam, exam_number, examSql, del;

	let examIdSql = `select exam_number from exam 
	where exam_number not in 
	(SELECT exam_id FROM score where user_id = '${id}') 
	group by exam_number order by rand() limit 1`;

	exam_number = await prisma.$queryRawUnsafe(`${examIdSql}`);
	if (exam_number.length > 0) {
		examSql = `select * from exam where exam_number = ${exam_number[0]['exam_number']} `;
		exam = await prisma.$queryRawUnsafe(`${examSql}`);
	} else {
		let delSql = `Delete from score where user_id = '${id}'`;
		del = await prisma.$queryRawUnsafe(`${delSql}`);
		examSql = `select * from exam where exam_number = '1' `;
		exam = await prisma.$queryRawUnsafe(`${examSql}`);
	}

	return exam;
};

const checkAnswer = async function (answerData) {
	let exam;
	let prismaArgs = {};

	if (!answerData || typeof answerData !== 'object') {
		return 0;
	}

	prismaArgs['where'] = {
		OR: Object.entries(answerData).map(([exam_id, exam_ans]) => {
			return {
				AND: [{ exam_id, exam_ans: { not: exam_ans } }],
			};
		}),
	};

	// console.log(`where: ${JSON.stringify(prismaArgs)}`);
	try {
		exam = await prisma.exam.findMany(prismaArgs);
	} catch (e) {
		console.log(`ans err: ${e}`);
	}

	return exam || {};
};

const getExamTypeId = async function (id) {
	let exam = await getExamById(id);

	return exam?.exam_type_id || '';
};

const importExam = async function (records, { examTypeId }) {
	let data;
	let count;
	const fieldMapping = {
		exam_title: 1,
		exam_option: [3, 4, 5, 6],
		exam_ans: 2,
		exam_img_url: 7,
		exam_video_url: 8,
	};
	const headerMapping = {
		題目: 'exam_title',
		答案: 'exam_ans',
		照片: 'exam_img_url',
		影片: 'exam_video_url',
		選項1: ['exam_option', 0],
		選項2: ['exam_option', 1],
		選項3: ['exam_option', 2],
		選項4: ['exam_option', 3],
	};

	if (!Array.isArray(records)) {
		throw errorCode.BadRequest;
	}

	let header = records[0];
	let index = header.indexOf('題目');
	if ((index = header.indexOf('題目')) !== -1) {
		records.shift();

		Object.entries(headerMapping).forEach(([headerValue, fieldKey]) => {
			if ((index = header.indexOf(headerValue))) {
				if (Array.isArray(fieldKey)) {
					fieldMapping[fieldKey[0]][fieldKey[1]] = index;
				} else {
					fieldMapping[fieldKey] = index;
				}
			}
		});
	}

	data = records.map((exam) => {
		let record = { exam_type_id: examTypeId };

		Object.entries(fieldMapping).forEach(([key, index]) => {
			if (index === -1) {
				return;
			}

			if (Array.isArray(index)) {
				record[key] = [];
				index.forEach((examIndex, optionIndex) => {
					record[key][optionIndex] = exam[examIndex];
				});
			} else {
				record[key] = exam[index];
			}
		});

		record.exam_ans = parseInt(record.exam_ans);

		return record;
	});

	try {
		({ count } = await prisma.exam.createMany({
			data,
		}));
	} catch (e) {
		throw errorCode.InternalServerError;
	}

	return { data, count };
};

export {
	getExam,
	createExam,
	updateExam,
	deleteExam,
	getExamRandom,
	checkAnswer,
	getExamTypeId,
	getExamById,
	importExam,
};
