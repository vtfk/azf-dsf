module.exports = {
  DSF: {
    url: process.env.DSF_URL || 'http://ws-test.infotorg.no/xml/ErgoGroup/DetSentraleFolkeregister1_4/2015-08-10/DetSentraleFolkeregister1_4.wsdl',
    namespaceBrukersesjon: process.env.DSF_NAMESPACE || 'http://ws.infotorg.no/xml/Admin/Brukersesjon/2006-07-07/Brukersesjon.xsd',
    distribusjonskanal: process.env.DSF_DIST || 'PTP',
    systemnavn: process.env.DSF_SYSTEM_NAVN || 'systemnavn',
    brukernavn: process.env.DSF_BRUKERNAVN || 'brukernavn',
    passord: process.env.DSF_PASSORD || 'passord'
  },
  JWT_SECRET: process.env.JWT_SECRET || 'Really secret secret',
  PAPERTRAIL_DISABLE_LOGGING: (process.env.PAPERTRAIL_DISABLE_LOGGING && process.env.PAPERTRAIL_DISABLE_LOGGING === 'true') || false,
  PAPERTRAIL_HOST: process.env.PAPERTRAIL_HOST || undefined,
  PAPERTRAIL_HOSTNAME: process.env.PAPERTRAIL_HOSTNAME || undefined,
  PAPERTRAIL_PORT: process.env.PAPERTRAIL_PORT || undefined
}
