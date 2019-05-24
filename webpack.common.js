const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

if (process.env.NODE_ENV === "production") {
}

if (process.env.NODE_ENV === "development") {
}

const config = {
    entry: {
        background: path.resolve(__dirname, "src/_backgrounds/index.js"),
        content_script: path.resolve(__dirname, "src/_content_scripts/index.js")
    },
    output: {
        path: path.resolve(__dirname, "disc/assets/js"),
        publicPath: "assets/",
        filename: "[name].js",
        crossOriginLoading: "anonymous"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".js", ".scss", ".css"],
        alias: {
            "@src": path.resolve(__dirname, "src")
        }
    },
    devtool: "cheap-source-map",
    target: "web",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                include: [path.resolve(__dirname, "src")],
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["env"]
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: function() {
                                    return [require("autoprefixer")];
                                }
                            }
                        },
                        {
                            loader: "resolve-url-loader"
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(png|jpg|jpeg|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 204800, // 200KB
                            fallback: "file-loader"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin("disc"),
        new ExtractTextPlugin({
            filename: "../css/[name].css"
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "resources/"),
                to: path.resolve(__dirname, "disc/")
            }
        ])
    ]
};

module.exports = config;
