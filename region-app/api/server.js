const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
server.db = router.db;

server.use(cors());
server.use(jsonServer.bodyParser);

// Alias confortables
server.use(jsonServer.rewriter({
  '/regions': '/الأقاليم',
  '/regions/:id': '/الأقاليم/:id'
}));

// Auth
server.use(auth);

// Routes
server.use(middlewares);
server.use(router);

const PORT = 3001;
server.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
