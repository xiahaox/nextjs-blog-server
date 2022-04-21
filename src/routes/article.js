const router = require('koa-router')();
const article = require('../controller/article');
const search = require('../controller/search');


router.get('/api/article/recommend', article.recommend);
router.get('/api/article/category/all', article.category_all);
router.get('/api/article/category/fe', article.category_fe);
router.post('/api/search/article', search.article);

module.exports = router;