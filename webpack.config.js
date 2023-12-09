const path = require("path");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      module: {
        rules: [
          {
            test: [/\.js$/, /\.jsx$/, /\.es6$/, /\.svg$/],
            include: [path.resolve(__dirname)],
            use: {
              loader: "babel-loader",
            },
          },
          {
            test: [/\.css/],
            exclude: path.resolve(__dirname),
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: true,
                  localIdentName: "[name]__[local]-[hash:base64:5]",
                },
              },
            ],
          },
          {
            test: [/\.css/],
            include: path.resolve(__dirname),
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.ts$/,
            use: "ts-loader",
          },
        ],
      },
    },
    argv
  );
  // Customize the config before returning it.

  // If you want to add a new alias to the config.
  config.resolve.alias["@Assets"] = "appAssets";

  return config;
};
