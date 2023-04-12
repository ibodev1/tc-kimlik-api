import express, { Request, Response } from 'express';
import fetch, { type RequestInit } from 'node-fetch';
import { Headers } from 'node-fetch';
import { parseString } from 'xml2js';
import * as z from 'zod';

const dogrulaRouter = express.Router();

const getAge = (dateString: string): number => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
const requestBody = z.object({
  tc: z
    .string()
    .min(11, 'Tc kimlik 11 karakterden oluşmalıdır.')
    .max(11, 'Tc kimlik 11 karakterden oluşmalıdır.')
    .regex(/^[0-9]*$/, 'Tc kimlik sadece rakamlar içermelidir.')
    .nonempty('Boş bırakmayın.'),
  ad: z
    .string()
    .min(2, 'Minimum 2 karakter.')
    .max(50, 'Maksimum 50 karakter.')
    .nonempty('Boş bırakmayın.'),
  soyad: z
    .string()
    .min(2, 'Minimum 2 karakter.')
    .max(50, 'Maksimum 50 karakter.')
    .nonempty('Boş bırakmayın.'),
  dogumTarihi: z
    .string()
    .min(10, 'Minimum 10 karakter.')
    .max(10, 'Maksimum 10 karakter.')
    .regex(
      /[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/,
      'Lütfen istenilen biçimde doğum tarihini girin.'
    )
    .nonempty('Boş bırakmayın.')
});

dogrulaRouter.post('/dogrula', async (request: Request, response: Response) => {
  try {
    const body = requestBody.parse(request.body);
    const year = new Date(body.dogumTarihi).getFullYear();
    const legalAge: boolean = getAge(body.dogumTarihi) >= 18;
    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <TCKimlikNoDogrula xmlns="http://tckimlik.nvi.gov.tr/WS">
      <TCKimlikNo>${body.tc}</TCKimlikNo>
      <Ad>${body.ad}</Ad>
      <Soyad>${body.soyad}</Soyad>
      <DogumYili>${year}</DogumYili>
    </TCKimlikNoDogrula>
  </soap:Body>
</soap:Envelope>`;

    const fetchUrl = new URL(
      'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?op=TCKimlikNoDogrula'
    );

    const headers = new Headers();
    headers.set('Content-Type', 'text/xml; charset=utf-8');
    headers.set('Content-Length', Buffer.byteLength(xmlBody).toString());
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: headers,
      body: xmlBody
    };

    const fetchResponse = await fetch(fetchUrl, fetchOptions);
    const xmlResponse = await fetchResponse.text();
    return parseString(xmlResponse, (err, result) => {
      if (err) {
        response.statusCode = 500;
        return response.json({
          status: 'error',
          details: 'Xml ayrıştırması yapılamadı.'
        });
      }

      const TCKimlikNoDogrulaResult =
        result['soap:Envelope']['soap:Body'][0]['TCKimlikNoDogrulaResponse'][0][
          'TCKimlikNoDogrulaResult'
        ][0];
      return response.json({
        status: 'success',
        result: TCKimlikNoDogrulaResult === 'true',
        legalAge
      });
    });
  } catch (error: any) {
    response.statusCode = 500;
    if (error?.name === 'ZodError') {
      return response.json({
        status: 'error',
        details: error?.issues
      });
    } else {
      return response.json({
        status: 'error',
        details: error
      });
    }
  }
});

export default dogrulaRouter;
