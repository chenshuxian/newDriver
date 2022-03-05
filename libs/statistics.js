import prisma from './prisma';
import errorCode from './errorCode';
import dayjs from 'dayjs';

BigInt.prototype.toJSON = function () {
  return Number(this);
};

const genPrismaArgs = function(startDate, endDate) {
  const prismaArgs = {
    where: {
      id: {}
    }
  };

  if (startDate) {
    prismaArgs['where']['id']['gte'] =  dayjs(startDate).format('YYYYMMDD');
  }
  if (endDate) {
    prismaArgs['where']['id']['lte'] =  dayjs(endDate).format('YYYYMMDD');
  }

  return prismaArgs;
}
const dailyCounter = async function() {
  const today = dayjs().format('YYYYMMDD');
  const count = await prisma.pv.upsert({
    where: {
      id: today
    },
    update: {
      number: {
        increment: 1
      }
    },
    create: {
      id: today,
      number: 1,
    }
  });

  return count;
}

const getDailyCount = async function(startDate, endDate) {
  const prismaArgs = genPrismaArgs(startDate, endDate);
  const count = await prisma.pv.findMany(prismaArgs);

  return count;
}

const getTotalCount = async function(startDate, endDate) {
  const prismaArgs = genPrismaArgs(startDate, endDate);
  prismaArgs['_sum'] = { number: true };

  const count = await prisma.pv.aggregate(prismaArgs);

  return count?._sum?.number || 0;
}

const getCorrectAnswerCount = async function(startDate, endDate) {
  const prismaArgs = {
    where: {
      create_time: {}
    },
    _count: {
      ticket_id: true
    }
  };

  if (startDate) {
    prismaArgs['where']['create_time']['gte'] =  new Date(startDate);
  }
  if (endDate) {
    prismaArgs['where']['create_time']['lte'] =  new Date(endDate);
  }

  const count = await prisma.ticket.aggregate(prismaArgs);

  return count?._count?.ticket_id || 0;
}

const getDailyExamTypeCount = async function(startDate, endDate) {
  const queryCount = `SELECT exam_type.exam_type_name, DATE(ticket.create_time) as date, COUNT(*) as count`;
  const queryFrom = `FROM ticket INNER JOIN exam_type ON ticket.exam_type_id = exam_type.exam_type_id`;
  let queryWhere = '';
  const queryGroupBy = `GROUP BY exam_type.exam_type_name, DATE(ticket.create_time)`;

  if (startDate) {
    queryWhere = queryWhere || 'WHERE';
    queryWhere = queryWhere + ` ticket.create_time >= '${dayjs(startDate).format('YYYY-MM-DD HH:mm:ss')}'`;
  }
  if (endDate) {
    queryWhere = queryWhere ? queryWhere + ' AND ' : 'WHERE';
    queryWhere = queryWhere + ` ticket.create_time <= '${dayjs(endDate).format('YYYY-MM-DD HH:mm:ss')}'`;
  }

  const count = await prisma.$queryRawUnsafe(`${queryCount} ${queryFrom} ${queryWhere} ${queryGroupBy}`);

  return count;
}

export { dailyCounter, getDailyCount, getTotalCount, getCorrectAnswerCount, getDailyExamTypeCount };