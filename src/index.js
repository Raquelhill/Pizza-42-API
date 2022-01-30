var express = require('express');
var app = express();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

var port = process.env.PORT || 8000;

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-3m7cus37.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://pizza42-api',
  issuer: 'https://dev-3m7cus37.us.auth0.com/',
  algorithms: ['RS256'],
});

app.use(jwtCheck);

app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

app.listen(port);

const checkScopes = (permissions) => jwtAuthz(permissions);

app.get('/users', checkScopes(['read:users']), (req, res) => {
  res.json({ users: [{ id: 1 }, { id: 2 }] });
});

app.post('/user', checkScopes(['create:users']), (req, res) => {
  res.sendStatus(201);
});

app.delete('/user', checkScopes(['delete:users']), (req, res) => {
  res.sendStatus(200);
});
