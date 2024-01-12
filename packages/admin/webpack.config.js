const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')



module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '铁木真大屏展示',
            template: path.resolve(__dirname, './public/index.html'),
            filename: 'index.html',
        }),
        // new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            // JavaScript
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                        ],
                    },
                },
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader', // 将 CSS 通过 <style> 标签插入到 DOM 中
                    'css-loader', // 解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
                    'less-loader' // 将 LESS 文件编译为 CSS
                ]
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        // contentBase: path.join(__dirname, './dist'),
        // open: false,
        // hot: true,
        // // port: 8001,
        // inline: true,
    },
    resolve: {
        alias: {
            components: path.resolve(__dirname, 'src/components'),
            // 将 'utils' 别名指向 'src/utils' 目录
            utils: path.resolve(__dirname, 'src/utils'),
            // 可以添加更多的别名
            '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.js', '.jsx']
    }

}