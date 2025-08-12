import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { DogrulaType } from '../schemas/dogurla.schema.ts';
import type { NVIResponseParsed, NVIServiceResult } from '../types/nvi.ts';
import { NVI_SERVICE_URL } from './constants.ts';

export const getAge = (dateString: string): number => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const NVIXMLRequestBody = (body: DogrulaType): string => {
  const year = new Date(body.dogumTarihi).getFullYear();
  const xmlObj = {
    'soap:Envelope': {
      '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
      '@_xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'soap:Body': {
        TCKimlikNoDogrula: {
          '@_xmlns': 'http://tckimlik.nvi.gov.tr/WS',
          TCKimlikNo: body.tc,
          Ad: body.ad,
          Soyad: body.soyad,
          DogumYili: year,
        },
      },
    },
  };

  const xmlBuilder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
    attributeNamePrefix: '@_',
    processEntities: false,
  });

  const xml = xmlBuilder.build(xmlObj);

  return `<?xml version="1.0" encoding="utf-8"?>\n${xml}`;
};

export const callNVIService = async (xmlBody: string): Promise<NVIServiceResult> => {
  try {
    const headers = new Headers();
    headers.set('Content-Type', 'text/xml; charset=utf-8');
    const contentLength = new TextEncoder().encode(xmlBody).length.toString();
    headers.set('Content-Length', contentLength);
    // headers.set('SOAPAction', NVI_SOAP_ACTION);

    const serviceRequest = new Request(NVI_SERVICE_URL, {
      method: 'POST',
      headers: headers,
      body: xmlBody,
    });

    const fetchResponse = await fetch(serviceRequest);

    if (!fetchResponse.ok) {
      throw new HTTPException(fetchResponse.status as ContentfulStatusCode, {
        message: `HTTP error! Status: ${fetchResponse.status}`,
        cause: fetchResponse.statusText,
      });
    }

    const xmlResponse = await fetchResponse.text();

    const xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      processEntities: false,
      parseAttributeValue: true,
      trimValues: true,
      allowBooleanAttributes: true,
    });

    const parsedResponse = xmlParser.parse(xmlResponse) as NVIResponseParsed;

    const isValid = parsedResponse?.['soap:Envelope']?.['soap:Body']?.TCKimlikNoDogrulaResponse?.TCKimlikNoDogrulaResult;

    return {
      rawXml: xmlResponse,
      parsed: parsedResponse,
      isValid: typeof isValid === 'boolean' ? isValid : false,
    };
  } catch (error) {
    console.error('Error calling NVI service:', error);
    throw error;
  }
};
