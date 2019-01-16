import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { upload } from './handlers';

const clientUrl = process.env.CLIENT_URL || 'http://52.56.137.29:3000';
const port = process.env.PORT || 6307;
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

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});