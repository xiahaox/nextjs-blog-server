const router = require('koa-router')();
// const article = require('../controller/article');
// const search = require('../controller/search');

const {
    create,
    getList,
    // output,
    // upload,
    // checkExist,
    // uploadConfirm,
    // outputAll,
    // findById,
    // update,
    // delete: del,
    // outputList,
    // delList
} = require('../controller/article')

// router.get('/api/article/recommend', article.recommend);
// router.get('/api/article/category/all', article.category_all);
// router.get('/api/article/category/fe', article.category_fe);
// router.post('/api/search/article', search.article);

router.post('/article/add', create) // 创建文章
router.get('/article/list', getList) // 获取文章列表


module.exports = router;