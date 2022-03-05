import prisma from './prisma';
import errorCode from './errorCode';
import { getTime } from './time';
import { getTrainPeriod } from './trainPeriod';
import { createManyTrainBook } from './trainBook';

const getTeacher = async function(filter, pagination) {
  let teacher;
  let total;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = filter;
  }

  if (pagination) {
    prismaArgs['skip'] = parseInt(pagination.offset) || 0;
    prismaArgs['take'] = parseInt(pagination.limit) || 50;
  }

  total = await getTeacherCount(filter);
  if (!total) {
    throw errorCode.NotFound;
  }

  teacher = await prisma.teacher.findMany(prismaArgs);


  return { teacher, total };
}

const getTeacherById = async function(id) {
  let teacher = await prisma.teacher.findUnique({
    where: {
      teacher_id: id
    }
  });

  if (!teacher) {
    throw errorCode.NotFound;
  }

  return teacher;
}

const getTeacherCount = async function(filter) {
  let count;
  let prismaArgs = {};

  prismaArgs['_count'] = { teacher_id: true };
  if (filter) {
    prismaArgs['where'] = filter;
  }

  count = await prisma.teacher.aggregate(prismaArgs);

  if (count) {
    return count._count.teacher_id;
  }

  return 0;
}

const createTeacher = async function(data) {
  let teacher;
  let total;
  let timeData = await getTime();
  let trainPeriodData = await getTrainPeriod();

  try {
    teacher = await prisma.teacher.create({
      data
    });
    if(teacher){
      let time = timeData.time;
      let trainPeriod = trainPeriodData.trainPeriod;
      total = await createManyTrainBook(trainPeriod, [data], time);
    }
  } catch (e) {
    throw errorCode.InternalServerError;
  }

  return { teacher, total };
}

const updateTeacher = async function(teacherId, data) {
  let teacher;

  try {
    teacher = await prisma.teacher.update({
      where: {
        teacher_id: teacherId
      },
      data
    })
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return teacher;
}

const deleteTeacher = async function(teacherId) {
  let teacher;
  console.log('debug: ' + teacherId)
  try {
    teacher = await prisma.teacher.update({
      where: {
        teacher_id: teacherId
      },
      data: {
        is_delete: true
      }
    });
  } catch (e) {
    console.log(e)
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return teacher;
}

export { getTeacher, createTeacher, updateTeacher, deleteTeacher, getTeacherById };