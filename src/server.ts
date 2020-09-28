import config from '../webpack.config';
import webpack from 'webpack';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import ws from 'ws';
import morgan from 'morgan';

const server = express()
  .use(morgan('common'))
  .use(webpackDevMiddleware(webpack(config)))
  .listen(3000);

const sockets = new ws.Server({ server });

const listeners: Set<ws> = new Set();

sockets.on('connection', (socket) => {
  console.log('connected');
  listeners.add(socket);

  socket.on('close', () => listeners.delete(socket));

  socket.on('message', (message) => {
    try {
      if (typeof message === 'string') {
        // const value = JSON.parse(message);
        // console.log('received', value);
        for (const listener of listeners) {
          listener.send(message);
        }
      } else {
        throw new Error('not understood');
      }
    } catch (error) {
      console.error('not understood', error);
    }
    console.log('message', message);
  });
});
