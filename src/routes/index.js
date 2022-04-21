const router = require('koa-router')();
// const assert = require('assert');

router.get('/', async (ctx, next) => {
    //const views = require('koa-views');之后有了render方法
    await ctx.render('index', {
        title: 'Hello Koa 2!',
        baseUrl: process.env.KOA_APP_BASE_URL || '--',
        runEnv: process.env.KOA_APP_RUN_ENV || '--',
    });
});



module.exports = router;
