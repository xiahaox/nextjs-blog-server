const Koa = require('koa');
const views = require('koa-views');
const bodyParser = require('koa-bodyparser');
const InitManager = require('./src/core/init')
const PORT = process.env.PORT || 4000;
const app = new Koa();

var cors = require('koa2-cors');

app.use(cors());
// static
// app.use(require('koa-static')(__dirname + '/public'));

// bodyParser
app.use(
    bodyParser({
        enableTypes: ['json', 'form', 'text'],
    })
);
// ejs
app.use(
    views(__dirname + '/src/views', {
        extension: 'ejs',
    })
);
// app.use(ctx => {
//     ctx.body = 'Hello Koa'
// })
// init
InitManager.initCore(app)


app.listen(PORT, () => {
    console.log(`Koa is runing in localhost:${PORT}`);
});