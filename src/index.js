const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// orders "database". In-memory only, will delete if server stops.
const ordersDB = {};

// defining the Express app
const app = express();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-3m7cus37.us.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: 'https://pizza42-api',
  issuer: `https://dev-3m7cus37.us.auth0.com/`,
  algorithms: ['RS256'],
});

app.use(checkJwt);

app.get('/orders', async (req, res) => {
  console.log('** REQUEST **', req);
  //look at log once hosted on heroku, and find out the unique userID.  Then replace req.user.id with the actual user ID.
  // const orders = ordersDB[req.user.id];
  // res.send(orders);
});

// app.post('/orders', async (req, res) => {
//   const newOrder = req.body;
//   const userId = req.user.id;
//   const orders = ordersDB[userId];
//   if (!orders) {
//     ordersDB[userId] = [newOrder];
//   } else {
//     orders.push(newOrder);
//   }
//   res.send({ message: 'New order placed!' });
// });

app.listen(3001, () => {
  console.log('listening on port 3001');
});
