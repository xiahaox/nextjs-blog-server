const { category_all, recommend } = require('../models/article');


const sequelize = require("sequelize");


module.exports = {
    recommend(ctx, next) {
        ctx.body = {
            msg: "OK",
            code: "0000",
            data: recommend,
            request: `${ctx.method} ${ctx.path}`
        };
        ctx.status = 200

    },
    category_all(ctx, next) {
        ctx.body = {
            msg: "OK",
            code: "0000",
            data: category_all,
            request: `${ctx.method} ${ctx.path}`
        };
        ctx.status = 200
    },
    category_fe(ctx, next) {
        ctx.body = {
            msg: "OK",
            code: "0000",
            data: category_all[0].slice(1),
            request: `${ctx.method} ${ctx.path}`
        };
        ctx.status = 200
    }
}