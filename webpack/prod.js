const common = require('./common.js')
const path = require('path')
const merge = require('webpack-merge')

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'app.min.js'
    }
})