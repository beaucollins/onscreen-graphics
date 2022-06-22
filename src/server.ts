import config from '../webpack.config';
import webpack from 'webpack';
import express, { static as serveStatic } from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import ws from 'ws';
import morgan from 'morgan';
import { json } from 'body-parser';
import { resolve } from 'path';

const listeners: Set<ws> = new Set();

const notify = (title: string) => {
  for (const listener of listeners) {
    listener.send(title);
  }
};

let app = express().use(morgan('combined'));

const env = process.env.NODE_ENV ?? 'development';
const publicDir = resolve(__dirname, '../dist/public');

process.stderr.write(
  'Running in NODE_ENV ' + env + ' serving from ' + publicDir + '\n'
);

app =
  env === 'development' ? app.use(webpackDevMiddleware(webpack(config))) : app;

app = env === 'production' ? app.use(serveStatic(publicDir)) : app;

const server = app
  .post('/', json(), (req, res) => {
    notify(req.body.title);
    res.status(200).json({ updated: req.body.title });
  })
  .listen(3000);

const sockets = new ws.Server({ server });

sockets.on('connection', (socket) => {
  console.log('connected');
  listeners.add(socket);

  socket.on('close', () => listeners.delete(socket));

  socket.on('message', (message) => {
    try {
      if (typeof message === 'string') {
        notify(message);
      } else {
        throw new Error('not understood');
      }
    } catch (error) {
      console.error('not understood', error);
    }
    console.log('message', message);
  });
});
