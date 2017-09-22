const router = require('koa-router')();
import AController from '../controllers/article.js';
import MController from '../controllers/mood.js';

router.post('/publish', AController.createArticle);
router.post('/modifyMood', MController.createMood);
router.get('/getArticles', AController.getArticles);

export default router;