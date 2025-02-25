const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // or 'production' for final build
  entry: {
    background: path.resolve(__dirname, 'src/background.ts'),
    content_script: path.resolve(__dirname, 'src/content_script.ts'),
    popup: path.resolve(__dirname, 'src/popup.ts'),
    shortcuts: path.resolve(__dirname, 'src/shortcuts.ts'),
    actions: path.resolve(__dirname, 'src/actions.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true, // Cleans the dist folder before each build
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
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      chunks: ['popup'],
    }),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: 'manifest.json',
    //       to: 'manifest.json',
    //     },
    //     {
    //       from: 'images',
    //       to: 'images',
    //     },
    //   ],
    // }),
  ],
  devtool: 'cheap-module-source-map', // Recommended for development
  stats: {
    children: true, // This will show child compilation errors
  },
};
