const NoteBook = require("../../../models/notebook");
const catchAsync = require("../../../utils/catchAsync");

// Create a new NoteBook
exports.createNoteBook = catchAsync(async (req, res) => {
  const { classId } = req.body;
  const user = req.user._id;
  let image;

  if (req.files.image) {
    image = `${req.files.image[0].destination}/${req.files.image[0].filename}`;
  }

  const newNoteBook = await NoteBook.create({ user, class: classId, image });

  res.status(201).json({
    status: true,
    message: "NoteBook created successfully.",
    // data: {
    //   notebook: newNoteBook,
    // },
  });
});
