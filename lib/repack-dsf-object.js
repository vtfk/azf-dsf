const capitalize = require('capitalize')
const { logger } = require('@vtfk/logger')

const capitalizeWords = data => {
  const options = { skipWord: /^(i|og|von|av|fra|de)$/ }
  return capitalize.words(data, options)
}

const addressBlockOptions = {
  codes: [
    '4', // KLIENTADRESSE
    '5', // UTEN FAST BO.
    '6', // SPERRET ADRESSE, STRENGT FORTROLIG
    '7' // SPERRET ADRESSE, FORTROLIG
  ],
  zipCode: '9999',
  zipPlace: 'Ukjent'
}

const setCustomAddress = (person, adr) => {
  person.ADR = capitalizeWords(adr)
  person.POSTN = addressBlockOptions.zipCode
  person.POSTS = addressBlockOptions.zipPlace
  person.bostedsAdresse = {
    ADR: person.ADR,
    POSTN: person.POSTN,
    POSTS: person.POSTS
  }
  person.postAdresse = { ...person.bostedsAdresse }
  if (person.ADR1) delete person.ADR1
  if (person.ADR2) delete person.ADR2
  if (person.ADR3) delete person.ADR3
  if (person.KOMNA) delete person.KOMNA
  if (person.KOMNR) delete person.KOMNR
  if (person.FKOM) delete person.FKOM
  if (person['FKOM-N']) delete person['FKOM-N']
  if (person['FKOM-R']) delete person['FKOM-R']
  if (person['FKOM-F']) delete person['FKOM-F']
  if (person.GATE) delete person.GATE
  if (person.HUS) delete person.HUS
  if (person.BOKS) delete person.BOKS
  if (person.FODK) delete person.FODK
  if (person.FODS) delete person.FODS
}

const noAddress = person => !person.ADR && !person.POSTN && !person.POSTS && !person.ADR1 && !person.ADR2 && !person.ADR3

const repackAlternateAddress = (adr1, adr2, adr3) => {
  const result = {
    address: capitalizeWords(adr1 && adr2 ? `${adr1} ${adr2}` : adr1 || (adr2 || ''))
  }
  if (adr3) {
    const split = adr3.split(' ')
    const resultAdr3 = split.reduce((accumulator, current) => {
      if (Number(current) && current.length === 4) {
        accumulator.zipCode = current
      } else {
        accumulator.zipPlace += `${current} `
      }
      return accumulator
    }, { zipCode: '', zipPlace: '' })

    if (resultAdr3.zipCode === '' || resultAdr3.zipPlace.trim() === '') {
      logger('warn', ['repack-dsf-object', 'repackAlternateAddress', 'zipCode or zipPlace not found', adr3, 'using fallback'])
      result.zipCode = addressBlockOptions.zipCode
      result.zipPlace = addressBlockOptions.zipPlace
    } else {
      result.zipCode = capitalizeWords(resultAdr3.zipCode.trim())
      result.zipPlace = capitalizeWords(resultAdr3.zipPlace.trim())
    }
  } else {
    result.zipCode = addressBlockOptions.zipCode
    result.zipPlace = addressBlockOptions.zipPlace
  }

  return result
}

const handlePerson = person => {
  if (addressBlockOptions.codes.includes(person['SPES-KD'])) {
    console.log('addressBlock found:', person['SPES-KD'])
    setCustomAddress(person, person.SPES)
  } else if (person.STAT === 'UTVANDRET') {
    console.log('utvandret found:', person.STAT)
    setCustomAddress(person, person.STAT)
  } else if (person.ADRL) {
    console.log('addresse i utlandet found:', person.ADRL)
    setCustomAddress(person, person.ADRL)
  } else if (person.STAT.toLowerCase() === 'aktiv' && noAddress(person)) {
    console.log('personen er aktiv i DSF men har ikke adresse:', person.STAT)
    setCustomAddress(person, person.STAT)
  } else {
    person.ADR = capitalizeWords(person.ADR || '')
    person.POSTN = capitalizeWords(person.POSTN || '')
    person.POSTS = capitalizeWords(person.POSTS || '')

    person.bostedsAdresse = {
      ADR: person.ADR,
      POSTN: person.POSTN,
      POSTS: person.POSTS
    }
    person.postAdresse = { ...person.bostedsAdresse }

    if (person.ADR1 && person.ADR2 && person.ADR3) {
      // Alternativ adresse
      console.log('Alternativ adresse funnet.....')
      const alternateAddress = repackAlternateAddress(person.ADR1, person.ADR2, person.ADR3)
      person.postAdresse.ADR = alternateAddress.address
      person.postAdresse.POSTN = alternateAddress.zipCode === addressBlockOptions.zipCode && person.POSTN ? person.POSTN : alternateAddress.zipCode
      person.postAdresse.POSTS = alternateAddress.zipPlace === addressBlockOptions.zipPlace && person.POSTS ? person.POSTS : alternateAddress.zipPlace
    } else if (!person.ADR) {
      console.log('AIAIAI. Hit kommer vi aldri!')
      throw new Error('SPION FRA RUSSLAND!')
    }
  }

  if (person['NAVN-F']) {
    person['NAVN-F'] = capitalizeWords(person['NAVN-F'])
  }
  if (person['NAVN-M']) {
    person['NAVN-M'] = capitalizeWords(person['NAVN-M'])
  }
  if (person['NAVN-S']) {
    person['NAVN-S'] = capitalizeWords(person['NAVN-S'])
  }
  if (person.NAVN) {
    person.NAVN = capitalizeWords(person.NAVN)
  }
  person.FNR = `${person.FODT}${person.PERS}`

  return person
}

module.exports = dsf => {
  const repacked = {
    RESULT: {
      HOV: {}
    }
  }
  if (dsf.RESULT.HOV) {
    repacked.RESULT.HOV = handlePerson({ ...dsf.RESULT.HOV })
  }
  if (dsf.RESULT.FOR) {
    repacked.RESULT.FOR = dsf.RESULT.FOR.map(handlePerson)
  }

  return repacked
}
