import prisma from './prisma';
import errorCode from './errorCode';

const getPostCode = async function(filter, pagination) {
  let postCode;
  let total;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = filter;
  }

  if (pagination) {
    prismaArgs['skip'] = parseInt(pagination.offset) || 0;
    prismaArgs['take'] = parseInt(pagination.limit) || 50;
  }

  total = await getPostCodeCount(filter);
  if (!total) {
    throw errorCode.NotFound;
  }

  postCode = await prisma.post_code.findMany(prismaArgs);


  return { postCode, total };
}

const getPostCodeById = async function(post_code_id) {
  let postCode = await prisma.post_code.findUnique({
    where: {
      post_code_id
    }
  });

  if (!postCode) {
    throw errorCode.NotFound;
  }

  return postCode;
}

const getPostCodeCount = async function(filter) {
  let count;
  let prismaArgs = {};

  prismaArgs['_count'] = { post_code_id: true };
  if (filter) {
    prismaArgs['where'] = filter;
  }

  count = await prisma.post_code.aggregate(prismaArgs);

  if (count) {
    return count._count.post_code_id;
  }

  return 0;
}

const createPostCode = async function(data) {
  let postCode;

  try {
    postCode = await prisma.post_code.create({
      data
    });
  } catch (e) {
    throw errorCode.InternalServerError;
  }

  return { postCode };
}

const updatePostCode = async function(post_code_id, data) {
  let postCode;

  try {
    postCode = await prisma.post_code.update({
      where: {
        post_code_id
      },
      data
    })
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return postCode;
}

const deletePostCode = async function(post_code_id) {
  let postCode;
  console.log('debug: ' + postCodeId)
  try {
    postCode = await prisma.post_code.update({
      where: {
        post_code_id
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

  return postCode;
}

export { getPostCode, createPostCode, updatePostCode, deletePostCode, getPostCodeById };