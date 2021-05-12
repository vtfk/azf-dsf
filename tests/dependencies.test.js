const { dependencies, devDependencies } = require('../package.json')

const deps = Object.keys(dependencies)
const devDeps = Object.keys(devDependencies)

test(`Sjekker at ${deps.length} dependencies er OK`, () => {
  deps.forEach(dep => {
    const module = require(dep)
    expect(module).toBeTruthy()
  })
})

test(`Sjekker at ${devDeps.length} devDependencies er OK`, () => {
  devDeps.forEach(dep => {
    const module = require(dep)
    expect(module).toBeTruthy()
  })
})
