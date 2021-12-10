const repack = require('../lib/repack-dsf-object')

const person = {
  FODT: '258151',
  PERS: '98053',
  INR: '25815100000',
  STAT: 'BOSATT',
  'NAVN-S': 'TUNNEL',
  'NAVN-F': 'OFFISIELL',
  'NAVN-M': 'BANE',
  NAVN: 'TUNNEL OFFISIELL BANE',
  ADR: 'HUSØYVEIEN 28',
  POSTN: '3132',
  POSTS: 'HUSØYSUND',
  'SPES-KD': '0',
  SPES: 'VANLIG BOSATT'
}

const personWithoutADR = {
  FODT: '258151',
  PERS: '98053',
  INR: '25815100000',
  STAT: 'BOSATT',
  'NAVN-S': 'TUNNEL',
  'NAVN-F': 'OFFISIELL',
  'NAVN-M': 'BANE',
  NAVN: 'TUNNEL OFFISIELL BANE',
  'SPES-KD': '0',
  SPES: 'VANLIG BOSATT'
}

const personOn4 = {
  RESULT: {
    HOV: {
      ...person,
      'SPES-KD': '4',
      SPES: 'KLIENTADRESSE'
    }
  }
}

const personOn6 = {
  RESULT: {
    HOV: {
      ...person,
      'SPES-KD': '6',
      SPES: 'SPERRET ADRESSE, STRENGT FORTROLIG'
    }
  }
}

const personOn7 = {
  RESULT: {
    HOV: {
      ...person,
      'SPES-KD': '7',
      SPES: 'SPERRET ADRESSE, FORTROLIG'
    }
  }
}

const personUtvandret = {
  RESULT: {
    HOV: {
      ...person,
      'STAT-KD': '3',
      STAT: 'UTVANDRET',
      ADR1: 'Oppholdsboligen på tunet',
      ADR2: 'POSTBOKS 38738723',
      ADR3: '12345 Bananveien'
    }
  }
}

const personAdditionalAddress = {
  RESULT: {
    HOV: {
      ...person,
      ADR1: 'Oppholdsboligen på tunet',
      ADR2: 'POSTBOKS 38738723',
      ADR3: '1234 Bananveien'
    }
  }
}

const personAdditionalAddress2 = {
  RESULT: {
    HOV: {
      ...person,
      ADR1: 'Oppholdsboligen på tunet',
      ADR2: 'POSTBOKS 38738723',
      ADR3: 'Banan-veien i 2040 Telemark'
    }
  }
}

const justPerson = {
  RESULT: {
    HOV: {
      ...person
    }
  }
}

const invalidADR3butWithADR = {
  RESULT: {
    HOV: {
      ...person,
      ADR1: 'Kjuttaviga',
      ADR2: 'Turid',
      ADR3: 'KRAKABAKA Krukestad'
    }
  }
}

const invalidADR3POSTN = {
  RESULT: {
    HOV: {
      ...personWithoutADR,
      ADR1: 'Kjuttaviga',
      ADR2: 'Turid',
      ADR3: 'KRAKABAKA Krukestad'
    }
  }
}
const invalidADR3POSTS = {
  RESULT: {
    HOV: {
      ...personWithoutADR,
      ADR1: 'Kjuttaviga',
      ADR2: 'Turid',
      ADR3: '1999 2020'
    }
  }
}
const noADR3 = {
  RESULT: {
    HOV: {
      ...personWithoutADR,
      ADR1: 'Kjuttaviga',
      ADR2: 'Turid'
    }
  }
}

describe('Return fake address when', () => {
  test('SPES-KD is 4', () => {
    const repacked = repack(personOn4)
    expect(repacked.RESULT.HOV.ADR.toLowerCase()).toBe(personOn4.RESULT.HOV.SPES.toLowerCase())
    expect(repacked.RESULT.HOV.POSTN).toBe('9999')
    expect(repacked.RESULT.HOV.POSTS.toLowerCase()).toBe('ukjent')
  })

  test('SPES-KD is 6', () => {
    const repacked = repack(personOn6)
    expect(repacked.RESULT.HOV.ADR.toLowerCase()).toBe(personOn6.RESULT.HOV.SPES.toLowerCase())
    expect(repacked.RESULT.HOV.POSTN).toBe('9999')
    expect(repacked.RESULT.HOV.POSTS.toLowerCase()).toBe('ukjent')
  })

  test('SPES-KD is 7', () => {
    const repacked = repack(personOn7)
    expect(repacked.RESULT.HOV.ADR.toLowerCase()).toBe(personOn7.RESULT.HOV.SPES.toLowerCase())
    expect(repacked.RESULT.HOV.POSTN).toBe('9999')
    expect(repacked.RESULT.HOV.POSTS.toLowerCase()).toBe('ukjent')
  })

  test('STAT is UTVANDRET', () => {
    const repacked = repack(personUtvandret)
    expect(repacked.RESULT.HOV.ADR.toLowerCase()).toBe(personUtvandret.RESULT.HOV.STAT.toLowerCase())
    expect(repacked.RESULT.HOV.POSTN).toBe('9999')
    expect(repacked.RESULT.HOV.POSTS.toLowerCase()).toBe('ukjent')
  })
})

describe('Return correct address fields when', () => {
  test('ADR1-3 is set, should have these in postAdresse', () => {
    const repacked = repack(personAdditionalAddress)
    const adr3Split = personAdditionalAddress.RESULT.HOV.ADR3.split(' ')
    expect(repacked.RESULT.HOV.ADR.toLowerCase()).toBe(personAdditionalAddress.RESULT.HOV.ADR.toLowerCase())
    expect(repacked.RESULT.HOV.POSTN).toBe(personAdditionalAddress.RESULT.HOV.POSTN)
    expect(repacked.RESULT.HOV.POSTS.toLowerCase()).toBe(personAdditionalAddress.RESULT.HOV.POSTS.toLowerCase())
    expect(typeof repacked.RESULT.HOV.postAdresse).toBe('object')
    expect(repacked.RESULT.HOV.postAdresse.ADR.toLowerCase()).toBe(`${personAdditionalAddress.RESULT.HOV.ADR1.toLowerCase()} ${personAdditionalAddress.RESULT.HOV.ADR2.toLowerCase()}`)
    expect(repacked.RESULT.HOV.postAdresse.POSTN).toBe(adr3Split[0])
    expect(repacked.RESULT.HOV.postAdresse.POSTS.toLowerCase()).toBe(adr3Split[1].toLowerCase())
  })
  test('ADR1-3 is set, postAdresse.POSTN and postAdresse.POSTS is set correctly, even when ADR3 has a weird setup', () => {
    const repacked = repack(personAdditionalAddress2)
    expect(repacked.RESULT.HOV.postAdresse.POSTN.length === 4 && !!Number(repacked.RESULT.HOV.postAdresse.POSTN)).toBe(true)
    expect(repacked.RESULT.HOV.postAdresse.POSTS.length).toBe(personAdditionalAddress2.RESULT.HOV.ADR3.length - repacked.RESULT.HOV.postAdresse.POSTN.length - 1)
  })

  test('ADR1-3 is not set (Should have original ADR, POSTS, POSTN in postAdresse)', () => {
    const repacked = repack(justPerson)
    expect(typeof repacked.RESULT.HOV.postAdresse).toBe('object')
    expect(repacked.RESULT.HOV.postAdresse.ADR.toLowerCase()).toBe(justPerson.RESULT.HOV.ADR.toLowerCase())
    expect(repacked.RESULT.HOV.postAdresse.POSTN).toBe(justPerson.RESULT.HOV.POSTN)
    expect(repacked.RESULT.HOV.postAdresse.POSTS.toLowerCase()).toBe(justPerson.RESULT.HOV.POSTS.toLowerCase())
  })

  test('ADR, POSTN, POSTS is set', () => {
    const repacked = repack(justPerson)
    expect(repacked.RESULT.HOV.ADR.toLowerCase()).toBe(justPerson.RESULT.HOV.ADR.toLowerCase())
    expect(repacked.RESULT.HOV.POSTN).toBe(justPerson.RESULT.HOV.POSTN)
    expect(repacked.RESULT.HOV.POSTS.toLowerCase()).toBe(justPerson.RESULT.HOV.POSTS.toLowerCase())
  })
})

test('Returns POSTS and POSTN when no valid zipCode or zipPlace is found in ADR3', () => {
  const repacked = repack(invalidADR3butWithADR)
  expect(repacked.RESULT.HOV.POSTS.toLowerCase()).toBe(invalidADR3butWithADR.RESULT.HOV.POSTS.toLowerCase())
  expect(repacked.RESULT.HOV.POSTN.toLowerCase()).toBe(invalidADR3butWithADR.RESULT.HOV.POSTN.toLowerCase())
})

describe('Returns postAdresse object with property-values POSTS: "UKJENT" and POSTN: "9999" when person do not have POSTS and POSTN and', () => {
  test('ADR3 does not contain a valid POSTN', () => {
    const repacked = repack(invalidADR3POSTN)
    expect(repacked.RESULT.HOV.postAdresse.POSTS.toLowerCase()).toBe('ukjent')
    expect(repacked.RESULT.HOV.postAdresse.POSTN).toBe('9999')
  })
  test('ADR3 does not contain a valid POSTS', () => {
    const repacked = repack(invalidADR3POSTS)
    expect(repacked.RESULT.HOV.postAdresse.POSTS.toLowerCase()).toBe('ukjent')
    expect(repacked.RESULT.HOV.postAdresse.POSTN).toBe('9999')
  })
  test('ADR3 does not exist', () => {
    const fn = () => repack(noADR3)
    expect(fn).toThrow(Error)
  })
})

test('Address is not all uppercase when repacked', () => {
  const repacked = repack(justPerson)
  expect(repacked.RESULT.HOV.ADR.toLowerCase()).toBe(justPerson.RESULT.HOV.ADR.toLowerCase())
  expect(repacked.RESULT.HOV.ADR === justPerson.RESULT.HOV.ADR).toBe(false)
})
