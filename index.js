const Koa = require('koa');
const views = require('koa-views');
const bodyParser = require('koa-bodyparser');
// const koaBody = require('koa-body')
const { koaBody } = require('koa-body');
const InitManager = require('./src/core/init');
const db = require('./src/models');

const config = require('./src/config');


const app = new Koa();

var cors = require('koa2-cors');

// context binding...
const context = require('./src/utils/context');
Object.keys(context).forEach(key => {
    app.context[key] = context[key] // 绑定上下文对象
})


app.use(cors());
// static
// app.use(require('koa-static')(__dirname + '/public'));

app.use(koaBody());

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


app.listen(config.PORT, () => {
    db.sequelize
        .sync({ force: false })
        .then(async () => {
            // const initData = require('./initData')
            // initData() // 创建初始化数据
            console.log('sequelize connect success')
            console.log(`sever listen on http://127.0.0.1:${config.PORT}`)
        })
        .catch(err => {
            console.log(err)
        })
});