import app from './server.js';

app.listen(app.get('port'), () => {
  console.log('Server started. Go to http://localhost:' + app.get('port'));
});
