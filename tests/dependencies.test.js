const { dependencies, devDependencies } = require('../package.json')

const deps = Object.keys(dependencies)
const devDeps = Object.keys(devDependencies)

test(`Sjekker at ${deps.length} dependencies lastes riktig`, () => {
  deps.forEach(dep => {
    const module = require(dep)
    expect(module).toBeTruthy()
  })
})

test(`Sjekker at ${devDeps.length} devDependencies lastes riktig`, () => {
  devDeps.forEach(dep => {
    const module = require(dep)
    expect(module).toBeTruthy()
  })
})
