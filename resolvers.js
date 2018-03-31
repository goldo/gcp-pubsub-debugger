const util = require('util')
const async = require('async')
const gcpPubsub = require('./gcp-pubsub')
const graphqlPubSub = require('./graphql-pubsub')

const projectId = process.env.GCP_PROJECT_ID

const returnContent = ([content]) => content

const getTopics = async () => gcpPubsub.getTopics().then(returnContent)

const subscribeToAllTopics = () => {
  console.log('subscribing to all topics..')
  return util.promisify(async.auto)({
    topics: getTopics,
    subscribe: ['topics', subscribeToTopics]
  })
}

const subscribeToTopics = async ({ topics }) =>
  util.promisify(async.map)(topics, async topic => {
    const topicName = topic.name.split('/').pop()
    const subscriptionName = `${topicName}-debugger`
    console.log(
      `\n=> Subscribing to topic "${topicName}" with subscription "${subscriptionName}"`
    )

    return gcpPubsub
      .topic(topicName)
      .createSubscription(
        `projects/${projectId}/subscriptions/${subscriptionName}`
      )
      .then(([subscription]) => {
        subscription.on('error', console.log)
        subscription.on('message', message => {
          console.log(message)
          graphqlPubSub.publish('message', {
            message: { ...message, topic: topicName }
          })
        })
        return subscription
      })
  })

module.exports.getTopics = getTopics
module.exports.subscribeToAllTopics = subscribeToAllTopics
