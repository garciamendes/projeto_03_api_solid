// Third part
import { PrismaClient } from '@prisma/client'

// project
import { env } from '../env'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
