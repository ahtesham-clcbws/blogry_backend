let express = require('express'),
  router = express.Router(),
  passport  = require('passport');

//controllers 
var userController = require('../controllers/userController');
var authenticationController = require('../controllers/authController.js');
var advertisementController = require('../controllers/advertisementController');
var faqController = require('../controllers/faqController');
var homeController = require('../controllers/homeController');
var blogController = require('../controllers/blogController');
var  uploadFile  = require('../middleware/uplaod');
var  blogFileUpload  = require('../middleware/blogFileUpload');
var uploadAdvertisement = require('../middleware/uploadAdvertisement');
/* authantication routes  */

router.post('/signup', authenticationController.signup);
router.post('/signin', authenticationController.signin);
router.post('/verify_otp',authenticationController.verifyOtp);
router.post('/firebase_token',passport.authenticate('jwt', { session: false }),authenticationController.registerFirebaseToken);

/* authantication routes  */

//category
router.get('/category',userController.getCategory);
router.get('/tag',userController.getTag);
router.post('/category',passport.authenticate('jwt', { session: false }),userController.updateCategory);

//users
router.get('/user',passport.authenticate('jwt', { session: false }),userController.index);
router.post('/user',[passport.authenticate('jwt', { session: false }),uploadFile.single('avatar')],userController.update);
router.get('/user/saved_blog',passport.authenticate('jwt', { session: false }),userController.savedBlog);
router.get('/user/liked_blog',passport.authenticate('jwt', { session: false }),userController.likedBlog);
router.get('/user/viewed_blog',passport.authenticate('jwt', { session: false }),userController.viewedBlog);
router.get('/user/commented_blog',passport.authenticate('jwt', { session: false }),userController.commentedBlog);

//blogs
router.post('/blog',passport.authenticate('jwt', { session: false }),blogController.store); 
router.get('/blog/:skip/:limit',blogController.index);
router.get('/blog/popular/:skip/:limit',blogController.popularBlog);
router.get('/blog/popular_category/:skip/:limit',blogController.popularBlogByCatgegory);
router.get('/blog/popular_tag/:skip/:limit',blogController.popularBlogByTag);

router.get('/blog/:blog_id',blogController.show);
router.put('/blog/:blog_id',passport.authenticate('jwt', { session: false }),blogController.update);
router.delete('/blog/:blog_id',passport.authenticate('jwt', { session: false }),blogController.delete);
router.put('/blog/file/:blog_id',[passport.authenticate('jwt', { session: false }),blogFileUpload.single('file')],blogController.fileUpload);
router.delete('/blog/file/:blog_id',passport.authenticate('jwt', { session: false }),blogController.deleteFile);

//count per user 
router.get('/like_count',passport.authenticate('jwt', { session: false }),blogController.likeCount);
router.get('/save_count',passport.authenticate('jwt', { session: false }),blogController.saveCount);
router.get('/view_count',blogController.viewCount);
router.get('/comment_count',passport.authenticate('jwt', { session: false }),blogController.commentCount);
router.get('/blog_count',passport.authenticate('jwt', { session: false }),blogController.blogCount);

//homepage
router.get('/home/today_deals/:skip/:limit',homeController.todayDeals);
router.get('/home/recent_blogs/:skip/:limit',homeController.recent_blogs);

router.get('/notification',passport.authenticate('jwt', { session: false }),homeController.notification);
router.put('/like/:blog_id',passport.authenticate('jwt', { session: false }),blogController.likeDislike);
router.put('/save/:blog_id',passport.authenticate('jwt', { session: false }),blogController.saveUnsave);
router.put('/comment/:blog_id',passport.authenticate('jwt', { session: false }),blogController.comment);
router.put('/comment/:blog_id/:parent_id',passport.authenticate('jwt', { session: false }),blogController.comment);
router.put('/view/:blog_id',blogController.view);
router.post('/search',blogController.search); 

//advertisement 
router.get('/advertisement',passport.authenticate('jwt', { session: false }),advertisementController.AdvertisementIndex);
router.get('/advertisement/:advertisement_id',passport.authenticate('jwt', { session: false }),advertisementController.AdvertisementShow);
router.post('/advertisement',[passport.authenticate('jwt', { session: false }),uploadAdvertisement.single('image')],advertisementController.AdvertisementStore);
router.put('/advertisement/:advertisement_id',passport.authenticate('jwt', { session: false }),advertisementController.AdvertisementUpdate);
router.delete('/advertisement/:advertisement_id',passport.authenticate('jwt', { session: false }),advertisementController.AdvertisementDelete);

//google advertisement 
router.get('/google_advertisement',passport.authenticate('jwt', { session: false }),advertisementController.GoogleAdvertisementIndex);
router.get('/google_advertisement/:advertisement_id',passport.authenticate('jwt', { session: false }),advertisementController.GoogleAdvertisementShow);
router.post('/google_advertisement',passport.authenticate('jwt', { session: false }),advertisementController.GoogleAdvertisementStore);
router.put('/google_advertisement/:advertisement_id',passport.authenticate('jwt', { session: false }),advertisementController.GoogleAdvertisementUpdate);
router.delete('/google_advertisement/:advertisement_id',passport.authenticate('jwt', { session: false }),advertisementController.GoogleAdvertisementDelete);

//faq 
router.get('/faq',passport.authenticate('jwt', { session: false }),faqController.index);
router.get('/faq/:faq_id',passport.authenticate('jwt', { session: false }),faqController.show);
router.post('/faq',passport.authenticate('jwt', { session: false }),faqController.store);
router.put('/faq/:faq_id',passport.authenticate('jwt', { session: false }),faqController.update);

//report 
router.post('/report',passport.authenticate('jwt', { session: false }),blogController.reportStore);

module.exports = router;