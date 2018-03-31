const dotEnvLoading = require('dotenv').config()
const { GraphQLServer, withFilter } = require('graphql-yoga')
const { getTopics, subscribeToAllTopics } = require('./resolvers')
const GraphQLJSON = require('graphql-type-json')
const graphqlPubSub = require('./graphql-pubsub')

if (dotEnvLoading.error) {
  throw dotEnvLoading.error
}

const resolvers = {
  Query: {
    topics: getTopics
  },
  Subscription: {
    message: {
      subscribe: withFilter(
        () => graphqlPubSub.asyncIterator('message'),
        ({ message }, { topicName }) => {
          console.log({ message, topicName })
          message.topic === topicName
        }
      )
    }
  },
  JSON: GraphQLJSON
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers
})
server
  .start()
  .then(subscribeToAllTopics)
  .then(() =>
    console.log(
      '\n== Server GraphQL Playground is running on http://localhost:4000 ==\n'
    )
  )
  .catch(console.error)
