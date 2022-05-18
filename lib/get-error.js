const { logger } = require('@vtfk/logger')
const hasData = require('./has-data')

const errors = [
  {
    summary: 'Feil: Ingen funnet med angitt identifikasjon.',
    message: 'Ingen funnet med angitt identifikasjon',
    status: 404
  },
  {
    summary: 'this differs from the allowed length of \'11\'',
    message: 'Angitt fødselsnummer har ugyldig lengde',
    status: 500
  },
  {
    summary: 'dsfClient[options.method] is not a function',
    message: "Angitt 'method' eksisterer ikke på angitt 'url'",
    status: 500
  },
  {
    summary: 'soap:Server: Feil i Back Office',
    message: 'Internal Error from provider (soap:Server: Feil i Back Office)',
    status: 500
  },
  {
    summary: 'Too many found',
    message: 'For mange personer funnet',
    status: 400
  }
]

module.exports = data => {
  const summary = (hasData(data) && (data.SUMMARY || data.message)) || data
  if (!hasData(summary)) {
    logger('error', ['get-error', 'empty error body', data])
    return { status: 500, message: 'Empty error body' }
  } else if (typeof summary !== 'string') {
    logger('error', ['get-error', summary, 'is not a string but of type', typeof summary])
    return { status: 500, message: summary }
  }
  const error = errors.filter(err => err.summary === summary || summary.includes(err.summary)).map(err => ({ status: err.status, message: err.message }))
  if (error.length === 1) return error[0]
  else if (error.length > 1) {
    logger('warn', [error.length, 'equal errors found:', summary])
    return error[0]
  } else {
    logger('error', ['error not found', summary])
    return { status: 500, message: summary }
  }
}
