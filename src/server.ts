import express, { static as serveStatic } from 'express';
import morgan from 'morgan';
import { resolve } from 'path';
import { api } from './api';
import dev from './dev';

const main = async (): Promise<void> => {
  let app = express().use(morgan('combined'));

  const env = process.env.NODE_ENV ?? 'development';
  const publicDir = resolve(__dirname, '../dist/public');

  process.stderr.write(
    'Running in NODE_ENV ' + env + ' serving from ' + publicDir + '\n'
  );

  app = env === 'development' ? await dev(app) : app;

  app = env === 'production' ? app.use(serveStatic(publicDir)) : app;

  const [apiMiddleware, setupSocketServer] = api();

  const server = app.use(apiMiddleware).listen(3000);

  setupSocketServer(server);
};

main().catch((error: Error) => {
  process.stderr.write(`⛔️ ${error.message}\n`);
  process.exit(1);
});
