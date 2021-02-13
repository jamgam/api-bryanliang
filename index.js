import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import schema from './lib/schema'
import root from './lib/root'
import hash from 'object-hash'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send({name: 'api.bryanliang.me', version: '1.0.0', mode: process.env.NODE_ENV, }));

app.use('/graphQl', (req, res, next) => {
  const { query, verificationHash } = req.body
  const isDevMode = process.env.NODE_ENV === 'development' 
  const correctHash = hash({query, key: process.env.SECRET_KEY})
  if (verificationHash === correctHash || isDevMode) {
    next()
  } else {
    isDevMode && console.log('HASH MISMATCH', verificationHash, correctHash)
    res.sendStatus(401)
  }
})

app.use(
  '/graphQl',
  graphqlHTTP({
    rootValue: root,
    schema,
    graphiql: process.env.NODE_ENV === 'development',
  })
);


app.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})

module.exports = app