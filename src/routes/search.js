const router = require('koa-router')();
const search = require('../controller/search');

router.get('/api/search/article', search.article);



module.exports = router;