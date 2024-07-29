const express = require("express");
const bodyParser = require("body-parser");

const { signUp } = require("../controllers/user/authController/signUp");
const { otpVerify } = require("../controllers/user/authController/otpVerify");
const {
  userAuthenticate,
} = require("../controllers/user/authController/userAuthenticate");
const {
  updateProfile,
} = require("../controllers/user/authController/updateProfile");
const fileUploader = require("../middleware/fileUploader");
const { getAllExam } = require("../controllers/user/examController/getAllExam");
const {
  getAllSubject,
} = require("../controllers/user/subjectController/getAllSubject");
const { getAllCourse } = require("../controllers/user/courese/getAllCourse");
const { getCourse } = require("../controllers/user/courese/getCourse");
const {
  createTransaction,
} = require("../controllers/user/transaction/createTransaction");
const {
  transactionWebhook,
} = require("../controllers/user/transaction/transactionWebhook");
const {
  getRecommendedCourses,
} = require("../controllers/user/courese/recommendedCourse");
const { getAllBanners } = require("../controllers/user/banner/getAllBanner");
const { addReview } = require("../controllers/user/review/addReview");
const { deleteReview } = require("../controllers/user/review/deleteReview");
const { submitTest } = require("../controllers/user/testResult/submitTest");
const {
  getTestAnalysis,
} = require("../controllers/user/testResult/testAnalysis");
const {
  getLeaderboard,
} = require("../controllers/user/testResult/leaderboard");
const { getHome } = require("../controllers/user/home/getHome");
const {
  getAllTestSeries,
} = require("../controllers/user/testSeries/getAllTestSeries");
const {
  getTestSeries,
} = require("../controllers/user/testSeries/getTestSeries");
const {
  getUserTestSeries,
} = require("../controllers/user/testSeries/getUserTestSeries");
const {
  getAllPreviousPaper,
} = require("../controllers/user/previousPaper/getAllPreviousPaper");
const {
  getPreviousPaper,
} = require("../controllers/user/previousPaper/getPreviousPaper");
const { homeApi } = require("../controllers/user/home/homeApi");
const {
  deleteAccount,
} = require("../controllers/user/authController/deleteAccount");
const { sendQuery } = require("../controllers/user/support/sendQuery");
const { getAllQuery } = require("../controllers/user/support/getAllQuery");
const {
  getNotifications,
} = require("../controllers/user/notification/getNotification");
const { getAllNotes } = require("../controllers/user/notes/getAllNotes");
const {
  getRecommendedNotes,
} = require("../controllers/user/notes/recommendedNotes");
const { getNote } = require("../controllers/user/notes/getNotes");
const { getNoteBanner } = require("../controllers/user/notes/getNoteBanner");
const {
  getTestBanner,
} = require("../controllers/user/testSeries/getTestBanner");
const { getTopNotes } = require("../controllers/user/notes/getTopNotes");
const {
  getNoteSubject,
} = require("../controllers/user/noteSubject/getNoteSubject");
const {
  getPurchaseNotes,
} = require("../controllers/user/myContent/getPurchaseNote");
const {
  getPurchaseCourse,
} = require("../controllers/user/myContent/getPurchaseCourse");
const {
  getPurchaseTestSeries,
} = require("../controllers/user/myContent/getPurchaseTestSeries");
const { getProfile } = require("../controllers/user/authController/getProfile");
const {
  getCourseClasses,
} = require("../controllers/user/courese/getCourseClasses");
const {
  getAllMyPurchases,
} = require("../controllers/user/myContent/getAllMyPurchases");
const { bookmarkClass } = require("../controllers/user/bookmark/bookmarkClass");
const {
  getCourseSubject,
} = require("../controllers/user/courese/getCourseSubject");
const { notesApi } = require("../controllers/user/notes/notesApi");
const {
  verifyPayment,
} = require("../controllers/user/transaction/verifyPayment");
const { homeWebApi } = require("../controllers/user/home/homeWebApi");
const {
  getAllLiveClass,
} = require("../controllers/user/class/getAllLiveClass");
const {
  getAllNoteBook,
} = require("../controllers/user/noteBook/getAllNoteBook");
const { getNoteBook } = require("../controllers/user/noteBook/getNoteBook");
const {
  updateNoteBook,
} = require("../controllers/user/noteBook/updateNoteBook");
const {
  deleteNoteBook,
} = require("../controllers/user/noteBook/deleteNoteBook");
const {
  createNoteBook,
} = require("../controllers/user/noteBook/createNoteBook");
const {
  addOrUpdateRating,
} = require("../controllers/user/classRating/addUpdateRating");
const {
  addOrUpdateReport,
} = require("../controllers/user/classRating/addUpdateReport");
const { getState } = require("../controllers/user/address/getState");
const { getCity } = require("../controllers/user/address/getCity");
const {
  getClassMessages,
} = require("../controllers/user/classMessage/getClassMessage");
const {
  readNotification,
} = require("../controllers/user/notification/readNotification");
const {
  getMyPurchase,
} = require("../controllers/user/transaction/getMyPurchase");
const {
  getCourseClass,
} = require("../controllers/user/courese/getCourseClass");
const globalSearch = require("../controllers/user/home/globalSearch");
const { suggestedResult } = require("../controllers/user/home/suggestedResult");

const router = express.Router();

//Authentication
router.post("/signUp", signUp);
router.post("/verifyOtp", otpVerify);
router.patch(
  "/updateProfile",
  userAuthenticate,
  fileUploader([{ name: "profileImage", maxCount: 1 }], "user"),
  updateProfile
);
router.get("/getProfile", userAuthenticate, getProfile);
router.delete("/deleteAccount", userAuthenticate, deleteAccount);

//Exam
router.get("/exam", getAllExam);

//Subject
router.get("/subject", getAllSubject);

//Course
router.route("/course").get(userAuthenticate, getAllCourse);
router.route("/course/:id").get(userAuthenticate, getCourse);
router.get("/courses/classes", userAuthenticate, getCourseClasses);
router.get("/courses/classes/:id", userAuthenticate, getCourseClass);
router.route("/recommendedCourse").get(userAuthenticate, getRecommendedCourses);
router.get("/courseSubject", userAuthenticate, getCourseSubject);

//Transaction
router.post("/transaction", userAuthenticate, createTransaction);
router.post(
  "/transactionWebhook",
  bodyParser.raw({ type: "application/json" }),
  transactionWebhook
);
router.post(
  "/verifyPayment",
  bodyParser.raw({ type: "application/json" }),
  verifyPayment
);

router.get("/myPurchases", userAuthenticate, getMyPurchase);

//Banner
router.get("/banner", getAllBanners);

//Review
router.route("/review").post(userAuthenticate, addReview);
router.route("/review/:courseId").delete(userAuthenticate, deleteReview);

//testResult
router.route("/submitTest").post(userAuthenticate, submitTest);
router.get("/testAnalysis/:id", userAuthenticate, getTestAnalysis);
router.get("/leaderboard/:id", userAuthenticate, getLeaderboard);

//home
router.get("/home", getHome);
router.get("/homeApi", userAuthenticate, homeApi);
router.get("/homeWebApi", homeWebApi);
router.get("/globalSearch",globalSearch)
router.get("/searchSuggestion",suggestedResult)

//Test Series
router.get("/testSeries", userAuthenticate, getAllTestSeries);
router.get("/testSeries/:id", userAuthenticate, getTestSeries);
router.get("/userTestSeries", userAuthenticate, getUserTestSeries);
router.route("/testBanner").get(getTestBanner);

//Previous Paper
router.get("/previousPaper", userAuthenticate, getAllPreviousPaper);
router.get("/previousPaper/:id", userAuthenticate, getPreviousPaper);

//Support
router
  .route("/support")
  .post(userAuthenticate, sendQuery)
  .get(userAuthenticate, getAllQuery);

//Notification
router.route("/notification").get(userAuthenticate, getNotifications);
router
  .route("/notification/:notificationId")
  .get(userAuthenticate, readNotification);

//Notess
router.route("/notes").get(userAuthenticate, getAllNotes);
router.route("/notes/:id").get(userAuthenticate, getNote);
router.route("/recommendedNotes").get(userAuthenticate, getRecommendedNotes);
router.route("/notesBanner").get(getNoteBanner);
router.get("/topNotes", getTopNotes);
router.get("/notesHome", userAuthenticate, notesApi);

//Note Subject
router.get("/noteSubject", getNoteSubject);

//MyContent
router.get("/myContent/notes", userAuthenticate, getPurchaseNotes);
router.get("/myContent/course", userAuthenticate, getPurchaseCourse);
router.get("/myContent/testSeries", userAuthenticate, getPurchaseTestSeries);
router.get("/myContent/myPurchases", userAuthenticate, getAllMyPurchases);

//Bookmark Class
router.post("/bookmarkClass", userAuthenticate, bookmarkClass);

//Class
router.get("/class", userAuthenticate, getAllLiveClass);
router.get("/class/:classId/messages", getClassMessages);

//Notebook
router
  .route("/noteBook")
  .post(
    userAuthenticate,
    fileUploader([{ name: "image", maxCount: 1 }], "notebook"),
    createNoteBook
  )
  .get(userAuthenticate, getAllNoteBook);

router
  .route("/noteBook/:id")
  .get(userAuthenticate, getNoteBook)
  .patch(
    userAuthenticate,
    fileUploader([{ name: "image", maxCount: 1 }], "notebook"),
    updateNoteBook
  )
  .delete(userAuthenticate, deleteNoteBook);

//class Rating Report

router.route("/classRating").post(userAuthenticate, addOrUpdateRating);
router.route("/classReport").post(userAuthenticate, addOrUpdateReport);

//Address
router.get("/getState", getState);
router.get("/getCity", getCity);

module.exports = router;
