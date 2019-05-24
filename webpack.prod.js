const merge = require("webpack-merge");
const common = require("./webpack.common");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const conf = {
    mode: "production",
    devtool: false,
    plugins: [
        new UglifyJSPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                    drop_console: true,
                    drop_debugger: true
                },
                comments: false
            }
        })
    ]
};
module.exports = merge(common, conf);
