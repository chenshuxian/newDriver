import prisma from './prisma';
import errorCode from './errorCode';

const getTrainBook = async function(filter, pagination) {
  let trainBook;
  let total;
  let trainBookId;
  let prismaArgs = {};
  let queryTotal = "SELECT count(*) as total FROM train_book as tb left join users as u on tb.train_book_id = u.train_book_id where u.train_book_id is null";
  let queryId = "SELECT tb.train_book_id  FROM train_book as tb left join users as u on tb.train_book_id = u.train_book_id where u.train_book_id is null";
  let queryList =`SELECT time.time_id, time.time_name FROM train_book as tb 
  left join users as u on tb.train_book_id = u.train_book_id 
  inner join train_period as tp on tb.train_period_id = tp.train_period_id
  inner join teacher as t on tb.teacher_id = t.teacher_id
  inner join time on tb.time_id = time.time_id
  where u.train_book_id is null`;
   
  prismaArgs['where'] = filter;

    if(filter.hasOwnProperty('train_period_id')) {
        queryTotal = `${queryTotal} and train_period_id = '${filter['train_period_id']}'`;
        queryId = `${queryId} and train_period_id = '${filter['train_period_id']}'`;
        queryList = `${queryList} and tp.train_period_id = '${filter['train_period_id']}'`;
    }

    if(filter.hasOwnProperty('teacher_id')) {
        queryTotal = `${queryTotal} and teacher_id = '${filter['teacher_id']}'`;
        queryId = `${queryId} and teacher_id = '${filter['teacher_id']}'`;
        queryList = `${queryList} and t.teacher_id = '${filter['teacher_id']}'`;
    }

    if(filter.hasOwnProperty('user_id')) {
      queryTotal = `${queryTotal} or user_id = '${filter['user_id']}'`;
      queryId = `${queryId} or user_id = '${filter['user_id']}'`;
      queryList = `${queryList} or u.user_id = '${filter['user_id']}'`;
  }


//   if (pagination) {
//     prismaArgs['skip'] = parseInt(pagination.offset) || 0;
//     prismaArgs['take'] = parseInt(pagination.limit) || 50;
//   }

  ([{total}] = await prisma.$queryRawUnsafe(`${queryTotal}`));
  if (!total) {
    throw errorCode.NotFound;
  }

  trainBookId = await prisma.$queryRawUnsafe(`${queryId}`);
  let newList = trainBookId.reduce(function(prev, curr) {
    return [...prev, curr.train_book_id];
  },[]);

  

  trainBook = await prisma.$queryRawUnsafe(`${queryList}`);

//   prismaArgs['where'] = {
//       train_book_id : {
//           in : newList
//       }
//   }

//   prismaArgs['select'] = {
//     // users: {
//     //     where: {
//     //         train_book_id : {
//     //             equals: ''
//     //         }
//     //     }
//     // },
//     train_period: true,
//     teacher: { select : {teacher_name: true, teacher_id: true} },
//     time: { select : {time_name: true}}
//   }

//   trainBook = await prisma.train_book.findMany(prismaArgs);

  return { trainBook, total };
}

const getTrainBookId = async function(train_period_id, teacher_id, time_id) {

  let trainBookId;
  try{
    trainBookId = await prisma.train_book.findMany({
      where: {
        train_period_id,
        teacher_id,
        time_id : { equals: parseInt(time_id) }
      },
      select: {
        train_book_id: true
      }
    });
  }catch (e) {
    console.log(`getBookId err: ${e}`)
  }


  if (!trainBookId) {
    throw errorCode.NotFound;
  }

  return trainBookId;
}

const getTrainBookById = async function(train_book_id) {
  let trainBook = await prisma.train_book.findUnique({
    where: {
        train_book_id
    }
  });

  if (!trainBook) {
    throw errorCode.NotFound;
  }

  return trainBook;
}

const getTrainBookCount = async function(filter) {
  let count;
  let prismaArgs = {};

  prismaArgs['_count'] = { train_book_id: true };
  if (filter) {
    prismaArgs['where'] = filter;
  }


  count = await prisma.train_book.aggregate(prismaArgs);

  if (count) {
    return count._count.train_book_id;
  }

  return 0;
}

const createTrainBook = async function(data) {
  let trainBook;

  try {
    trainBook = await prisma.train_book.create({
      data
    });
  } catch (e) {
    throw errorCode.InternalServerError;
  }

  return trainBook;
}

const createManyTrainBook = async function(trainPeriod, teacher, time) {
  //[{train_period_id, teacher_id, time_id}]
  let data = [];
  let count;
  for await (const tp of trainPeriod) {
    if (!tp) {
      continue;
    }
    for await (const teach of teacher) {
      if (!teach) {
        continue;
      }
      for await (const t of time) {
        if (!t) {
          continue;
        }
        data.push({'train_period_id': tp.train_period_id, 'teacher_id':teach.teacher_id, 'time_id':t.time_id})
      }
    }
  }


  try {
    ({ count } = await prisma.train_book.createMany({
      data
    }));
  } catch (e) {
    console.log(`create many trainBook err: ${e}`)
    throw errorCode.InternalServerError;
  }

  return count ;

}


const updateTrainBook = async function(train_book_id, data) {
  let trainBook;

  try {
    trainBook = await prisma.train_book.update({
      where: {
        train_book_id
      },
      data
    })
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return trainBook;
}

const deleteTrainBook = async function(train_book_id) {
  let trainBook;

  try {

    if (Array.isArray(train_book_id)) {
        trainBook = await prisma.train_book.deleteMany({
          where: {
            train_book_id: { in: train_book_id }
          }
        });
      } else {
        trainBook = await prisma.train_book.delete({
            where: {
              train_book_id
            }
          });
      }
    
  } catch (e) {
    console.log(e)
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return trainBook;
}

export { getTrainBook, createTrainBook, createManyTrainBook, updateTrainBook, deleteTrainBook, getTrainBookById, getTrainBookId };