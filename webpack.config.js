const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");


module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        overlay: {
            warnings: true,
            errors: true
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'bla'
        }),
        new UglifyJsPlugin({
            test: /\.js($|\?)/i,
            exclude: /(node_modules|bower_components)/,
            parallel: true,
            uglifyOptions: {
                compress: true,
                ecma: 6
            }
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ],
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            /* {
                       test: /\.js$/,
                       exclude: /(node_modules|bower_components)/,
                       use: {
                           loader: 'babel-loader',
                           options: {
                               presets: ['@babel/preset-env']
                           }
                       }
                   }, */
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
};