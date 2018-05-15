const PubSub = require('@google-cloud/pubsub')

const pubsub = new PubSub({
  projectId: process.env.GCP_PROJECT_ID,
  apiEndpoint: process.env.GCP_API_ENDPOINT,
  credentials: {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_CLIENT_EMAIL,
  },
})

module.exports = pubsub
