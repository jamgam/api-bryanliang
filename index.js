const dotenv = require('dotenv')
const cors = require('cors')
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./lib/schema')
// const root = require('./lib/root')
const hash = require('object-hash')
const fetch = require('node-fetch')

const app = express()
const PORT = process.env.PORT || 3000


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
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send({name: 'api.bryanliang.me', version: '1.0.0', mode: process.env.NODE_ENV, }));

// app.use('/graphQl', (req, res, next) => {
//   const { query, verificationHash } = req.body
//   const correctHash = hash({query, key: process.env.SECRET_KEY})
//   if (verificationHash === correctHash) {
//     next()
//   } else {
//     console.log('HASH MISMATCH', verificationHash, correctHash)
//     res.sendStatus(401)
//   }
// })

app.use(
  '/graphQl',
  graphqlHTTP({
    rootValue,
    schema,
    graphiql: process.env.NODE_ENV === 'development',
  })
);


app.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})

module.exports = app