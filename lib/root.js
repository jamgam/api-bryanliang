import prisma from './prisma'

const root = {
  getHighscores: async () => 
    prisma.score.findMany({
    orderBy: {
      score: 'desc'
    },
    take: 10,
  }),
  createScore: async (data) => prisma.score.create({
    data
  }),
  updateScore: async ({id, username}) => prisma.score.update({
    where: {
      id,
    },
    data: {
      username
    }
  })
};

export default root