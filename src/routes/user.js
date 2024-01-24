const router = require('koa-router')();

const { getList, updateUser, delete: del, register, login } = require('../controller/user');

router.post('/login', login) // 登录
router.post('/register', register) // 注册

router
    .get('/user/list', getList) // 获取列表
    // .put('/:userId', updateUser) // 更新用户信息
    .delete('/:userId', del) // 删除用户



module.exports = router
