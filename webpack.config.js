
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


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
            cache: true,
            parallel: true,
            uglifyOptions: {
                compress: true
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};

