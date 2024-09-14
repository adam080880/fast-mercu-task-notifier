import express from 'express';
import 'module-alias/register';
import 'dotenv/config';

import mainRoute from './src/routes/main';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(mainRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at port ${port}`);
});
