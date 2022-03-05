import prisma from './prisma';
import errorCode from './errorCode';
import crypto from 'crypto';

const getAdminUser = async function(filter, pagination) {
  let adminUser;
  let total;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = filter;
  }

  if (pagination) {
    prismaArgs['skip'] = parseInt(pagination.offset) || 0;
    prismaArgs['take'] = parseInt(pagination.limit) || 50;
  }

  prismaArgs['select'] = {
    id: true,
    name: true,
    create_time: true,
    update_time: true
  };

  total = await getAdminUserCount(filter);
  if (!total) {
    throw errorCode.NotFound;
  }

  adminUser = await prisma.admin.findMany(prismaArgs);

  return { adminUser, total };
}

const getAdminUserById = async function(id) {
  let adminUser = await prisma.admin.findUnique({
    where: {
      id
    },
    select : {
      id: true,
      name: true,
      create_time: true,
      update_time: true
    }
  });

  if (!adminUser) {
    throw errorCode.NotFound;
  }

  return adminUser;
}

const getAdminUserCount = async function(filter) {
  let count;
  let prismaArgs = {};

  prismaArgs['_count'] = { id: true };
  if (filter) {
    prismaArgs['where'] = filter;
  }

  count = await prisma.admin.aggregate(prismaArgs);

  if (count) {
    return count._count.id;
  }

  return 0;
}

const createAdminUser = async function(data) {
  let adminUser;

  data.password = getPasswordHash(data.password || Math.random());

  try {
    adminUser = await prisma.admin.create({
      data
    });
  } catch (e) {
    throw errorCode.InternalServerError;
  }

  if (adminUser.password) {
    delete adminUser.password;
  }

  return adminUser;
}

const updateAdminUser = async function(id, data) {
  let adminUser;

  if (data.password) {
    data.password = getPasswordHash(data.password);
  }

  try {
    adminUser = await prisma.admin.update({
      where: {
        id
      },
      data
    })
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  if (adminUser.password) {
    delete adminUser.password;
  }

  return adminUser;
}

const deleteAdminUser = async function(id) {
  let adminUser;

  try {
    adminUser = await prisma.admin.delete({
      where: {
        id
      }
    });
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  if (adminUser.password) {
    delete adminUser.password;
  }

  return adminUser;
}

const getPasswordHash = function(password) {
  const hash = crypto.createHash('sha256').update(password).digest('hex');

  return hash;
}

const getAdminByCredentials = async function(name, password) {
  password = getPasswordHash(password);

  let adminUser;
  try {
    adminUser = await prisma.admin.findFirst({
      where: {
        name, password
      },
      select : {
        id: true,
        name: true,
        create_time: true,
        update_time: true
      }
    });
  } catch (e) {
    return null;
  }

  return adminUser;
}

export { getAdminUser, createAdminUser, updateAdminUser, deleteAdminUser, getAdminUserById, getAdminByCredentials };