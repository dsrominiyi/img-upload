import fs from 'fs';
import http from 'http';
import https from 'https';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { upload } from './handlers';

const clientUrl = process.env.LA_CLIENT_URL || 'http://localhost';
const httpPort = process.env.LA_PORT_HTTP || 6307;
const httpsPort = process.env.LA_PORT_HTTPS || 6308;
const app = express();

process.on('uncaughtException', err => {
  console.log(`Uncaught exception!! : ${err.stack}`);
  process.exit(1);
});

app.use(cors({ origin: clientUrl }));
app.use(bodyParser.json());
app.use(fileUpload());

app.options('*', cors());

app.use((req, res, next) => {
  console.log(`request: ${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

app.post('/upload', upload);

// HTTP
const httpServer = http.createServer(app);
httpServer.listen(httpPort, () => console.log(`App listening on http port ${httpPort}`));

// HTTPS
if (fs.existsSync('/opt/bitnami/apache2/conf', fs.R_OK)) {
  const privateKey = fs.readFileSync('/opt/bitnami/apache2/conf/server.key', 'utf8');
  const certificate = fs.readFileSync('/opt/bitnami/apache2/conf/server.crt', 'utf8');

  const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);
  httpsServer.listen(httpsPort, () => console.log(`App listening on https port ${httpsPort}`));
}

// NB: app ran using sudo forever server.js so sudo is needed before all forever commands to see the pid
