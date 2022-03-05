import { PrismaClient } from '@prisma/client'

// fix the `Already 10 Prisma Clients are actively running` error
// https://flaviocopes.com/nextjs-fix-prismaclient-unable-run-browser/

let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    })
  }
  prisma = global.prisma
}

export default prisma