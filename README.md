# azf-dsf
Azure Function to lookup data from DSF (Det sentrale folkeregisteret) using [node-dsf](https://www.npmjs.com/package/node-dsf).
DSF is register of residents in Norway.

To obtain login credentials and other permissions, please head over to [infotorg.no](https://www.infotorg.no/).

Infotorg field descripton: [Funksjonell feltoversikt - Det sentrale folkeregister](https://www.infotorg.no/leveranse/integrasjonen/integrasjon-mot-folkeregisteret/_/attachment/download/f6d059b7-2098-491f-ba92-0ab2939ef084:f14d2e79b7f0e76c87ae136622d53ce9e43ed6ab/Funksjonell%20feltoversikt%20Det%20sentrale%20folkeregister%20v1-5.pdf)

Not in use, but useful info: [Informasjonsmodell modernisert folkeregister](https://skatteetaten.github.io/folkeregisteret-api-dokumentasjon/informasjonsmodell/)

Valid test-objects are found here: [Oversikt over gyldige testobjekter](https://www.infotorg.no/leveranse/integrasjonen/integrasjon-mot-folkeregisteret)

## Azure Function

### **All calls need a valid JSON Web Token**

### Application settings (``local.settings.json``):
```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "",
    "DSF_URL": "http://ws-test.infotorg.no/xml/ErgoGroup/DetSentraleFolkeregister1_4/2015-08-10/DetSentraleFolkeregister1_4.wsdl",
    "DSF_MASS_URL": "http://ws-test.infotorg.no/xml/ErgoGroup/DSFMasseoppslag1_4/2015-08-10/DSFMasseoppslag1_4.wsdl",
    "DSF_NAMESPACE": "http://ws.infotorg.no/xml/Admin/Brukersesjon/2006-07-07/Brukersesjon.xsd",
    "DSF_DIST": "PTP", 
    "DSF_SYSTEM_NAVN": "systemnavn",
    "DSF_BRUKERNAVN": "brukernavn",
    "DSF_PASSORD": "passord",
    "JWT_SECRET": "Skikkelig hemmelig secret",
    "PAPERTRAIL_DISABLE_LOGGING": false,
    "PAPERTRAIL_HOST": "https://logs.collector.solarwinds.com/v1/log",
    "PAPERTRAIL_TOKEN": "hgbegpgnq4gbnpq49glbpuqpqgpqgqeøå9eqor",
    "E18_URL": "https://e18url.net", // optional
    "E18_KEY": "secret token", // optional
    "E18_SYSTEM": "dsf", // optional
    "E18_EMPTY_JOB": true // optional
  }
}
```

### E18

To support [E18](https://github.com/vtfk/e18-node#usage), add `E18_URL`, `E18_KEY` and `E18_SYSTEM`

## API

**Actual address will not be returned for persons with these SPES-KD codes**:
- **4**: *KLIENTADRESSE*
- **5**: *UTEN FAST BO.*
- **6**: *SPERRET ADRESSE, STRENGT FORTROLIG*
- **7**: *SPERRET ADRESSE, FORTROLIG*

**Actual address will not be returned for persons with these STAT-KD codes**:
- **5**: *DØD*
- **8**: *ANNULLERT TILGANG*
- **9**: *Uregistrert*

**Actual address will not be returned when**:
- *STAT* **is** *UTVANDRET*
- *ADRL* **is defined (has address outside of Norway)**

### POST ```/lookup```

**Request**
```json
{
  "method": "hentDetaljer",
  "query": {
    "saksref": "your-reference",
    "internalref": "your-internal-reference", // optional if you want an internal reference logged out with the request
    "foedselsdato": "01013300239"
  }
}
```

See valid test data on [infotorg.no](https://qa.infotorg.no/test/cms/site/0/page?id=77)

**Response**
```json
{
  "RESULT": {
    "HOV": {
      "FODT": "010133",
      "PERS": "00239",
      "INR": "01013300309",
      "FODTAR": "1933",
      "STAT-KD": "1",
      "STAT": "BOSATT",
      "NAVN-S": "Mo",
      "NAVN-F": "Irene",
      "NAVN-M": "Fos",
      "NAVN": "Mo Irene Fos",
      "NAVN-D": null,
      "ADRR": "19971001",
      "ADRF": "19971001",
      "ADR": "Etterstad",
      "POSTN": "0603",
      "POSTS": "OSLO",
      "KOMNR": "0018",
      "KOMNA": "REFKOM1",
      "GARD": "00018",
      "BRUK": "0018",
      "ADRTYPE": "M",
      "INVF": "106",
      "INVF-N": "SVERIGE",
      "INVF-R": "19911031",
      "INVF-F": "19911031",
      "FKOM": "0019",
      "FKOM-N": "REFKOM2",
      "FKOM-R": "19971001",
      "FKOM-F": "19971001",
      "UTVT": null,
      "UTVT-N": null,
      "UTVT-R": null,
      "UTVT-F": null,
      "AARSADR": "26",
      "SPES-KD": "0",
      "SPES": "VANLIG BOSATT",
      "SKKR": "0001",
      "VAKR": "0001",
      "MELD": "",
      "SIVS-KD": "5",
      "SIVS": "SEPARERT",
      "Statsborgerskap": [
        {
          "STATB-KD": "000",
          "STATB": "NORSK"
        }
      ],
      "KJONN": "K",
      "AARSNVN": "02",
      "FODKNR": "106",
      "FODK": "SVERIGE",
      "FODS": null,
      "FNR": "01013300239",
      "bostedsAdresse": {
        "ADR": "Etterstad",
        "POSTN": "0603",
        "POSTS": "OSLO"
      },
      "postAdresse": {
        "ADR": "Etterstad",
        "POSTN": "0603",
        "POSTS": "OSLO"
      }
    }
  }
}
```

### POST ```/lookup``` for mass lookups

**Request**
```json
{
  "method": "hentDetaljer",
  "massLookup": true,
  "query": {
    "saksref": "your-reference",
    "internalref": "your-internal-reference", // optional if you want an internal reference logged out with the request
    "foedselsdato": "010133",
    "etternavn": "Mo",
    "fornavn": "Irene"
  }
}
```

**Response**
```json
{
  "RESULT": {
    "HOV": {
      "FODT": "010133",
      "PERS": "00239",
      "INR": "01013300309",
      "FODTAR": "1933",
      "STAT-KD": "1",
      "STAT": "BOSATT",
      "NAVN-S": "Mo",
      "NAVN-F": "Irene",
      "NAVN-M": "Fos",
      "NAVN": "Mo Irene Fos",
      "NAVN-D": null,
      "ADRR": "19971001",
      "ADRF": "19971001",
      "ADR": "Etterstad",
      "POSTN": "0603",
      "POSTS": "OSLO",
      "KOMNR": "0018",
      "KOMNA": "REFKOM1",
      "GARD": "00018",
      "BRUK": "0018",
      "ADRTYPE": "M",
      "INVF": "106",
      "INVF-N": "SVERIGE",
      "INVF-R": "19911031",
      "INVF-F": "19911031",
      "FKOM": "0019",
      "FKOM-N": "REFKOM2",
      "FKOM-R": "19971001",
      "FKOM-F": "19971001",
      "UTVT": null,
      "UTVT-N": null,
      "UTVT-R": null,
      "UTVT-F": null,
      "AARSADR": "26",
      "SPES-KD": "0",
      "SPES": "VANLIG BOSATT",
      "SKKR": "0001",
      "VAKR": "0001",
      "MELD": "",
      "SIVS-KD": "5",
      "SIVS": "SEPARERT",
      "Statsborgerskap": [
        {
          "STATB-KD": "000",
          "STATB": "NORSK"
        }
      ],
      "KJONN": "K",
      "AARSNVN": "02",
      "FODKNR": "106",
      "FODK": "SVERIGE",
      "FODS": null,
      "FNR": "01013300239",
      "bostedsAdresse": {
        "ADR": "Etterstad",
        "POSTN": "0603",
        "POSTS": "OSLO"
      },
      "postAdresse": {
        "ADR": "Etterstad",
        "POSTN": "0603",
        "POSTS": "OSLO"
      }
    }
  }
}
```

## Related
- [node-dsf](https://github.com/telemark/node-dsf) Node.js module for looking up data from DSF (Det sentrale folkeregister)

## License
[MIT](LICENSE)
