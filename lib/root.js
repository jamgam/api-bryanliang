const got = require('got')

const config = {
  headers: {
    'Hasura-Client-Name': 'api-bryanliang-console',
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
  },
}

const graphql = async (query) => {
  const { body } = await got.post(process.env.HGE_ENDPOINT + '/graphql', {
    json: {
      query,
    },
    responseType: 'json',
    ...config
  }, config)
  console.log(body?.data)
  return body?.data
}

const root = {
  getHighscores: async () => {
    const { Score } = await graphql(`query {
      Score(limit: 10, order_by: {score: desc}) {
        date
        duration
        id
        score
        username
      }
    }`)
    return Score
  },
  createScore: async ({duration, score, username}) => {
    const { insert_Score_one } = await graphql(`mutation {
      insert_Score_one(object: {duration: ${duration}, score: ${score}, username: "${username}"}) {
        id
        score
        username
        duration
        date
      }
    }`)
    return insert_Score_one
  },
  updateScore: async ({id, username}) => {
    const { update_Score_by_pk } = await graphql(`mutation {
      update_Score_by_pk(pk_columns: {id: ${id}}, _set: {username: "${username}"}) {
        id
        date
        duration
        score
        username
      }
    }`)
    return update_Score_by_pk
  }
};

module.exports = root