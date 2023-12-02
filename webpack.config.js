const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    module: {
      rules: [{
          test:  [/\.js$/, /\.jsx$/, /\.es6$/],
          include: [
            path.resolve(__dirname, 'src'),
          ],
          use: {
            loader: "babel-loader"
          },
        }, {
          test: [/\.css/],
          exclude: path.resolve(__dirname, 'src/'),
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                  modules: true,
                  localIdentName: '[name]__[local]-[hash:base64:5]'
              }
            }
          ]
       }, {
         test: [/\.css/],
         include: path.resolve(__dirname, 'src/'),
         use: [
           'style-loader',
           'css-loader'
         ]
       }]
    },
  }, argv);
  // Customize the config before returning it.

  return config;
};
