const Home = require("../../../models/home");

exports.deleteFaq = async (req, res, next) => {
  try {
    const home = await Home.findById("66a363460971bf6ac5286aa4");
    home.faq.pull(req.body.faqId);
    await home.save();

    res.status(200).json({
      status: true,
      message: "Faq delete successfully",
    });
  } catch (err) {
    next(err);
  }
};
