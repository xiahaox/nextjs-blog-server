
const Joi = require('joi')
const { user: UserModel, } = require('../models')
const { createToken } = require('../utils/token')
/**
  * 获取用户列表
  */
class UserController {
  /**
   * 获取用户列表
   */
  static async getList(ctx) {
    const validator = ctx.validate(ctx.query, {
      username: Joi.string().allow(''),
      type: Joi.number(), // 检索类型 type = 1 github 用户 type = 2 站内用户 不传则检索所有
      'rangeDate[]': Joi.array(),
      page: Joi.string(),
      pageSize: Joi.number()
    })
    if (validator) {
      const { page = 1, pageSize = 10, username, type } = ctx.query
      const rangeDate = ctx.query['rangeDate[]']
      const where = {
        // role: { $not: 1 }
      }

      if (username) {
        where.username = {}
        where.username['$like'] = `%${username}%`
      }

      if (type) {
        where.github = parseInt(type) === 1 ? { $not: null } : null
      }

      if (Array.isArray(rangeDate) && rangeDate.length === 2) {
        where.createdAt = { $between: rangeDate }
      }

      const result = await UserModel.findAndCountAll({
        where,
        offset: (page - 1) * pageSize,
        limit: parseInt(pageSize),
        row: true,
        order: [['createdAt', 'DESC']]
      })

      ctx.body = result
    }
  }

  // 更新用户信息
  static updateUserById(userId, data) {
    return UserModel.update(data, { where: { id: userId } })
  }

  static async delete(ctx) {
    const validator = ctx.validate(ctx.params, {
      userId: Joi.number().required()
    })

    if (validator) {
      await sequelize.query(
        `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.userId=${ctx.params.userId}`
      )
      await UserModel.destroy({ where: { id: ctx.params.userId } })
      // ctx.client(200)
      ctx.status = 204
    }
  }

  // 注册
  static async register(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string()
        .email()
        .required()
    })

    if (validator) {
      const { username, password, email } = ctx.request.body
      const result = await UserModel.findOne({ where: { email } })
      if (result) {
        // ctx.client(403, '邮箱已被注册')
        ctx.throw(403, '邮箱已被注册')
      } else {
        const user = await UserModel.findOne({ where: { username } })
        if (user && !user.github) {
          ctx.throw(403, '用户名已被占用')
        } else {
          // const saltPassword = await encrypt(password)
          const saltPassword = password;
          await UserModel.create({ username, password: saltPassword, email })
          // ctx.client(200, '注册成功')
          ctx.status = 200
        }
      }
    }
  }

  // 登录
  static async login(ctx) {

    const { code } = ctx.request.body
    if (code) {
      // await UserController.githubLogin(ctx, code)
    } else {
      await UserController.defaultLogin(ctx)
    }
  }

  // 站内用户登录
  static async defaultLogin(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      account: Joi.string().required(),
      password: Joi.string()
    })
    if (validator) {
      const { account, password } = ctx.request.body

      const user = await UserModel.findOne({
        where: {
          // $or: { email: account, username: account }
          username: account
        }
      })
      if (!user) {
        ctx.status = 403;
        ctx.body = { err: '用户不存在' }
      } else {
        const isMatch = await new Promise((resolve, reject) => {
          if (password === user.password) {
            return resolve(true)
          } else {
            resolve(false)
          }
        })
        if (!isMatch) {
          ctx.status = 403;
          ctx.body = { err: '密码不正确' }
        } else {
          const { id, role } = user
          const token = createToken({ username: user.username, userId: id, role }) // 生成 token
          ctx.body = { username: user.username, role, userId: id, token }
        }
      }
    }
  }
}

module.exports = UserController