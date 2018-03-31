const dotEnvLoading = require('dotenv').config()
const { GraphQLServer, withFilter } = require('graphql-yoga')

const graphqlPubSub = require('./graphql-pubsub')
const {
  getTopics,
  getMessages,
  getOrCreateAllSubscriptions
} = require('./resolvers')

const GraphQLJSON = require('graphql-type-json')

if (dotEnvLoading.error) {
  throw dotEnvLoading.error
}

const resolvers = {
  Query: {
    topics: getTopics,
    messages: (_, { topicName }) => getMessages(topicName)
  },
  Subscription: {
    message: {
      subscribe: withFilter(
        () => graphqlPubSub.asyncIterator('message'),
        ({ message }, { topicName }) => message.topic.name === topicName
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
  .then(() => {
    console.log('subscribing to all topics..')
    return getOrCreateAllSubscriptions()
  })
  .then(() =>
    console.log(
      '\n== Server GraphQL Playground is running on http://localhost:4000 ==\n'
    )
  )
  .catch(console.error)
