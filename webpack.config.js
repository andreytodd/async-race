const path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    devtool: 'eval',
    entry: {
        main: ['./src/index.js', './src/styles.css']
    },
    output: {
        filename: 'main.[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'fonts'
                    }
                }],
              },
        ],
    },
    plugins: [
    new HtmlWebpackPlugin({
        template: './src/template.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
        filename: '[name].css',
      })
    ],
};
