let express = require('express'),
  router = express.Router(),
  passport  = require('passport');
  var rnp  = require('../middleware/rnp');

//middlewares 
var rnp  = require('../middleware/rnp');

//controllers
var AdminUserController = require('../controllers/Admin/userController'),
 authenticationController = require('../controllers/Admin/authController'),
 roleAndPermissionController = require('../controllers/Admin/roleAndPermissionController'),
 planController = require('../controllers/Admin/planController'),
 blogController = require('../controllers/Admin/blogController'),
 categoryController = require('../controllers/Admin/categoryController'),
 faqController = require('../controllers/faqController'),
 advertisementController = require('../controllers/Admin/advertisementController');

 //lets create app middleware arr
let middleware = [passport.authenticate('jwt', { session: false }),rnp.only('Admin')];

//authantication routes
router.post('/signin', authenticationController.signin);

//category
router.post('/category',middleware,categoryController.add);
router.get('/category',middleware,categoryController.index);
router.get('/category/:category_id',middleware,categoryController.show);
router.put('/category/:category_id',middleware,categoryController.update);
router.delete('/category/:category_id',middleware,categoryController.delete);

//user
router.get('/user/:skip/:limit',middleware,AdminUserController.index);
router.get('/admin/:skip/:limit',middleware,AdminUserController.Adminindex);
router.post('/user',middleware,AdminUserController.store);
router.put('/user/:user_id',middleware,AdminUserController.unableDisable);
router.get('/user/:user_id',middleware,AdminUserController.show);

//plans
router.post('/plan',middleware,planController.add);
router.get('/plan',middleware,planController.index);
router.get('/plan/:plan_id',middleware,planController.show);
router.put('/plan/:plan_id',middleware,planController.update);
router.delete('/plan/:plan_id',middleware,planController.delete);

//blogs
router.get('/blog/:skip/:limit',middleware,blogController.index);
router.put('/blog/:blog_id',middleware,blogController.unableDisable);
router.get('/blog/:blog_id',middleware,blogController.show);
router.get('/like_count',middleware,blogController.likeCount);
router.get('/save_count',middleware,blogController.saveCount);
router.get('/view_count',middleware,blogController.viewCount);
router.get('/comment_count',middleware,blogController.commentCount);
router.get('/blog_count',middleware,blogController.blogCount);
router.put('/disable_comment/:comment_id',middleware,blogController.blockComment);

//roles and permission
router.get('/roles',middleware,roleAndPermissionController.roles);
router.post('/add_permission_to_role',roleAndPermissionController.addPermissionToRole);
router.post('/add_role_to_user',roleAndPermissionController.addRoleToUser);
router.get('/permission',middleware,roleAndPermissionController.permission);
//router.post('/permission',roleAndPermissionController.addPermission);

//advertisement 
router.get('/advertisement',passport.authenticate('jwt', { session: false }),advertisementController.AdvertisementIndex);
router.get('/advertisement/:advertisement_id',passport.authenticate('jwt', { session: false }),advertisementController.AdvertisementShow);
router.put('/advertisement/:advertisement_id',passport.authenticate('jwt', { session: false }),advertisementController.AdvertisementReject);

//google advertisement 
router.get('/google_advertisement',passport.authenticate('jwt', { session: false }),advertisementController.GoogleAdvertisementIndex);
router.get('/google_advertisement/:advertisement_id',passport.authenticate('jwt', { session: false }),advertisementController.GoogleAdvertisementShow);
router.put('/google_advertisement/:advertisement_id',passport.authenticate('jwt', { session: false }),advertisementController.GoogleAdvertisementReject);

//faq
router.get('/faq',passport.authenticate('jwt', { session: false }),faqController.index);
router.get('/faq/:faq_id',passport.authenticate('jwt', { session: false }),faqController.show);
router.put('/faq/:faq_id',passport.authenticate('jwt', { session: false }),faqController.update);

//report
router.get('/report',passport.authenticate('jwt', { session: false }),blogController.getAllReport);
router.get('/report/:report_id',passport.authenticate('jwt', { session: false }),blogController.getReport);
router.put('/report/:report_id',passport.authenticate('jwt', { session: false }),blogController.reportUpdate);
module.exports = router; 