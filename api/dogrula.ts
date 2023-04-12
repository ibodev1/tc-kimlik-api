import app from '../server.js';
import dogrulaRouter from '../routes/dogrula.js';

app.use('/api/', dogrulaRouter);

export { default } from '../server.js';
