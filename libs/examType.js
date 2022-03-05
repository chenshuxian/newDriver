import prisma from './prisma';
import errorCode from './errorCode';

const getExamType = async function(filter, pagination) {
  let examType;
  let total;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = filter;
  }

  if (pagination) {
    prismaArgs['skip'] = parseInt(pagination.offset) || 0;
    prismaArgs['take'] = parseInt(pagination.limit) || 50;
  }

  total = await getExamTypeCount(filter);
  if (!total) {
    throw errorCode.NotFound;
  }

  examType = await prisma.exam_type.findMany(prismaArgs);

  return { examType, total };
}

const getExamTypeById = async function(id) {
  let examType = await prisma.exam_type.findUnique({
    where: {
      exam_type_id: id
    }
  });

  if (!examType) {
    throw errorCode.NotFound;
  }

  return examType;
}

const getExamTypeCount = async function(filter) {
  let count;
  let prismaArgs = {};

  prismaArgs['_count'] = { exam_type_id: true };
  if (filter) {
    prismaArgs['where'] = filter;
  }

  count = await prisma.exam_type.aggregate(prismaArgs);

  if (count) {
    return count._count.exam_type_id;
  }

  return 0;
}

const createExamType = async function(data) {
  let examType;

  try {
    examType = await prisma.exam_type.create({
      data
    });
  } catch (e) {
    throw errorCode.InternalServerError;
  }

  return examType;
}

const updateExamType = async function(examTypeId, data) {
  let examType;

  try {
    examType = await prisma.exam_type.update({
      where: {
        exam_type_id: examTypeId
      },
      data
    })
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return examType;
}

const deleteExamType = async function(examTypeId, isDelete = false) {
  let examType;

  try {
    if (isDelete) {
      examType = await prisma.exam_type.delete({
        where: {
          exam_type_id: examTypeId
        }
      })
    } else {
      examType = await prisma.exam_type.update({
        where: {
          exam_type_id: examTypeId
        },
        data: {
          is_delete: true
        }
      })
    }
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return examType;
}

export { getExamType, createExamType, updateExamType, deleteExamType, getExamTypeById };