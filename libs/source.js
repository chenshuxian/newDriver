import prisma from './prisma';
import errorCode from './errorCode';

const getSource = async function(filter, pagination) {
  let source;
  let total;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = filter;
  }

  if (pagination) {
    prismaArgs['skip'] = parseInt(pagination.offset) || 0;
    prismaArgs['take'] = parseInt(pagination.limit) || 50;
  }

  total = await getSourceCount(filter);
  if (!total) {
    throw errorCode.NotFound;
  }

  source = await prisma.source.findMany(prismaArgs);

  return { source, total };
}

const getSourceById = async function(source_id) {
  let source = await prisma.source.findUnique({
    where: {
        source_id
    }
  });

  if (!source) {
    throw errorCode.NotFound;
  }

  return source;
}

const getSourceCount = async function(filter) {
  let count;
  let prismaArgs = {};

  prismaArgs['_count'] = { source_id: true };
  if (filter) {
    prismaArgs['where'] = filter;
  }

  count = await prisma.source.aggregate(prismaArgs);

  if (count) {
    return count._count.source_id;
  }

  return 0;
}

const createSource = async function(data) {
  let source;

  try {
    source = await prisma.source.create({
      data
    });
  } catch (e) {
    throw errorCode.InternalServerError;
  }

  return source;
}

const updateSource = async function(source_id, data) {
  let source;

  try {
    source = await prisma.source.update({
      where: {
        source_id
      },
      data
    })
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return source;
}

const deleteSource = async function(source_id) {
  let source;
  try {
    source = await prisma.source.update({
      where: {
        source_id
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

  return source;
}

export { getSource, createSource, updateSource, deleteSource, getSourceById };