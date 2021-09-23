const { logger } = require('@vtfk/logger')

const errors = [
  {
    summary: 'Feil: Ingen funnet med angitt identifikasjon.',
    message: 'Ingen funnet med angitt identifikasjon',
    status: 404
  },
  {
    summary: 'this differs from the allowed length of \'11\'',
    message: "Angitt fødselsnummer har ugyldig lengde",
    status: 500
  },
  {
    summary: 'dsfClient[options.method] is not a function',
    message: "Angitt 'method' eksisterer ikke på angitt 'url'",
    status: 500
  }
]

module.exports = data => {
  const summary = data.SUMMARY || data.message || data
  const error = errors.filter(err => err.summary === summary).map(err => ({ status: err.status, message: err.message }))
  if (error.length === 1) return error[0]
  else if (error.length > 1) {
    logger('warn', [error.length, 'equal errors found:', summary])
    return error[0]
  } else {
    logger('error', ['error not found', summary])
    return { status: 500, message: summary }
  }
}
