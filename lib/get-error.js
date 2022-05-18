const { logger } = require('@vtfk/logger')
const hasData = require('./has-data')

const getMessage = data => {
  if (!hasData(data)) return { summary: data }

  if (data.SUMMARY) return { summary: data.SUMMARY }
  if (data.message) return { summary: data.message }
  if (data.Fault && data.Fault.faultstring) return { summary: data.Fault.faultstring, extras: data.Fault.detail }

  return data.toString()
}

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
    summary: 'Invalid XML',
    message: 'Invalid XML',
    status: 500
  },
  {
    summary: 'Feil i kommunikasjon mot dataleverandør',
    message: 'Feil i kommunikasjon mot dataleverandør',
    status: 500
  },
  {
    summary: 'For mange samtidige forespørsler mot tjenesten, prøv igjen senere',
    message: 'For mange samtidige forespørsler mot tjenesten, prøv igjen senere',
    status: 500
  },
  {
    summary: 'Timeout fra dataleverandør',
    message: 'Timeout fra dataleverandør',
    status: 500
  },
  {
    summary: 'Too many found',
    message: 'For mange personer funnet',
    status: 400
  }
]

module.exports = data => {
  const { summary, extras } = getMessage(data)

  if (!hasData(summary)) {
    logger('error', ['get-error', 'empty error body', data, extras || ''])
    return { status: 500, message: 'Empty error body', extras }
  } else if (typeof summary !== 'string') {
    logger('error', ['get-error', summary, 'is not a string but of type', typeof summary, extras || ''])
    return { status: 500, message: summary, extras }
  }

  const error = errors.filter(err => err.summary === summary || summary.includes(err.summary)).map(err => ({ status: err.status, message: err.message, extras }))
  if (error.length === 1) return error[0]
  else if (error.length > 1) {
    logger('warn', [error.length, 'equal errors found:', summary, extras || ''])
    return error[0]
  } else {
    logger('error', ['error not found', summary, extras || ''])
    return { status: 500, message: summary, extras }
  }
}
