const util = require('util')
const async = require('async')
const gcpPubsub = require('./gcp-pubsub')
const graphqlPubSub = require('./graphql-pubsub')

// Where the messages from all the topics are stored
// (until the server reboots...)
const messages = {}

const addMessageToTopic = (message, topicName) => {
  if (!messages[topicName]) messages[topicName] = []
  messages[topicName].unshift(message)
}
const getSubscriptionName = topicName =>
  process.env.GCP_SUBSCRIPTION_DEBUGGER_KEY
    ? `${topicName}-debugger-${process.env.GCP_SUBSCRIPTION_DEBUGGER_KEY}`
    : `${topicName}-debugger`

const getTopicNameFromFullTopicName = name => name.split('/').pop()

const returnContent = ([content]) => content

const getTopics = async () => gcpPubsub.getTopics().then(returnContent)
const getMessages = topicName => messages[topicName] || []

const getOrCreateAllSubscriptions = () => {
  return util.promisify(async.auto)({
    topics: getTopics,
    subscriptions: ['topics', getOrCreateSubscriptions],
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
  console.log(`- "${topicName}"`)
  const topic = gcpPubsub.topic(topicName)
  const subscription = topic.subscription(getSubscriptionName(topicName))
  subscription.on('error', console.log)
  subscription.on('message', message => onMessageFromTopic(message, topic))
}

const onMessageFromTopic = (msg, topic) => {
  msg.ack()
  console.log(`> new message on topic ${topic.name}`)

  const topicName = getTopicNameFromFullTopicName(topic.name)

  const dataString = msg.data.toString()
  let data
  try {
    // if the data is encoded in base64
    data = JSON.parse(Buffer.from(dataString, 'base64').toString())
  } catch (error) {
    // else
    data = dataString
  }

  const message = {
    ...msg,
    data,
    topic: {
      name: topicName,
    },
  }

  addMessageToTopic(message, topicName)

  graphqlPubSub.publish('message', {
    message,
  })
}

module.exports.getTopics = getTopics
module.exports.getMessages = getMessages
module.exports.getOrCreateAllSubscriptions = getOrCreateAllSubscriptions
