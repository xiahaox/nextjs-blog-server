const { article } = require('../models/search');


const sequelize = require("sequelize");


module.exports = {
    article(ctx, next) {
        ctx.body = {
            msg: "OK",
            code: "0000",
            data: article,
            request: `${ctx.method} ${ctx.path}`
        };
        ctx.status = 200

    },
}