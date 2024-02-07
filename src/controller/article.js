// const { category_all, recommend } = require('../models/article');
const Joi = require('joi')

const {
    article: ArticleModel,
    tag: TagModel,
    category: CategoryModel,
    // comment: CommentModel,
    // reply: ReplyModel,
    // user: UserModel,
    sequelize
} = require('../models')

class ArticleController {
    // 创建文章
    static async create(ctx) {
        const validator = ctx.validate(ctx.request.body, {
            // authorId: Joi.number().required(),
            title: Joi.string().required(),
            content: Joi.string(),
            categoryList: Joi.array(),
            tagList: Joi.array()
        })

        if (validator) {
            const { title, content, categoryList = [], tagList = [], authorId } = ctx.request.body
            console.log(ctx.request.body, "+=ctx.request.body");
            const result = await ArticleModel.findOne({ where: { title } })
            console.log(result, "==result");
            if (result) {
                ctx.throw(403, '创建失败，该文章已存在！')
            } else {
                const tags = tagList.map(t => ({ name: t }))
                const categories = categoryList.map(c => ({ name: c }))
                const data = await ArticleModel.create(
                    { title, content, tags, categories },
                    { include: [TagModel, CategoryModel] }
                )
                ctx.body = data
            }
        }
    }

    // 获取文章列表
    static async getList(ctx) {
        const validator = ctx.validate(ctx.query, {
            page: Joi.string(),
            pageSize: Joi.number(),
            keyword: Joi.string().allow(''), // 关键字查询
            category: Joi.string(),
            tag: Joi.string(),
            preview: Joi.number(),
            order: Joi.string()
        })

        if (validator) {
            const { page = 1, pageSize = 10, preview = 1, keyword = '', tag, category, order } = ctx.query
            const tagFilter = tag ? { name: tag } : null
            const categoryFilter = category ? { name: category } : null
            console.log(ctx.query, "==ctx.query");
            let articleOrder = [['createdAt', 'DESC']]
            if (order) {
                articleOrder = [order.split(' ')]
            }

            const data = await ArticleModel.findAndCountAll({
                // where: {
                //     // id: {
                //     //     $not: -1 // 过滤关于页面的副本
                //     // },
                //     // $or: {
                //     //     title: {
                //     //         $like: `%${keyword}%`
                //     //     },
                //     //     content: {
                //     //         $like: `%${keyword}%`
                //     //     }
                //     // }
                // },
                include: [
                    { model: TagModel, attributes: ['name'], where: tagFilter },
                    { model: CategoryModel, attributes: ['name'], where: categoryFilter },
                    // {
                    //     model: CommentModel,
                    //     attributes: ['id'],
                    //     include: [{ model: ReplyModel, attributes: ['id'] }]
                    // }
                ],
                offset: (page - 1) * pageSize,
                limit: parseInt(pageSize),
                order: articleOrder,
                row: true,
                distinct: true // count 计算
            })
            if (preview === 1) {
                data.rows.forEach(d => {
                    d.content = d.content.slice(0, 1000) // 只是获取预览，减少打了的数据传输。。。
                })
            }
            ctx.body = data
        }
    }
    // 获取文章详情
    static async findById(ctx) {
        const validator = ctx.validate(
            { ...ctx.params, ...ctx.query },
            {
                id: Joi.number().required(),
                type: Joi.number() // type 用于区分是否增加浏览次数 1 新增浏览次数 0 不新增
            }
        )
        if (validator) {
            const data = await ArticleModel.findOne({
                where: { id: ctx.params.id },
                include: [
                    // 查找 分类 标签 评论 回复...
                    { model: TagModel, attributes: ['name'] },
                    { model: CategoryModel, attributes: ['name'] },
                    // {
                    //     model: CommentModel,
                    //     attributes: ['id', 'content', 'createdAt'],
                    //     include: [
                    //         {
                    //             model: ReplyModel,
                    //             attributes: ['id', 'content', 'createdAt'],
                    //             include: [{ model: UserModel, as: 'user', attributes: { exclude: ['updatedAt', 'password'] } }]
                    //         },
                    //         { model: UserModel, as: 'user', attributes: { exclude: ['updatedAt', 'password'] } }
                    //     ],
                    //     row: true
                    // }
                ],
                // order: [[CommentModel, 'createdAt', 'DESC'], [[CommentModel, ReplyModel, 'createdAt', 'ASC']]], // comment model order
                row: true
            })

            const { type = 1 } = ctx.query
            // viewer count ++
            type === 1 && ArticleModel.update({ viewCount: ++data.viewCount }, { where: { id: ctx.params.id } })

            // JSON.parse(github)
            // data.comments.forEach(comment => {
            //     comment.user.github = JSON.parse(comment.user.github)
            //     comment.replies.forEach(reply => {
            //         reply.user.github = JSON.parse(reply.user.github)
            //     })
            // })
            ctx.body = data
        }
    }
    // 修改文章
    static async update(ctx) {
        const validator = ctx.validate(
            {
                articleId: ctx.params.id,
                ...ctx.request.body
            },
            {
                articleId: Joi.number().required(),
                title: Joi.string(),
                content: Joi.string(),
                categories: Joi.array(),
                tags: Joi.array()
            }
        )
        if (validator) {
            const { title, content, categories = [], tags = [] } = ctx.request.body
            const articleId = parseInt(ctx.params.id)
            const tagList = tags.map(tag => ({ name: tag, articleId }))
            const categoryList = categories.map(cate => ({ name: cate, articleId }))
            await ArticleModel.update({ title, content }, { where: { id: articleId } })
            await TagModel.destroy({ where: { articleId } })
            await TagModel.bulkCreate(tagList)
            await CategoryModel.destroy({ where: { articleId } })
            await CategoryModel.bulkCreate(categoryList)
            ctx.status = 204
        }
    }
    // recommend(ctx, next) {
    //     ctx.body = {
    //         msg: "OK",
    //         code: "0000",
    //         data: recommend,
    //         request: `${ctx.method} ${ctx.path}`
    //     };
    //     ctx.status = 200

    // },
    // category_all(ctx, next) {
    //     ctx.body = {
    //         msg: "OK",
    //         code: "0000",
    //         data: category_all,
    //         request: `${ctx.method} ${ctx.path}`
    //     };
    //     ctx.status = 200
    // },
    // category_fe(ctx, next) {
    //     ctx.body = {
    //         msg: "OK",
    //         code: "0000",
    //         data: category_all[0].slice(1),
    //         request: `${ctx.method} ${ctx.path}`
    //     };
    //     ctx.status = 200
    // }
}

module.exports = ArticleController