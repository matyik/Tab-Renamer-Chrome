const path = require('path');

module.exports = {
  mode: 'development', // or 'production' for final build
  entry: {
    background: path.resolve(__dirname, 'src/background.ts'),
    content_script: path.resolve(__dirname, 'src/content_script.ts')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                module: 'CommonJS'
              }
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'cheap-module-source-map' // Recommended for development
};
