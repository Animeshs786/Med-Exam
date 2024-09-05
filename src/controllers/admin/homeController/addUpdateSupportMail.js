const Home = require("../../../models/home");

exports.addUpdateSupportMail = async (req, res, next) => {
  try {
    const home = await Home.findById("66a363460971bf6ac5286aa4");
    home.supportMail=req.body.supportMail;
    await home.save();

    res.status(200).json({
      status: true,
      message: "Mail Update successfully",
    });
  } catch (err) {
    next(err);
  }
};
