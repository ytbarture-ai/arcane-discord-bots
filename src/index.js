import 'dotenv/config';
import { createBot } from './bot.js';
import { configuredBots, STORE_PATH } from './config.js';
import { JsonStore } from './store.js';
import http from 'node:http';

const bots = configuredBots();
if (!bots.length) {
  console.error('Aucun token trouvé. Définissez au minimum ARCANE_TOKEN ou ARCANE_CHAN_TOKEN.');
  process.exit(1);
}

const store = new JsonStore(STORE_PATH);
await store.init();
console.log(`Stockage initialisé : ${STORE_PATH}`);

const clients = bots.map((bot) => ({ bot, client: createBot(bot, store) }));
for (const { bot, client } of clients) {
  client.login(bot.token).catch((error) => {
    console.error(`[${bot.displayName}] connexion impossible : ${error.message}`);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Serveur HTTP de health check démarré sur le port ${port}`);
});

async function stop(signal) {
  console.log(`Signal ${signal} reçu, arrêt des bots…`);
  await store.save().catch(() => {});
  for (const { client } of clients) client.destroy();
  process.exit(0);
}

process.once('SIGINT', () => stop('SIGINT'));
process.once('SIGTERM', () => stop('SIGTERM'));
