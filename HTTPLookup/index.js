const dsfLookup = require('node-dsf')
const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/with-token-auth')
const { DSF, DSF_URL, DSF_MASS_URL } = require('../config')
const repackDsfObject = require('../lib/repack-dsf-object')
const getResponse = require('../lib/get-response')
const getError = require('../lib/get-error')

const handleDSF = async (context, req) => {
  try {
    if (!req.body) throw new Error('Please pass a request body')
    else if (!req.body.method) throw new Error('Please pass a method in the request body')
    else if (!req.body.query) throw new Error('Please pass a query in the request body')
    else if (typeof req.body.query !== 'object') throw new Error('Query in request body must be a JSON object')
  } catch (error) {
    logger('error', [error.message])
    return getResponse({ error: error.message }, 400)
  }

  const { method, query, massLookup } = req.body

  if (massLookup) DSF.url = DSF_MASS_URL
  else DSF.url = DSF_URL
  logger('info', [query.saksref, method, 'url', DSF.url])

  const options = {
    method,
    config: DSF,
    query
  }

  try {
    logger('info', [query.saksref, method, 'request'])
    const response = await dsfLookup(options)
    if (!response.RESULT.HOV) throw new Error(`Too many found (${Number(response.RESULT.ANTAFUN)})`)
    const repack = repackDsfObject(response)
    logger('info', [query.saksref, method, 'response'])
    return getResponse(repack)
  } catch (error) {
    const { status, message } = getError(error)
    logger('error', [query.saksref, method, message, `(${error.SUMMARY || error.message || error})`])
    return getResponse({ error: message }, status)
  }
}

module.exports = (context, req) => withTokenAuth(context, req, handleDSF)
