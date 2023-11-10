const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: ["./src/main.ts", "./src/sass/render.scss"],
    mode: "development",
    //watch: true,
    //devtool: "hidden-cheap-module-source-map",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            /*{
                test: /\.(eot|woff|woff2|ttf)(\?\S*)?$/,
                loader: "file-loader",
                options: {name: "[name].[ext]", outputPath: "fonts/",}
            },*/
            {
                test: /\.(svg|png|jpe?g|gif)$/i,
                loader: "file-loader",
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                include: [path.resolve(__dirname, "src/sass")],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[id].css",
        }),
        /*new HtmlWebpackPlugin({
            template: "src/html/index.html"
        })*/
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".scss"],
    },
    output: {
        filename: "js/bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
};
