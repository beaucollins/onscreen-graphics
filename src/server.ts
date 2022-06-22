import config from '../webpack.config';
import webpack from 'webpack';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import ws from 'ws';
import morgan from 'morgan';
import { json } from 'body-parser';

const listeners: Set<ws> = new Set();

const notify = (title: string) => {
  for (const listener of listeners) {
    listener.send(title);
  }
};

const server = express()
  .use(morgan('combined'))
  .use(webpackDevMiddleware(webpack(config)))
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
