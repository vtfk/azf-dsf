const dsfLookup = require('node-dsf')
const config = require('../config')

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.')

  if (!req.body || !req.body.method) {
    context.res = {
      status: 400,
      body: 'Please pass a method in the request body'
    }
    return
  }

  const options = {
    method: req.body.method,
    config: config.DSF,
    query: req.body.query
  }

  try {
    const resp = await dsfLookup(options)
    context.log('info', ['response', resp, 'success'])
    context.done(null, resp)
    context.res = {
      status: 500,
      body: resp
    }
  } catch (error) {
    console.log(error)
    context.log.error('error', [JSON.stringify(error, null, 2)])
    context.res = {
      status: 500,
      body: JSON.stringify(error, null, 2)
    }
  }
}
