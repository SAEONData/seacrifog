const HtmlWebPackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const path = require('path')
require('dotenv').config()

const resolveConfig = mode =>
  mode === 'production'
    ? {
        extensions: ['.js', '.jsx']
      }
    : {
        extensions: ['.js', '.jsx'],
        symlinks: true,
        alias: {
          react: path.resolve('./node_modules/react'),
          'react-dom': path.resolve('./node_modules/react-dom')
        }
      }

module.exports = ({ mode }) => ({
  mode,
  entry: './src/index.jsx',
  output: {
    publicPath: '/',
    filename: 'index.js'
  },
  resolve: resolveConfig(mode),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.*css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',
              name: '[name][md5:hash].[ext]',
              outputPath: 'assets/',
              publicPath: '/assets/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new HtmlWebPackPlugin({
      template: './index.html',
      PUBLIC_PATH: ''
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3001,
    historyApiFallback: true,
    compress: true,
    allowedHosts: ['.localhost'],
    headers: {
      'Access-Control-Allow-Headers': '*'
    }
  }
})
