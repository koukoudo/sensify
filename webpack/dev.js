const common = require('./common.js')
const path = require('path')
const merge = require('webpack-merge')

require('dotenv').config()

module.exports = merge(common, {
        mode: 'development',
        output: {
            path: path.resolve(__dirname, '../serve'),
            filename: 'bundle.js'
        },
        devtool: 'inline-source-map',
        devServer: {
            contentBase: path.resolve(__dirname, '../serve'),
            port: process.env.CLIENT_PORT || 8080,
            open: true
        }
    })