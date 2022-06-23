import type { Express } from 'express';

export default (app: Express): Promise<Express> => {
  return Promise.all([
    import('webpack'),
    import('webpack-dev-middleware'),
    import('../webpack.config'),
  ]).then(
    ([webpack, dev, config]) => {
      return app.use(dev.default(webpack.default(config.default)));
    },
    (error: Error) => {
      process.stderr.write(
        `⚠️ Failed to load dev middleware: ${error.message}\n`
      );
      return app;
    }
  );
};
