const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/client/index.ts',
  devServer: {
    port: 9000,
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
