var express = require('express')
var app = express()

var environment = require('./environments')
var PropertiesReader = require('properties-reader')
var properties = new PropertiesReader(environment)

var port = properties.get('main.app.port')
var projectName = properties.get('gcp.projectName')
var subscriptionName = properties.get('gcp.subscriptionName')

app.listen(port)

console.log(`Listening on port ${port}`)

app.get("/", (req, res) => {
  try{
    listSubscriptions((subscriptions)=> {
      res.status(200).send(JSON.stringify(subscriptions.map(s => s.name)))
    })
  } catch (err) {
    res.status(503).send(JSON.stringify(err))
  }
})

async function listSubscriptions(callback) {
  // [START pubsub_list_subscriptions]
  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client
  const pubsub = new PubSub();

  // Lists all subscriptions in the current project
  const [subscriptions] = await pubsub.getSubscriptions();
  console.log('Subscriptions:');
  subscriptions.forEach(subscription => console.log(subscription.name));

  // [END pubsub_list_subscriptions]
  callback(subscriptions)
}
