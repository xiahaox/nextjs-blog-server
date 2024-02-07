const router = require('koa-router')();
// const article = require('../controller/article');
// const search = require('../controller/search');
const { getTagList, getCategoryList } = require('../controller/tag')

const {
    create,
    getList,
    // output,
    // upload,
    // checkExist,
    // uploadConfirm,
    // outputAll,
    findById,
    update,
    // delete: del,
    // outputList,
    // delList
} = require('../controller/article')

// router.get('/api/article/recommend', article.recommend);
// router.get('/api/article/category/all', article.category_all);
// router.get('/api/article/category/fe', article.category_fe);
// router.post('/api/search/article', search.article);
// tag category
router.get('/tag/list', getTagList) // 获取所有的 tag 列表
router.get('/category/list', getCategoryList) // 获取 category 列表
router.post('/article/add', create) // 创建文章
router.get('/article/list', getList) // 获取文章列表
router.get('/article/:id', findById)
router.put('/article/:id', update) //修改文章

module.exports = router;