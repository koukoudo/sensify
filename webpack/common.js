const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

require('dotenv').config()

module.exports = {
    entry: [
        'regenerator-runtime',
        './src/index.js'
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }, 
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader'
            }, 
            {
                test: /\.(obj|mtl|bin|mp4)$/,
                loader: 'url-loader'
            },
            {
                test: /\.(gltf)$/,
                loader: 'gltf-webpack-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            PROJECT_ROOT: JSON.stringify(process.env.PROJECT_ROOT)
        })
    ],
    resolve: {
        modules: [
            'node_modules',
            'src'
        ],
        extensions: ['.js']
    }
}
