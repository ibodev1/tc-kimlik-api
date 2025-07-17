import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { dogrulaSchema } from '../schemas/dogurla.schema';
import type { Respond } from '../types/respond';
import { callNVIService, getAge, NVIXMLRequestBody } from '../utils/helpers';

const dogrulaRouter = new Hono();

dogrulaRouter.get('/', (c) => {
  return c.json({
    web: 'https://ibrahimo.dev/',
    github: 'https://github.com/ibodev1',
    repo: 'https://github.com/ibodev1/tc-kimlik-api',
  });
});

dogrulaRouter.post(
  '/',
  validator('json', (value, c) => {
    const parsed = dogrulaSchema.safeParse(value);
    if (!parsed.success) {
      const errorResponse: Respond = {
        status: 'error',
        message: 'Validation failed',
        issues: parsed.error.issues,
      };
      return c.json(errorResponse, 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const validated = c.req.valid('json');
    const xmlBody = NVIXMLRequestBody(validated);
    const legalAge: boolean = getAge(validated.dogumTarihi) >= 18;
    const result = await callNVIService(xmlBody);

    const response: Respond = {
      status: 'success',
      result: result.isValid,
      legalAge: legalAge,
    };

    if (result.isValid) {
      response.message = 'TC Kimlik No doğrulaması başarılı.';
    } else {
      console.error('TC Kimlik No doğrulaması başarısız:', result.rawXml);
      response.message = 'TC Kimlik No doğrulaması başarısız.';
    }

    return c.json(response);
  },
);

export default dogrulaRouter;
