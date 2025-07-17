export interface NVIResponseParsed {
  'soap:Envelope': {
    'soap:Body': {
      TCKimlikNoDogrulaResponse: {
        '@_xmlns': string;
        TCKimlikNoDogrulaResult: boolean;
      };
    };
  };
}

export interface NVIServiceResult {
  rawXml: string;
  parsed: NVIResponseParsed;
  isValid?: boolean;
}
