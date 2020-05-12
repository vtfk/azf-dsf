# azf-dsf
Azure Function to lookup data from DSF (Det sentrale folkeregisteret) using [node-dsf](https://www.npmjs.com/package/node-dsf).
DSF is register of residents in Norway.

To obtain login credentials and other permissions, please head over to [infotorg.no](https://www.infotorg.no/).

## Azure Function
### Application settings (``local.settings.json``):
```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "",
    "DSF_URL": "http://ws-test.infotorg.no/xml/ErgoGroup/DetSentraleFolkeregister1_4/2015-08-10/DetSentraleFolkeregister1_4.wsdl",
    "DSF_NAMESPACE": "http://ws.infotorg.no/xml/Admin/Brukersesjon/2006-07-07/Brukersesjon.xsd",
    "DSF_DIST": "PTP", 
    "DSF_SYSTEM_NAVN": "systemnavn",
    "DSF_BRUKERNAVN": "brukernavn",
    "DSF_PASSORD": "passord"
  }
}
```


## API
### POST ```/```

**Request**

```json
{
  "method": "hentDetaljer",
  "query": {
    "saksref": "your-reference",
    "foedselsnr": "01013300239",
    "etternavn": "FOS",
    "fornavn": "IRENE"
  }
}
```

See valid test data on [infotorg.no](https://qa.infotorg.no/test/cms/site/0/page?id=77)

**Response**
```json
{
  "RESULT": {
    "HOV": {
      "FODT": "220486",
      "PERS": "12345",
      "INR": "22048612345",
      "FODTAR": "1986",
      "STAT-KD": "1",
      "STAT": "BOSATT",
      "NAVN-S": "GRÅ",
      "NAVN-F": "GANDALF",
      "NAVN-M": {},
      "NAVN": "GRÅ GANDALF",
      "NAVN-D": {},
      "ADRR": "20060822",
      "ADRF": "20060818",
      "ADR": "SNIPPETSTADSTREDET 24",
      "POSTN": "1732",
      "POSTS": "HØTTEN",
      "KOMNR": "0707",
      "KOMNA": "HØTTEN",
      "GATE": "01880",
      "HUS": "0024",
      "ADRTYPE": "O",
      "FKOM": "0501",
      "FKOM-N": "LILLEHAMMER",
      "FKOM-R": "19990713",
      "FKOM-F": "19990701",
      "UTVT": {},
      "UTVT-N": {},
      "UTVT-R": {},
      "UTVT-F": {},
      "AARSADR": "24",
      "SPES-KD": "0",
      "SPES": "VANLIG BOSATT",
      "SKKR": "0005",
      "VAKR": "0010",
      "GRUNNKR": "0411",
      "MELD": {},
      "K-FAMNR": "22048612345",
      "FAMNR-D": "19980718",
      "PERSKODE": "1",
      "EKT-FODT": "050180",
      "EKT-PERS": "54321",
      "EKT-INR": "05018054321",
      "Barn": [
        {
          "BAR-FODT": "080907",
          "BAR-PERS": "98765",
          "BAR-INR": "08090798765",
          "BAR-KJO": "K"
        },
        {
          "BAR-FODT": "070603",
          "BAR-PERS": "56789",
          "BAR-INR": "07060356789",
          "BAR-KJO": "M"
        }
      ],
      "MOR-FODT": "030450",
      "MOR-PERS": "19285",
      "MOR-INR": "03045019285",
      "FAR-FODT": "020850",
      "FAR-PERS": "91825",
      "FAR-INR": "1928591825",
      "KJONN": "M",
      "FODKNR": "1201",
      "FODK": "BERGEN",
      "FODS": {}
    }
  }
}
```

## Related
- [node-dsf](https://github.com/telemark/node-dsf) Node.js module for looking up data from DSF (Det sentrale folkeregister)

## License
[MIT](LICENSE)