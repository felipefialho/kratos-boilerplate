const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OfflinePlugin = require('offline-plugin');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const config = require('./app.config.json');

const webapp = {
  name: config.title,
  short_name: config.short_name,
  description: config.description,
  background_color: config.theme_color,
  theme_color: config.theme_color,
  orientation: 'landscape',
  icons: [
    {
      src: path.resolve('./src/images/logo.png'),
      sizes: [96, 128, 192, 256, 384, 512]
    }
  ]
};

const copyFiles = {
  patterns: [
    { from: './src/images/', to: './images' },
    { from: './src/favicon.ico', to: './' },
  ],
};

const sw = {
  safeToUseOptionalCaches: true,
  caches: {
    main: ['index.html'],
    additional: ['*.js?*']
  },
  navigateFallbackURL: '/',
  autoUpdate: true,
  responseStrategy: 'cache-first',
  ServiceWorker: { events: true },
  AppCache: { events: true }
};

const baseWebpack = {
  entry: {
    app: './src/app.js'
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.pug/,
        loader: 'pug-loader',
      },
      {
        test: /\.scss/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader',
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
        use: 'file-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.WEBPACK_MODE': JSON.stringify(process.env.WEBPACK_MODE)
    }),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['dist']
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.pug'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
    new CopyWebpackPlugin(copyFiles)
  ]
};

const prodStart = () => {
  baseWebpack.optimization = {
    minimizer: [new UglifyJsPlugin()],
  };
  baseWebpack.plugins.push(new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }));
  baseWebpack.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'disabled' }));
  baseWebpack.plugins.push(new WebpackPwaManifest(webapp));
  baseWebpack.plugins.push(new OfflinePlugin(sw));
};

const devStart = () => {
  baseWebpack.devServer = {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    open: true,
    port: 9000
  };
};

module.exports = (env, options) => {
  if (options.mode === 'production') {
    prodStart();
  }

  if (options.mode === 'development') {
    devStart();
  }

  return baseWebpack;
};

