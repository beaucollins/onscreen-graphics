import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    graphics: './src/App.tsx',
    submit: './src/Submit.tsx',
  },
  output: {
    path: resolve(__dirname, './dist/public'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /\/node_modules\//,
        loader: 'swc-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Graphics',
      chunks: ['graphics'],
      filename: 'graphics/index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'Submit Title',
      chunks: ['submit'],
    }),
  ],
};

export default config;
