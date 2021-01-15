const express = require('express');
const cors = require('cors');

const logger = require('morgan');
const root = require('./routes/index');

const port = process.env.PORT || 8080;
const app = express();

const { CLIENT_URL } = process.env;

app.use(logger('dev'));
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/', root);

app.listen(port, (err) => {
  if (err) {
    throw new Error(err);
  } else {
    // eslint-disable-next-line
    console.log(`server listening on port: ${port}`);
  }
});
