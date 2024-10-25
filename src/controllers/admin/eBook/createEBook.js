const eBook = require("../../../models/eBook");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

// CREATE eBook
exports.createEBook = catchAsync(async (req, res, next) => {
  let coverImage;
  let file;

  if (req.files?.coverImage) {
    coverImage = `${req.files.coverImage[0].destination}/${req.files.coverImage[0].filename}`;
  }
  if (req.files?.file) {
    file = `${req.files.file[0].destination}/${req.files.file[0].filename}`;
  }

  console.log(req.files, req.body, "sldfsldfjsldfjlsdjfsljdf");

  try {
    const { title, exam, link } = req.body;

    if (!title) {
      return next(new AppError("Title are required", 400));
    }

    if (!req.files?.coverImage) {
      return next(new AppError("Cover Image are required", 400));
    }

    if (!link) {
      return next(new AppError("Link are required", 400));
    }

    const eBookData = { title };

    if (coverImage) eBookData.coverImage = coverImage;
    if (file) eBookData.file = file;
    if (link) eBookData.link = link;
    if (exam) eBookData.exam = exam;

    const newEBook = await eBook.create(eBookData);

    res.status(201).json({
      status: true,
      message: "eBook created successfully",
      data: { eBook: newEBook },
    });
  } catch (error) {
    if (coverImage) await deleteOldFiles(coverImage);
    if (file) await deleteOldFiles(file);
    return next(error);
  }
});
