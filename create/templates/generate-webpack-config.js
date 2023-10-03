const indent = require('../utils/indent');
const templateIf = require('../utils/template-if');

module.exports = (options) => {
  const { framework, type, webpack } = options;

  let resolveExtensions = "['.js', '.json']";
  if (framework === 'vue') {
    resolveExtensions = "['.js', '.vue', '.json']";
  }
  if (framework === 'react') {
    resolveExtensions = "['.js', '.jsx', '.json']";
  }
  if (framework === 'svelte') {
    resolveExtensions = "['.mjs', '.js', '.svelte', '.json']";
  }

  const productionDevtool = webpack.productionSourceMap
    ? "'source-map'"
    : false;
  const developmentDevtool = webpack.developmentSourceMap ? "'eval'" : false;
  const hashName = webpack.hashAssets ? '.[hash:6]' : '';
  const assetsLoader = webpack.inlineAssets ? 'url-loader' : 'file-loader';
  const preserveAssetsPaths = webpack.preserveAssetsPaths; // eslint-disable-line

  return indent(
    0,
    `
    const webpack = require('webpack');
    const CopyWebpackPlugin = require('copy-webpack-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    ${templateIf(
      framework === 'vue',
      () => `
    const { VueLoaderPlugin } = require('vue-loader');
    `
    )}
    ${templateIf(
      framework === 'react',
      () => `
    const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
    `
    )}
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
    const TerserPlugin = require('terser-webpack-plugin');
    ${templateIf(
      type.indexOf('pwa') >= 0,
      () => `
    const WorkboxPlugin = require('workbox-webpack-plugin');
    `
    )}
    const path = require('path');

    function resolvePath(dir) {
      return path.join(__dirname, '..', dir);
    }

    const env = process.env.NODE_ENV || 'development';
    const target = process.env.TARGET || 'web';

    module.exports = {
      mode: env,
      target: env === "development" ? "web" : "browserslist",
      entry: {
        app: './src/js/app.js',
      },
      output: {
        path: resolvePath('www'),
        filename: 'js/[name]${hashName}.js',
        chunkFilename: 'js/[name]${hashName}.js',
        publicPath: '',
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json',
      },
      resolve: {
        extensions: ${resolveExtensions},
        alias: {
          '@': resolvePath('src'),
        },
        ${templateIf(
          framework === 'svelte',
          () => `
        mainFields: ['svelte', 'browser', 'module', 'main']
        `
        )}
      },
      devtool: env === 'production' ? ${productionDevtool} : ${developmentDevtool},
      devServer: {
        hot: true,
        open: true,
        compress: true,
        contentBase: '/www/',
        disableHostCheck: true,
        historyApiFallback: true,
      },
      optimization: {
        concatenateModules: true,
        minimizer: [new TerserPlugin()],
      },
      module: {
        rules: [
          {
            test: /\\.(mjs|js|jsx)$/,
            include: [
              resolvePath('src'),
              ${templateIf(
                framework === 'svelte',
                () => `
              resolvePath('node_modules/svelte'),
              `
              )}
            ],
            use: [
              {
                loader: require.resolve('babel-loader'),
                ${templateIf(
                  framework === 'react',
                  () => `
                options: env === 'development' ? {
                  plugins: [
                    require.resolve('react-refresh/babel'),
                  ]
                } : {}
                `
                )}
              },
            ]
          },
          ${templateIf(
            framework === 'core',
            () => `
          {
            test: /\\.zmp.(html|js)$/,
            use: [
              'babel-loader',
              'zmp-loader',
            ],
          },
          `
          )}
          ${templateIf(
            framework === 'svelte',
            () => `
          {
            test: /\\.svelte$/,
            use: {
              loader: 'svelte-loader',
              options: {
                emitCss: true,
              },
            },
          },
          `
          )}
          ${templateIf(
            framework === 'vue',
            () => `
          {
            test: /\\.vue$/,
            use: 'vue-loader',
          },
          `
          )}
          {
            test: /\\.css$/,
            use: [
              (env === 'development' ? 'style-loader' : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../'
                }
              }),
              'css-loader',
              'postcss-loader',
            ],
          },
          {
            test: /\\.styl(us)?$/,
            use: [
              (env === 'development' ? 'style-loader' : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../'
                }
              }),
              'css-loader',
              'postcss-loader',
              'stylus-loader',
            ],
          },
          {
            test: /\\.less$/,
            use: [
              (env === 'development' ? 'style-loader' : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../'
                }
              }),
              'css-loader',
              'postcss-loader',
              'less-loader',
            ],
          },
          {
            test: /\\.(sa|sc)ss$/,
            use: [
              (env === 'development' ? 'style-loader' : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../'
                }
              }),
              'css-loader',
              'postcss-loader',
              'sass-loader',
            ],
          },
          {
            test: /\\.(png|jpe?g|gif|svg)(\\?.*)?$/,
            loader: '${assetsLoader}',
            options: {
              limit: 10000,
              name: '${
                preserveAssetsPaths ? '[path]' : 'images/'
              }[name]${hashName}.[ext]',
              ${templateIf(
                preserveAssetsPaths,
                () => `
              context: path.resolve(__dirname, '../src'),
              `
              )}
            },
            type: 'javascript/auto'
          },
          {
            test: /\\.(mp4|webm|ogg|mp3|wav|flac|aac|m4a)(\\?.*)?$/,
            loader: '${assetsLoader}',
            options: {
              limit: 10000,
              name: '${
                preserveAssetsPaths ? '[path]' : 'media/'
              }[name]${hashName}.[ext]',
              ${templateIf(
                preserveAssetsPaths,
                () => `
              context: path.resolve(__dirname, '../src'),
              `
              )}
            },
            type: 'javascript/auto'
          },
          {
            test: /\\.(woff2?|eot|ttf|otf)(\\?.*)?$/,
            loader: '${assetsLoader}',
            options: {
              limit: 10000,
              name: '${
                preserveAssetsPaths ? '[path]' : 'fonts/'
              }[name]${hashName}.[ext]',
              ${templateIf(
                preserveAssetsPaths,
                () => `
              context: path.resolve(__dirname, '../src'),
              `
              )}
            },
            type: 'javascript/auto'
          },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(env),
          'process.env.TARGET': JSON.stringify(target),
        }),
        ${templateIf(
          framework === 'vue',
          () => `
        new VueLoaderPlugin(),
        `
        )}
        ...(env === 'production' ? [
          new CssMinimizerPlugin(),
        ] : [
          // Development only plugins
          new webpack.HotModuleReplacementPlugin(),
          ${templateIf(
            framework === 'react',
            () => 'new ReactRefreshWebpackPlugin(),'
          )}
        ]),
        new HtmlWebpackPlugin({
          filename: './index.html',
          template: './src/index.html',
          inject: true,
          minify: env === 'production' ? {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: ${
              framework === 'core' ? 'false' : 'true'
            },
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
          } : false,
        }),
        new MiniCssExtractPlugin({
          filename: 'css/[name]${hashName}.css',
        }),
        new CopyWebpackPlugin({
          patterns: [
            {
              noErrorOnMissing: true,
              from: resolvePath('src/static'),
              to: resolvePath('www/static'),
            },
            ${templateIf(
              type.indexOf('pwa') >= 0,
              () => `
            {
              noErrorOnMissing: true,
              from: resolvePath('src/manifest.json'),
              to: resolvePath('www/manifest.json'),
            },
            `
            )}
          ],
        }),
      ],
    };
  `
  ).trim();
};
