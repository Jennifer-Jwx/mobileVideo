var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var px2rem = require('postcss-px2rem');

// 辅助函数
var utils = require("./utils");
var fullPath = utils.fullPath;
var pickFiles = utils.pickFiles;

// 项目根路径
var ROOT_PATH = fullPath("../");
// 项目源码路径
var SRC_PATH = ROOT_PATH + "/src";
// 产出路径
var DIST_PATH = ROOT_PATH + "/dist";

// conf
var alias = pickFiles({
    id: /(conf\/[^\/]+).js$/,
    pattern: SRC_PATH + "/conf/*.js"
});

// components
alias = Object.assign(alias, pickFiles({
    id: /(components\/[^\/]+)/,
    pattern: SRC_PATH + "/components/*/index.js"
}));

// reducers
alias = Object.assign(alias, pickFiles({
    id: /(reducers\/[^\/]+).js/,
    pattern: SRC_PATH + "/js/reducers/*"
}));

// actions
alias = Object.assign(alias, pickFiles({
    id: /(actions\/[^\/]+).js/,
    pattern: SRC_PATH + "/js/actions/*"
}));


module.exports = {
    context: SRC_PATH,
    entry: {
        app: [SRC_PATH + '/app.js'],
        lib: [
            "react", "react-dom", "react-router",
            "redux", "react-redux", "redux-thunk"
        ]
    },
    output: {
        path: DIST_PATH,
        filename: 'js/bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            include: SRC_PATH,
            loaders: ['babel-loader', 'jsx-loader']
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader' })
        }]
    },

    resolve: {
        alias: alias
    },
    node: {
        fs: 'empty'
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer({ browsers: ['> 0%'] }),
                    px2rem({ remUnit: 75 })
                ]
            }
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
        }),
        new HtmlwebpackPlugin({
            filename: "index.html",
            chunks: ["app", "lib"],
            template: SRC_PATH + "/app.html",
            minify: {
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                removeRedundantAttributes: true,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeComments: true
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'lib', filename: 'js/lib.js' }),
        new ExtractTextPlugin('css/[name].css'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};