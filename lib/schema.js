import { buildSchema } from 'graphql'

var schema = buildSchema(`
  type Score {
    id: Int 
    score: Int!
    duration: Float!
    username: String!
    date: String 
  }

  input ScoreInput {
    score: Int!
    duration: Float!
    username: String!
  }

  type Query {
    getHighscores: [Score]
  }

  type Mutation {
    createScore(score: Int!, duration: Float!, username: String!): Score
    updateScore(id: Int!, username: String!): Score
  }
`)

export default schema