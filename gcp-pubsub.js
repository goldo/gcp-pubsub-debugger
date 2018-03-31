const PubSub = require('@google-cloud/pubsub')

const pubsub = new PubSub({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_CLIENT_EMAIL
  }
})

module.exports = pubsub
