const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config.js');
const compiler = webpack(webpackConfig);
const fs = require('fs');
const path = require('path');
const parentDir = path.resolve(__dirname, '..');

const app = express();


console.log(path.join(parentDir, "dist") + '/index.html', "=4545");
app.use(
    webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
    })
);
app.use(express.static(path.join(parentDir, 'dist')));
app.get('*', (req, res) => {
    fs.readFile(path.join(parentDir, "dist") + '/index.html', (err, file) => {
        if (err) {
            res.sendStatus(404);
        } else {
            res.send(file.toString());
        }
    });
});
// Serve the files on port 3000.
app.listen(8000, function () {
    console.log('Example app listening on port 8000!\n');
});


