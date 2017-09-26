const router = require('koa-router')();
import AController from '../controllers/article.js';
import MController from '../controllers/mood.js';
import CController from '../controllers/category.js';
import TController from '../controllers/tag.js';

router.post('/publish', AController.createArticle);
router.post('/modifyMood', MController.createMood);
router.get('/getMood', MController.getMood);
router.get('/getArticles', AController.getArticles);
router.get('/getArticlesByCategory', AController.getArticlesByCategory);
router.get('/getArticlesByTag', AController.getArticlesByTag);
router.get('/getCategories', CController.getCategories);
router.get('/getTags', TController.getTags);
router.get('/openArticle', AController.openArticle);

export default router;