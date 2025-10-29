const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.db = router.db; // requis par json-server-auth

server.use(cors());
server.use(jsonServer.bodyParser);

// Auth (POST /register, POST /login)
server.use(auth);

// Routes REST
server.use(middlewares);
server.use(router);

const PORT = 7000;
server.listen(PORT, () => {
  console.log(`✅ API démarrée: http://localhost:${PORT}`);
});
