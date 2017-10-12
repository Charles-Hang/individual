const router = require('koa-router')();
import AController from '../controllers/article.js';
import MController from '../controllers/mood.js';
import SController from '../controllers/sign.js';
import CController from '../controllers/category.js';
import TController from '../controllers/tag.js';
import UController from '../controllers/user.js';
import jwtVerify from '../middlewares/jwtVerify.js';

router.post('/publish', jwtVerify, AController.createArticle);
router.post('/modifyMood', jwtVerify, MController.createMood);
router.post('/modifySign', jwtVerify, SController.createSign);
router.get('/getMood', MController.getMood);
router.get('/getSign', SController.getSign);
router.get('/getPublishedArticles', AController.getPublishedArticles);
router.get('/getArticlesByCategory', AController.getArticlesByCategory);
router.get('/getArticlesByTag', AController.getArticlesByTag);
router.get('/getCategories', CController.getCategories);
router.get('/getTags', TController.getTags);
router.get('/openArticle', AController.openArticle);
router.get('/getArticleContent', jwtVerify, AController.getArticleContent);
router.post('/editArticle', jwtVerify, AController.editArticle);
router.get('/getAllArticles', jwtVerify, AController.getAllArticles);
router.post('/togglePublish', jwtVerify, AController.togglePublish);
router.post('/deleteArticle', UController.loginVerify, AController.deleteArticle);
router.post('/login', UController.login);
router.get('/jwtVerify', UController.jwtVerify);

export default router;