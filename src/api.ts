import ws from 'ws';
import express, { Express } from 'express';
import type { Server } from 'http';
import { json } from 'body-parser';

export function api(): [Express, (server: Server) => void] {
  const listeners: Set<ws> = new Set();

  const notify = (title: string) => {
    for (const listener of listeners) {
      listener.send(title);
    }
  };

  return [
    express().post('/', json(), (req, res) => {
      notify(req.body.title);
      res.status(200).json({ updated: req.body.title });
    }),
    (server: Server) => {
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
    },
  ];
}
