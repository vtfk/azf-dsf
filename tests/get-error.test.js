const getError = require('../lib/get-error')
const existingError = {
  CODE: '1',
  SUMMARY: 'Feil: Ingen funnet med angitt identifikasjon.'
}
const nonExistingError = {
  CODE: '69',
  SUMMARY: 'Feil: Apeloff er ikke et gyldig navn'
}

test('Sjekker at registrert error gir tilbake HTTP Error 404', () => {
  const { status, message } = getError(existingError)
  expect(status).toBe(404)
  expect(message).toBe(existingError.SUMMARY)
})

test('Sjekker at ikke-registrert error gir tilbake HTTP Error 500', () => {
  const { status, message: { CODE, SUMMARY } } = getError(nonExistingError)
  expect(status).toBe(500)
  expect(CODE).toBe(nonExistingError.CODE)
  expect(SUMMARY).toBe(nonExistingError.SUMMARY)
})
