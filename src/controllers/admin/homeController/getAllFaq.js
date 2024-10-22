const Home = require("../../../models/home");

exports.getAllFaq = async (req, res, next) => {
  try {
    const faqId = req.params.id;
    const home = await Home.findById("66a363460971bf6ac5286aa4");

    if (!home) {
      return res.status(404).json({
        status: false,
        message: "Home document not found",
      });
    }

    const faq = home.faq;

    if (!faq) {
      return res.status(404).json({
        status: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      status: true,
      data: faq,
    });
  } catch (err) {
    next(err);
  }
};