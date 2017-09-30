const router = require('koa-router')();
import AController from '../controllers/article.js';
import MController from '../controllers/mood.js';
import CController from '../controllers/category.js';
import TController from '../controllers/tag.js';
import UController from '../controllers/user.js';
import jwtVerify from '../middlewares/jwtVerify.js';

router.post('/publish', AController.createArticle);
router.post('/modifyMood', MController.createMood);
router.get('/getMood', MController.getMood);
router.get('/getPublishedArticles', AController.getPublishedArticles);
router.get('/getArticlesByCategory', AController.getArticlesByCategory);
router.get('/getArticlesByTag', AController.getArticlesByTag);
router.get('/getCategories', CController.getCategories);
router.get('/getTags', TController.getTags);
router.get('/openArticle', AController.openArticle);
router.get('/getAllArticles', AController.getAllArticles);
router.post('/togglePublish', jwtVerify, AController.togglePublish);
router.post('/login', UController.login);

export default router;