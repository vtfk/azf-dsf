const getResponse = require('../lib/get-response')

const response = getResponse({ message: 'Hello world' })

test('Sjekker at response inneholder nødvendige felter', () => {
  expect(response).toBeInstanceOf(Object)
  expect(typeof response.status).toBe('number')
  expect(response.headers).toBeInstanceOf(Object)
  expect(response.headers['Content-Type'].toLowerCase()).toBe('application/json')
  expect(response.body).toBeTruthy()
})
