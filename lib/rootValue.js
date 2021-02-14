const fetch = require('node-fetch')

const config = {
  headers: {
    'Hasura-Client-Name': 'api-bryanliang-console',
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
  },
}

const graphql = async (query) => {
  const response = await fetch(process.env.HGE_ENDPOINT + '/graphql', {
    method: 'post',
    body:    JSON.stringify({query}),
    ...config,
  })
  const jsonResp = await response.json()
  console.log('graphql', jsonResp)
  return jsonResp?.data
}

const rootValue = {
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
    console.log('getHightscores', Score)
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

module.exports = rootValue