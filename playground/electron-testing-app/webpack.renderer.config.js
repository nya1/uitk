const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");

const path = require("path");

const { ESBuildMinifyPlugin } = require("esbuild-loader");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

module.exports = {
  module: {
    rules,
  },
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: "es2015", // Syntax to compile to (see options below for possible values)
      }),
    ],
  },

  plugins: plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    alias: {
      "@jpmorganchase/uitk-lab": path.resolve(
        __dirname,
        "../../dist/jpmorganchase-uitk-lab/"
      ),
      "@jpmorganchase/uitk-core": path.resolve(
        __dirname,
        "../../dist/jpmorganchase-uitk-core/"
      ),
      "@jpmorganchase/uitk-theme": path.resolve(
        __dirname,
        "../../dist/jpmorganchase-uitk-theme/"
      ),
    },
  },
};
