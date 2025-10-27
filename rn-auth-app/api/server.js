// api/server.js
const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('db.json'); // db.json doit exister à côté de server.js
server.db = router.db;

// ⚠️ L'ordre des middlewares est important
server.use(cors());
server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

// Droits d'accès (exemple)
const rules = auth.rewriter({
  users: 600,   // l'utilisateur ne voit que lui-même
  products: 644 // lecture publique, écriture protégée
});
server.use(rules);

// Active /register et /login → renvoie { accessToken, user }
server.use(auth);

// Routes CRUD
server.use(router);

// Lancer
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`);
});
