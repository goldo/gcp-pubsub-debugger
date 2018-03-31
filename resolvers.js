const util = require('util')
const async = require('async')
const gcpPubsub = require('./gcp-pubsub')
const graphqlPubSub = require('./graphql-pubsub')

// Where the messages from all the topics are stored
// (until the server reboots...)
const messages = {}

const addMessageToTopic = (message, topicName) => {
  if (!messages[topicName]) messages[topicName] = []
  messages[topicName].push(message)
}
const getSubscriptionName = topicName => `${topicName}-debugger`
const getTopicNameFromFullTopicName = name => name.split('/').pop()

const returnContent = ([content]) => content

const getTopics = async () => gcpPubsub.getTopics().then(returnContent)
const getMessages = topicName => messages[topicName] || []

const getOrCreateAllSubscriptions = () => {
  return util.promisify(async.auto)({
    topics: getTopics,
    subscriptions: ['topics', getOrCreateSubscriptions]
  })
}

const getOrCreateSubscriptions = async ({ topics }) =>
  util.promisify(async.map)(topics, async topic => {
    const topicName = getTopicNameFromFullTopicName(topic.name)
    const subscriptionName = getSubscriptionName(topicName)
    const subscription = topic.subscription(subscriptionName)

    return subscription
      .exists()
      .then(([exists]) => {
        if (exists) return subscription
        return topic.createSubscription(subscriptionName).then(returnContent)
      })
      .then(() => subscribeToTopic(topicName))
      .then(() => subscription)
  })

const subscribeToTopic = topicName => {
  console.log(`getting messages on topic "${topicName}"`)
  const topic = gcpPubsub.topic(topicName)
  const subscription = topic.subscription(getSubscriptionName(topicName))
  subscription.on('error', console.log)
  subscription.on('message', message => onMessageFromTopic(message, topic))
}

const onMessageFromTopic = (msg, topic) => {
  msg.ack()
  let data
  const dataString = msg.data.toString()

  const topicName = getTopicNameFromFullTopicName(topic.name)

  try {
    data = JSON.parse(dataString)
  } catch (error) {
    data = dataString
  }

  const message = {
    ...msg,
    data,
    topic: {
      name: topicName
    }
  }

  addMessageToTopic(message, topicName)

  graphqlPubSub.publish('message', { message })
}

module.exports.getTopics = getTopics
module.exports.getMessages = getMessages
module.exports.getOrCreateAllSubscriptions = getOrCreateAllSubscriptions
