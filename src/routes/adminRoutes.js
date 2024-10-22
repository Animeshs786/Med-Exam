const express = require("express");

const { register } = require("../controllers/admin/authController/register");
const { login } = require("../controllers/admin/authController/login");
const {
  adminAuthenticate,
} = require("../controllers/admin/authController/adminAuthenticate");
const {
  updatePassword,
} = require("../controllers/admin/authController/updatePassword");
const fileUploader = require("../middleware/fileUploader");
const {
  createExam,
} = require("../controllers/admin/examController/createExam");
const {
  getAllExam,
} = require("../controllers/admin/examController/getAllExam");
const { getExam } = require("../controllers/admin/examController/getExam");
const {
  updateExam,
} = require("../controllers/admin/examController/updateExam");
const {
  deleteExam,
} = require("../controllers/admin/examController/deleteExam");
const {
  createSubject,
} = require("../controllers/admin/subjectController/createSubject");
const {
  getAllSubject,
} = require("../controllers/admin/subjectController/getAllSubject");
const {
  getSubject,
} = require("../controllers/admin/subjectController/getSubject");
const {
  updateSubject,
} = require("../controllers/admin/subjectController/updateSubject");
const {
  deleteSubject,
} = require("../controllers/admin/subjectController/deleteSubject");
const {
  createQuestion,
} = require("../controllers/admin/questionController/createQuestion");
const {
  getAllQuestions,
} = require("../controllers/admin/questionController/getAllQuestion");
const {
  getQuestion,
} = require("../controllers/admin/questionController/getQuestion");
const {
  updateQuestion,
} = require("../controllers/admin/questionController/updateQuestion");
const {
  deleteQuestion,
} = require("../controllers/admin/questionController/deleteQuestion");
const { createCourse } = require("../controllers/admin/courese/createCourse");
const { getAllCourse } = require("../controllers/admin/courese/getAllCourse");
const { getCourse } = require("../controllers/admin/courese/getCourse");
const { updateCourse } = require("../controllers/admin/courese/updateCourse");
const {
  createClass,
} = require("../controllers/admin/classController/createClass");
const {
  getAllClasses,
} = require("../controllers/admin/classController/getAllClass");
const { getClass } = require("../controllers/admin/classController/getClass");
const {
  updateClass,
} = require("../controllers/admin/classController/updateClass");
const {
  deleteClass,
} = require("../controllers/admin/classController/deleteClass");
const {
  createBanner,
} = require("../controllers/admin/bannerController/createBanner");
const {
  getAllBanners,
} = require("../controllers/admin/bannerController/getAllBanner");
const {
  getBanner,
} = require("../controllers/admin/bannerController/getBanner");
const {
  updateBanner,
} = require("../controllers/admin/bannerController/updateBanner");
const {
  deleteBanner,
} = require("../controllers/admin/bannerController/deleteBanner");
const {
  getAllTransaction,
} = require("../controllers/admin/transaction/getAllTransaction");
const {
  createExamSubCategory,
} = require("../controllers/admin/examSubcategory/createExamSubCat");
const {
  getAllExamSubCategories,
} = require("../controllers/admin/examSubcategory/getAllExamSubCat");
const {
  updateExamSubCategory,
} = require("../controllers/admin/examSubcategory/updateExamSubCat");
const {
  getExamSubCategory,
} = require("../controllers/admin/examSubcategory/getExamSubCat");
const {
  deleteExamSubCategory,
} = require("../controllers/admin/examSubcategory/deleteExamSubcat");
const {
  createMockTest,
} = require("../controllers/admin/mockTestController/createMockTest");
const {
  getAllMockTests,
} = require("../controllers/admin/mockTestController/getAllMockTest");
const {
  getMockTest,
} = require("../controllers/admin/mockTestController/getMockTest");
const {
  updateMockTest,
} = require("../controllers/admin/mockTestController/updateMockTest");
const {
  deleteMockTest,
} = require("../controllers/admin/mockTestController/deleteMockTest");
const {
  addQuestionToMockTest,
} = require("../controllers/admin/mockTestController/addMockQuestion");
const {
  removeQuestionFromMockTest,
} = require("../controllers/admin/mockTestController/RemoveMockQuestion");
const { homeController } = require("../controllers/admin/homeController/home");
const { addFaq } = require("../controllers/admin/homeController/addFaq");
const { updateFaq } = require("../controllers/admin/homeController/updateFaq");
const { deleteFaq } = require("../controllers/admin/homeController/deleteFaq");
const { getFaq } = require("../controllers/admin/homeController/getFaq");
const { getHome } = require("../controllers/admin/homeController/getHome");
const {
  createTestSeries,
} = require("../controllers/admin/testSeries.js/createTestSeries");
const {
  getAllTestSeries,
} = require("../controllers/admin/testSeries.js/getAllTestSeries");
const {
  getTestSeries,
} = require("../controllers/admin/testSeries.js/getTestSeries");
const {
  updateTestSeries,
} = require("../controllers/admin/testSeries.js/updateTestSeries");
const {
  deleteTestSeries,
} = require("../controllers/admin/testSeries.js/deleteTestSeries");
const {
  createPreviousPaper,
} = require("../controllers/admin/previousPaper/createPreviousPaper");
const {
  getAllPreviousPaper,
} = require("../controllers/admin/previousPaper/getAllPrevioiusPaper");
const {
  getPreviousPaper,
} = require("../controllers/admin/previousPaper/getPreviousPaper");
const {
  updatePreviousPaper,
} = require("../controllers/admin/previousPaper/updatePreviousPaper");
const {
  deletePreviousPaper,
} = require("../controllers/admin/previousPaper/deletePreviousPaper");
const { getAllQuery } = require("../controllers/admin/support/getAllQuery");
const { getQuery } = require("../controllers/admin/support/getQuery");
const { updateQuery } = require("../controllers/admin/support/updateQuery");
const { deleteQuery } = require("../controllers/admin/support/deleteQuery");
const {
  createNotification,
} = require("../controllers/admin/notification/createNotification");
const {
  createNote,
} = require("../controllers/admin/notesController/createNotes");
const {
  getAllNotes,
} = require("../controllers/admin/notesController/getAllNotes");
const { getNotes } = require("../controllers/admin/notesController/getNotes");
const {
  updateNote,
} = require("../controllers/admin/notesController/updateNotes");
const {
  deleteNote,
} = require("../controllers/admin/notesController/deleteNotes");
const {
  createNoteSubject,
} = require("../controllers/admin/notesSubject/createNoteSubject");
const {
  getAllNoteSubjects,
} = require("../controllers/admin/notesSubject/getAllNoteSubject");
const {
  getNoteSubject,
} = require("../controllers/admin/notesSubject/getNoteSubject");
const {
  updateNoteSubject,
} = require("../controllers/admin/notesSubject/updateNoteSubject");
const {
  deleteNoteSubject,
} = require("../controllers/admin/notesSubject/deleteNoteSubject");
const {
  importQuestionsFromDoc,
} = require("../controllers/admin/questionController/importQuestionFromDoc");
const {
  importQuestionFromCsv,
} = require("../controllers/admin/questionController/importQuestionFromCsv");
const { getAllFaq } = require("../controllers/admin/homeController/getAllFaq");
const {
  addUpdateSupportMail,
} = require("../controllers/admin/homeController/addUpdateSupportMail");
const {
  cloneMockTest,
} = require("../controllers/admin/mockTestController/cloneMockTest");
const { deleteCourse } = require("../controllers/admin/courese/deleteCourse");
const { create } = require("../models/admin");
const {
  createPreparationTest,
} = require("../controllers/admin/preparationTestController/createPreparationTest");
const {
  getAllPreparationTest,
} = require("../controllers/admin/preparationTestController/getAllPreparationTest");
const {
  getPreparationTest,
} = require("../controllers/admin/preparationTestController/getPreparationTest");
const {
  updatePreparationTest,
} = require("../controllers/admin/preparationTestController/updatePreparationTest");
const {
  deletePreparationTest,
} = require("../controllers/admin/preparationTestController/deletePreparationTest");
const {
  addPreparationTestQuestions,
} = require("../controllers/admin/preparationTestController/addPreparationTestQuestions");
const {
  removeQuestionFromPreparationTest,
} = require("../controllers/admin/preparationTestController/removeQuestionFromPreparationTest");
const {
  clonePreparationTest,
} = require("../controllers/admin/preparationTestController/clonePreparationTest");
const {
  createQuestionImage,
} = require("../controllers/admin/questionImage/createQuestionImage");
const {
  getAllQuestionImages,
} = require("../controllers/admin/questionImage/getAllQuestionImage");
const {
  getQuestionImage,
} = require("../controllers/admin/questionImage/getQuestionImage");
const {
  deleteQuestionImage,
} = require("../controllers/admin/questionImage/deleteQuestionImage");
const {
  updateQuestionImage,
} = require("../controllers/admin/questionImage/updateQuestionImage");
const { getAllUsers } = require("../controllers/admin/user/getAllUser");
const {
  addQuestionToMcq,
} = require("../controllers/admin/questionController/addQuestionToMcq");
const {
  addRemoveMcq,
} = require("../controllers/admin/questionController/addRemoveMcq");
const {
  createQuestionBank,
} = require("../controllers/admin/questionBank/createQuestionBank");
const {
  getAllQuestionBank,
} = require("../controllers/admin/questionBank/getAllQuestionBank");
const {
  getQuestionBank,
} = require("../controllers/admin/questionBank/getQuestionBank");
const {
  updateQuestionBank,
} = require("../controllers/admin/questionBank/updateQuestionBank");
const {
  deleteQuestionBank,
} = require("../controllers/admin/questionBank/deleteQuestionBank");
const {
  addQuestionToQuestionBank,
} = require("../controllers/admin/questionBank/addQuestionToQuestionBank");
const {
  removeQuestionFromQuestionBank,
} = require("../controllers/admin/questionBank/removeQuestionFromQuestionBank");
const { getDashboard } = require("../controllers/admin/dashboard/getDashboard");

const router = express.Router();

//Authentication
router.post(
  "/register",
  fileUploader([{ name: "profileImage", maxCount: 1 }], "admin"),
  register
);
router.post("/login", login);

router.use(adminAuthenticate);

router.patch("/updatePassword", updatePassword);

//Exam
router
  .route("/exam")
  .post(fileUploader([{ name: "thumbImage", maxCount: 1 }], "exam"), createExam)
  .get(getAllExam);

router
  .route("/exam/:id")
  .get(getExam)
  .patch(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "exam"),
    updateExam
  )
  .delete(deleteExam);

//Subject
router
  .route("/subject")
  .post(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "subject"),
    createSubject
  )
  .get(getAllSubject);
router
  .route("/subject/:id")
  .get(getSubject)
  .patch(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "subject"),
    updateSubject
  )
  .delete(deleteSubject);

//Paper
router
  .route("/question")
  .post(
    fileUploader(
      [
        { name: "questionImageEnglish", maxCount: 1 },
        { name: "solutionImageEnglish", maxCount: 1 },
        { name: "optionImage1English", maxCount: 1 },
        { name: "optionImage2English", maxCount: 1 },
        { name: "optionImage3English", maxCount: 1 },
        { name: "optionImage4English", maxCount: 1 },
        { name: "questionImageHindi", maxCount: 1 },
        { name: "solutionImageHindi", maxCount: 1 },
        { name: "optionImage1Hindi", maxCount: 1 },
        { name: "optionImage2Hindi", maxCount: 1 },
        { name: "optionImage3Hindi", maxCount: 1 },
        { name: "optionImage4Hindi", maxCount: 1 },
      ],
      "question"
    ),
    createQuestion
  )
  .get(getAllQuestions);

router
  .route("/question/:id")
  .get(getQuestion)
  .patch(
    fileUploader(
      [
        { name: "questionImageEnglish", maxCount: 1 },
        { name: "solutionImageEnglish", maxCount: 1 },
        { name: "optionImage1English", maxCount: 1 },
        { name: "optionImage2English", maxCount: 1 },
        { name: "optionImage3English", maxCount: 1 },
        { name: "optionImage4English", maxCount: 1 },
        { name: "questionImageHindi", maxCount: 1 },
        { name: "solutionImageHindi", maxCount: 1 },
        { name: "optionImage1Hindi", maxCount: 1 },
        { name: "optionImage2Hindi", maxCount: 1 },
        { name: "optionImage3Hindi", maxCount: 1 },
        { name: "optionImage4Hindi", maxCount: 1 },
      ],
      "question"
    ),
    updateQuestion
  )
  .delete(deleteQuestion);

router
  .route("/uploadQuestion")
  .post(
    fileUploader([{ name: "csvFile", maxCount: 1 }], "csv"),
    importQuestionFromCsv
  );

// router
//   .route("/uploadQuestion")
//   .post(
//     fileUploader([{ name: "file", maxCount: 1 }], "dock"),
//     importQuestionsFromDoc
//   );

//Course
router
  .route("/course")
  .post(
    fileUploader(
      [
        { name: "thumbImage", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 },
        { name: "logo", maxCount: 1 },
        { name: "previewBanner", maxCount: 3 },
        { name: "pdf", maxCount: 1 },
      ],
      "course"
    ),
    createCourse
  )
  .get(getAllCourse);
router
  .route("/course/:id")
  .get(getCourse)
  .patch(
    fileUploader(
      [
        { name: "thumbImage", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 },
        { name: "logo", maxCount: 1 },
        { name: "previewBanner", maxCount: 3 },
        { name: "pdf", maxCount: 1 },
      ],
      "course"
    ),
    updateCourse
  )
  .delete(deleteCourse);

//class
router
  .route("/class")
  .post(
    fileUploader(
      [
        { name: "thumbImage", maxCount: 1 },
        { name: "pdf", maxCount: 1 },
      ],
      "course"
    ),
    createClass
  )
  .get(getAllClasses);
router
  .route("/class/:id")
  .get(getClass)
  .patch(
    fileUploader(
      [
        { name: "thumbImage", maxCount: 1 },
        { name: "pdf", maxCount: 1 },
      ],
      "course"
    ),
    updateClass
  )
  .delete(deleteClass);

//Banner
router
  .route("/banner")
  .post(
    fileUploader(
      [
        { name: "image", maxCount: 1 },
        { name: "webImage", maxCount: 1 },
      ],
      "banner"
    ),
    createBanner
  )
  .get(getAllBanners);
router
  .route("/banner/:id")
  .get(getBanner)
  .patch(
    fileUploader(
      [
        { name: "image", maxCount: 1 },
        { name: "webImage", maxCount: 1 },
      ],
      "banner"
    ),
    updateBanner
  )
  .delete(deleteBanner);

//Transaction
router.route("/transaction").get(getAllTransaction);

//Exam Subcategory
router
  .route("/examSubcategory")
  .post(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "exam"),
    createExamSubCategory
  )
  .get(getAllExamSubCategories);
router
  .route("/examSubcategory/:id")
  .get(getExamSubCategory)
  .patch(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "exam"),
    updateExamSubCategory
  )
  .delete(deleteExamSubCategory);

//Mock Test
router
  .route("/mockTest")
  .post(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "mockTest"),
    createMockTest
  )
  .get(getAllMockTests);
router
  .route("/mockTest/:id")
  .get(getMockTest)
  .patch(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "mockTest"),
    updateMockTest
  )
  .delete(deleteMockTest);

router
  .route("/mockTestQuestion")
  .post(addQuestionToMockTest)
  .delete(removeQuestionFromMockTest);
router.post("/mockTestClone", cloneMockTest);

//Preparation Test
router
  .route("/preparationTest")
  .post(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "preparationTest"),
    createPreparationTest
  )
  .get(getAllPreparationTest);

router
  .route("/preparationTest/:id")
  .get(getPreparationTest)
  .patch(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "preparationTest"),
    updatePreparationTest
  )
  .delete(deletePreparationTest);

router
  .route("/preparationTestQuestion")
  .post(addPreparationTestQuestions)
  .delete(removeQuestionFromPreparationTest);

router.post("/preparationTestClone", clonePreparationTest);

//Home
router.route("/home").post(homeController).get(getHome);
router
  .route("/home/faq")
  .post(addFaq)
  .patch(updateFaq)
  .get(getAllFaq)
  .delete(deleteFaq);
router.route("/home/faq/:id").get(getFaq);
router.route("/home/support").post(addUpdateSupportMail);

//Test Series
router
  .route("/testSeries")
  .post(
    fileUploader(
      [
        { name: "thumbImage", maxCount: 1 },
        { name: "logo", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 },
      ],
      "testSeries"
    ),
    createTestSeries
  )
  .get(getAllTestSeries);

router
  .route("/testSeries/:id")
  .get(getTestSeries)
  .patch(
    fileUploader(
      [
        { name: "thumbImage", maxCount: 1 },
        { name: "logo", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 },
      ],
      "testSeries"
    ),
    updateTestSeries
  )
  .delete(deleteTestSeries);

//Previous Paper
router
  .route("/previousPaper")
  .post(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "previousPaper"),
    createPreviousPaper
  )
  .get(getAllPreviousPaper);

router
  .route("/previousPaper/:id")
  .get(getPreviousPaper)
  .patch(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "previousPaper"),
    updatePreviousPaper
  )
  .delete(deletePreviousPaper);

//Support
router.route("/support").get(getAllQuery);
router
  .route("/support/:id")
  .get(getQuery)
  .patch(updateQuery)
  .delete(deleteQuery);

//Notification
router
  .route("/notification")
  .post(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "notification"),
    createNotification
  );

//Notes
router
  .route("/notes")
  .post(
    fileUploader(
      [
        { name: "thumbImage", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 },
      ],
      "notes"
    ),
    createNote
  )
  .get(getAllNotes);

router
  .route("/notes/:id")
  .get(getNotes)
  .patch(
    fileUploader(
      [
        { name: "thumbImage", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 },
      ],
      "notes"
    ),
    updateNote
  )
  .delete(deleteNote);

//Notes Subject
router
  .route("/notesubjects")
  .post(
    fileUploader([{ name: "files", maxCount: 10 }], "notes"),
    createNoteSubject
  )
  .get(getAllNoteSubjects);

router
  .route("/notesubjects/:id")
  .get(getNoteSubject)
  .patch(
    fileUploader(
      [
        { name: "thumbImage", maxCount: 1 },
        { name: "files", maxCount: 10 },
      ],
      "notes"
    ),
    updateNoteSubject
  )
  .delete(deleteNoteSubject);

router.post("/assignMcq", addQuestionToMcq);

//Question Image
router
  .route("/questionImage")
  .post(
    fileUploader(
      [
        { name: "questionImageEnglish", maxCount: 1 },
        { name: "solutionImageEnglish", maxCount: 1 },
        { name: "optionImage1English", maxCount: 1 },
        { name: "optionImage2English", maxCount: 1 },
        { name: "optionImage3English", maxCount: 1 },
        { name: "optionImage4English", maxCount: 1 },
        { name: "questionImageHindi", maxCount: 1 },
        { name: "solutionImageHindi", maxCount: 1 },
        { name: "optionImage1Hindi", maxCount: 1 },
        { name: "optionImage2Hindi", maxCount: 1 },
        { name: "optionImage3Hindi", maxCount: 1 },
        { name: "optionImage4Hindi", maxCount: 1 },
      ],
      "question"
    ),
    createQuestionImage
  )
  .get(getAllQuestionImages);

router
  .route("/questionImage/:id")
  .get(getQuestionImage)
  .patch(
    fileUploader(
      [
        { name: "questionImageEnglish", maxCount: 1 },
        { name: "solutionImageEnglish", maxCount: 1 },
        { name: "optionImage1English", maxCount: 1 },
        { name: "optionImage2English", maxCount: 1 },
        { name: "optionImage3English", maxCount: 1 },
        { name: "optionImage4English", maxCount: 1 },
        { name: "questionImageHindi", maxCount: 1 },
        { name: "solutionImageHindi", maxCount: 1 },
        { name: "optionImage1Hindi", maxCount: 1 },
        { name: "optionImage2Hindi", maxCount: 1 },
        { name: "optionImage3Hindi", maxCount: 1 },
        { name: "optionImage4Hindi", maxCount: 1 },
      ],
      "question"
    ),
    updateQuestionImage
  )
  .delete(deleteQuestionImage);

//user
router.get("/user", getAllUsers);

router.post("/addRemoveMcq", addRemoveMcq);

//Question bank
router
  .route("/questionBank")
  .post(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "questionBank"),
    createQuestionBank
  )
  .get(getAllQuestionBank);

router
  .route("/questionBank/:id")
  .get(getQuestionBank)
  .patch(
    fileUploader([{ name: "thumbImage", maxCount: 1 }], "questionBank"),
    updateQuestionBank
  )
  .delete(deleteQuestionBank);

router.post("/addQuestionToQuestionBank", addQuestionToQuestionBank);

router.delete(
  "/removeQuestionFromQuestionBank",
  removeQuestionFromQuestionBank
);

router.get("/dashboard", getDashboard);

module.exports = router;
