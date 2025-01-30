const path = require('path');

module.exports = {
  target: 'node',
  mode: 'none',

  entry: {
    'extension': './src/extension.ts',
    'webview/scripts/scripts': './src/webview/scripts/scripts.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode'
  },
  resolve: {
    extensions: ['.ts', '.js', '.css']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'raw-loader'
        ]
      }
    ]
  },
  devtool: 'nosources-source-map'
}; 