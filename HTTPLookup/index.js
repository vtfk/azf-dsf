const dsfLookup = require('node-dsf')
const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/with-token-auth')
const config = require('../config')
const getResponse = require('../lib/get-response')

const handleDSF = async (context, req) => {
  context.log('JavaScript HTTP trigger function processed a request.')

  try {
    if (!req.body) throw new Error('Please pass a request body')
    else if (!req.body.method) throw new Error('Please pass a method in the request body')
    else if (!req.body.query) throw new Error('Please pass a query in the request body')
    else if (typeof req.body.query !== 'object') throw new Error('Query in request body must be a JSON object')
  }
  catch (error) {
    logger('error', [error.message])
    return getResponse({ error: error.message }, 400)
  }

  const { method, query, url } = req.body

  if (url) config.DSF.url = url

  const options = {
    method,
    config: config.DSF,
    query
  }

  try {
    logger('info', ['request', query.saksref, 'url', config.DSF.url])
    const response = await dsfLookup(options)
    logger('info', ['response', query.saksref, 'url', config.DSF.url, 'success'])
    return getResponse(response)
  } catch (error) {
    logger('error', [error.message || error])
    return getResponse({ error: error.message }, 500)
  }
}

module.exports = (context, req) => withTokenAuth(context, req, handleDSF)
